import { ConvexError, v } from 'convex/values';

import { getAuthUserId } from '@convex-dev/auth/server';
import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import {
  internalAction,
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from './_generated/server';
import { isPremium } from './helper';
import { polar } from './polar';

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('users').collect();
  },
});
export const getUser = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      return null;
    }

    return {
      ...user,
    };
  },
});

export const getSubscriptions = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const subscription = await polar.getCurrentSubscription(ctx, {
      userId: user._id,
    });

    return {
      subscription,
      isFree: !subscription,
      isPremium: isPremium(subscription?.productKey),
    };
  },
});

export const createUser = internalMutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    name: v.string(),
    isOnline: v.boolean(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const id = await ctx.db.insert('users', {
      ...args,
      userId: identity.subject,
    });
    console.log('User created');
    await ctx.scheduler.runAfter(0, internal.users.createStreamToken, { id });
  },
});

export const updatePushToken = mutation({
  args: {
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return;
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (user) {
      await ctx.db.patch(user._id, {
        pushToken: args.pushToken,
      });
    }
  },
});
export const createStreamToken = internalAction({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, { id }) => {
    const response = await fetch(`https://wks.onrender.com/user/${id}`);
    const { token } = await response.json();
    console.log({ token });
    await ctx.scheduler.runAfter(0, internal.users.createToken, {
      id,
      streamToken: token,
    });
  },
});

export const createToken = internalMutation({
  args: {
    id: v.id('users'),
    streamToken: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (user) {
      await ctx.db.patch(user?._id, {
        streamToken: args.streamToken,
      });
    }
  },
});
// export const setOnline = internalMutation({
//   args: {
//     id: v.id('users'),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.patch(args.id, {
//       isOnline: true,
//     });
//   },
// });

export const getUserByClerkId = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) {
      return null;
    }
    let workProfile;
    if (user?.workerId) {
      workProfile = await ctx.db.get('workers', user?.workerId);
    }

    return {
      ...user,
      worker: workProfile,
    };
  },
});
export const getUserById = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    return await getUserByIdHelper(ctx, args.id);
  },
});

export const getOrganisations = async (
  ctx: QueryCtx,
  organizationId: Id<'organizations'>
) => {
  if (!organizationId) return null;
  return await ctx.db.get(organizationId);
};

export const updateUserById = mutation({
  args: {
    _id: v.id('users'),
    name: v.string(),
    phoneNumber: v.optional(v.string()),
    imageUrl: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args._id);
    if (!user) throw new Error('User not found');

    let img;
    if (args.imageUrl) {
      if (args.imageUrl !== user.storageId && user.storageId) {
        await ctx.storage.delete(user.storageId);
      }
      img = await ctx.storage.getUrl(args.imageUrl);
      await ctx.db.patch(args._id, {
        name: args.name,
        phoneNumber: args.phoneNumber,
        image: img!,
        storageId: args.imageUrl,
      });
    } else {
      await ctx.db.patch(args._id, {
        name: args.name,
        phoneNumber: args.phoneNumber,
      });
    }
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const updateImage = mutation({
  args: { storageId: v.id('_storage'), _id: v.id('users') },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, {
      imageUrl: args.storageId,
    });
  },
});

export const createWorkerProfile = mutation({
  args: {
    experience: v.string(),
    location: v.string(),
    skills: v.string(),
    gender: v.string(),
    email: v.string(),
    qualifications: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError('Unauthorized');
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) throw new ConvexError('Unauthorized');
    const workerId = await ctx.db.insert('workers', {
      ...args,
      userId: user._id,
    });
    await ctx.db.patch(user._id, { workerId });
    return user._id;
  },
});

export const updateWorkerProfile = mutation({
  args: {
    _id: v.id('workers'),
    experience: v.string(),
    location: v.string(),
    skills: v.string(),
    gender: v.string(),
    qualifications: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.patch(args._id, {
      experience: args.experience,
      location: args.location,
      skills: args.skills,
      qualifications: args.qualifications,
      gender: args.gender,
    });
  },
});
export const getWorkerProfileWithUser = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) return null;
    // Fetch worker
    const worker = await ctx.db
      .query('workers')
      .filter((q) => q.eq(q.field('userId'), identity.subject))
      .first();

    if (!worker) return null;

    // Fetch user

    // Fetch and process organization
    const organization = await getOrganisations(
      ctx,
      worker?.organizationId as Id<'organizations'>
    );

    // Process user image

    // Return processed data
    return {
      user,
      ...worker,
      organization,
    };
  },
});

