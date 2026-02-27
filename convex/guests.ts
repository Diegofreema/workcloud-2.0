import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { mutation, query } from './_generated/server';
import { getAuthUserBySubject, getWorkerProfile } from './users';

export const getGuests = query({
  args: {
    workspaceId: v.id('workspaces'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { workspaceId, paginationOpts }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const authUser = await getAuthUserBySubject(ctx, identity.subject);
    if (!authUser) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    // Only workers of this workspace can view guests
    const worker = await getWorkerProfile(ctx, authUser._id);
    if (!worker || worker.workspaceId !== workspaceId) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const guestPage = await ctx.db
      .query('guests')
      .withIndex('by_workspace_id', (q) => q.eq('workspaceId', workspaceId))
      .order('desc')
      .paginate(paginationOpts);

    const page = await Promise.all(
      guestPage.page.map(async (guest) => {
        const user = await ctx.db.get(guest.userId);
        let imageUrl: string | null = user?.image ?? null;
        if (user?.storageId) {
          imageUrl = await ctx.storage.getUrl(user.storageId);
        }
        return {
          ...guest,
          user,
          imageUrl,
        };
      }),
    );

    return { ...guestPage, page };
  },
});

export const deleteGuest = mutation({
  args: {
    guestId: v.id('guests'),
  },
  handler: async (ctx, { guestId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const authUser = await getAuthUserBySubject(ctx, identity.subject);
    if (!authUser) {
      throw new ConvexError({ message: 'Unauthorized' });
    }

    const guest = await ctx.db.get(guestId);
    if (!guest) {
      throw new ConvexError({ message: 'Guest not found' });
    }

    await ctx.db.delete(guestId);
  },
});
