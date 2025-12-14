import { v } from 'convex/values';
import { query, QueryCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

export const fetchMember = query({
  args: { userId: v.id('users'), group: v.id('conversations') },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('members')
      .withIndex('by_member_id_conversation_id', (q) =>
        q.eq('memberId', args.userId).eq('conversationId', args.group)
      )
      .first();
  },
});

export const getMemberHelper = async (
  ctx: QueryCtx,
  conversationId: Id<'conversations'>,
  userId: Id<'users'>
) => {
  return await ctx.db
    .query('members')
    .withIndex('by_member_id_conversation_id', (q) =>
      q.eq('memberId', userId).eq('conversationId', conversationId)
    )
    .first();
};