export const getUserForWorker = async (ctx: QueryCtx, userId: Id<'users'>) => {
  return await ctx.db.get(userId);
};
export const getWorkerProfile = async (ctx: QueryCtx, userId: Id<'users'>) => {
  return await ctx.db
    .query('workers')
    .withIndex('userId', (q) => q.eq('userId', userId))
    .first();
};

export const getUserByWorkerId = async (
  ctx: QueryCtx,
  workerId: Id<'workers'>
) => {
  const user = await ctx.db
    .query('users')
    .filter((q) => q.eq(q.field('workerId'), workerId))
    .first();
  if (!user) return null;
  return user;
};

export const getOrganisationWithoutImageByWorker = async (
  ctx: QueryCtx,
  organizationId: Id<'organizations'>
) => {
  if (!organizationId) return null;
  return await ctx.db.get(organizationId);
};

export const getLoggedInUser = async (
  ctx: QueryCtx | MutationCtx,
  type: 'query' | 'mutation'
) => {
  const identity = await ctx.auth.getUserIdentity();

  if (type === 'query' && !identity) return null;
  if (type === 'mutation' && !identity) {
    throw new ConvexError('Unauthorized');
  }

  if (!identity) return null;
  return await getUserByIdHelper(ctx, identity.subject);
};

export const findUserByEmail = async (ctx: MutationCtx, email: string) => {
  return await ctx.db
    .query('users')
    .withIndex('email', (q) => q.eq('email', email))
    .first();
};

export const updateStreamToken = mutation({
  args: {
    streamToken: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db.patch(userId, {
      streamToken: args.streamToken,
    });
  },
});

export const getUsersWithTokens = query({
  args: {
    cursor: v.union(v.string(), v.null()),
    numItems: v.number(),
  },
  handler: async (ctx, { cursor, numItems }) => {
    return await ctx.db
      .query('users')
      .withIndex('by_id')
      .filter((q) =>
        q.and(
          q.neq(q.field('pushToken'), null),
          q.neq(q.field('pushToken'), ''),
          q.neq(q.field('pushToken'), undefined)
        )
      )
      .paginate({ cursor, numItems });
  },
});

export const createMissedCallRecord = mutation({
  args: {
    callId: v.string(),
    userId: v.id('users'),
    missedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('missedCalls', {
      callId: args.callId,
      userId: args.userId,
      missedAt: args.missedAt,
      seen: false,
    });
  },
});

export const markMissedCallsAsSeen = mutation({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const missedCalls = await ctx.db
      .query('missedCalls')
      .withIndex('by_user_id', (q) =>
        q.eq('userId', args.userId).eq('seen', false)
      )
      .collect();

    for (const call of missedCalls) {
      await ctx.db.patch(call._id, { seen: true });
    }
  },
});

export const getMissedCalls = query({
  args: {},
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await getUserByIdHelper(ctx, identity.subject);
    if (!user) return 0;
    const calls = await ctx.db
      .query('missedCalls')
      .withIndex('by_user_id', (q) =>
        q.eq('userId', user._id).eq('seen', false)
      )
      .collect();
    // unique calls by callId
    const uniqueCallIds = new Set<string>();
    const uniqueCalls = calls.filter((call) => {
      if (uniqueCallIds.has(call.callId)) {
        return false;
      } else {
        uniqueCallIds.add(call.callId);
        return true;
      }
    });
    return uniqueCalls.length;
  },
});
export const getMissedCallByCallId = query({
  args: {
    userId: v.id('users'),
    callId: v.string(),
  },
  handler: async (ctx, args) => {
    const call = await ctx.db
      .query('missedCalls')
      .withIndex('by_call_id_user_id', (q) =>
        q.eq('callId', args.callId).eq('userId', args.userId)
      )
      .first();
    // unique calls by callId

    return !!call;
  },
});

export const getUserImage = async (ctx: QueryCtx, imageId: Id<'_storage'>) => {
  return await ctx.storage.getUrl(imageId);
};

export const getUserByIdHelper = async (
  ctx: QueryCtx | MutationCtx,
  userId: string
) => {
  return await ctx.db
    .query('users')
    .withIndex('by_userId', (q) => q.eq('userId', userId))
    .first();
};
