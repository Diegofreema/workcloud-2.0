import { v } from 'convex/values';

import { User } from '~/constants/types';
import { internal } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import {
  internalAction,
  internalMutation,
  mutation,
  query,
  QueryCtx,
} from '~/convex/_generated/server';

export const getAllUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query('users').collect();
  },
});
export const getUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('users')
      .withIndex('clerkId', (q) => q.eq('clerkId', args.userId))
      .first();
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
    const id = await ctx.db.insert('users', {
      ...args,
    });
    console.log('User created');
    await ctx.scheduler.runAfter(0, internal.users.createStreamToken, { id });
  },
});
export const addUserToDb = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
    imageUrl: v.optional(v.string()),
    name: v.string(),
    pushToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const isUserInDb = await ctx.db
      .query('users')
      .withIndex('clerkId', (q) => q.eq('clerkId', args.clerkId))
      .unique();
    if (isUserInDb && !isUserInDb?.pushToken) {
      await ctx.db.patch(isUserInDb?._id, {
        pushToken: args.pushToken,
      });
    }
    if (isUserInDb)
      return {
        id: isUserInDb._id!,
        name: isUserInDb.name!,
        pushToken: isUserInDb.pushToken,
      };
    const id = await ctx.db.insert('users', {
      ...args,
    });
    const user = await ctx.db.get(id);

    return {
      id: user?._id!,
      name: user?.name!,
      pushToken: user?.pushToken,
    };
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
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query('users')
      .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
      .unique();
    let workProfile;
    if (user?.workerId) {
      workProfile = await ctx.db.get(user?.workerId!);
    }

    return {
      ...user,
      imageUrl: user?.imageUrl,
      worker: workProfile,
    };
  },
});
export const getUserById = query({
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user?.imageUrl || user.imageUrl.startsWith('http')) {
      return user;
    }

    const url = await ctx.storage.getUrl(user.imageUrl as Id<'_storage'>);

    return {
      ...user,
      imageUrl: url,
    };
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
    let img;
    if (args.imageUrl) {
      img = await ctx.storage.getUrl(args.imageUrl);
      await ctx.db.patch(args._id, {
        name: args.name,
        phoneNumber: args.phoneNumber,
        imageUrl: img!,
      });
    } else {
      await ctx.db.patch(args._id, {
        name: args.name,
        phoneNumber: args.phoneNumber,
      });
    }
  },
});

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
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
    userId: v.id('users'),
    experience: v.string(),
    location: v.string(),
    skills: v.string(),
    gender: v.string(),
    email: v.string(),
    qualifications: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert('workers', { ...args });
  },
});

export const updateWorkerIdOnUserTable = mutation({
  args: {
    workerId: v.id('workers'),
    _id: v.id('users'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args._id, { workerId: args.workerId });
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
  args: {
    id: v.id('users'),
  },
  handler: async (ctx, args) => {
    // Fetch worker
    const worker = await ctx.db
      .query('workers')
      .filter((q) => q.eq(q.field('userId'), args.id))
      .first();

    if (!worker) return null;

    // Fetch user
    const user = await getUserForWorker(ctx, worker.userId);
    if (!user) return null;

    // Fetch and process organization
    const organisation = await getOrganisations(ctx, worker?.organizationId!);
    const processedOrganization = organisation
      ? organisation.avatar.startsWith('http')
        ? organisation
        : {
            ...organisation,
            avatar: await ctx.storage.getUrl(
              organisation.avatar as Id<'_storage'>
            ),
          }
      : null;

    // Process user image
    const { _creationTime, imageUrl, ...userRest } = user;
    const processedImageUrl = imageUrl?.startsWith('http')
      ? imageUrl
      : imageUrl
        ? await ctx.storage.getUrl(imageUrl as Id<'_storage'>)
        : null;

    // Return processed data
    return processedImageUrl
      ? {
          user: {
            imageUrl: processedImageUrl,
            ...userRest,
          },
          ...worker,
          organization: processedOrganization,
        }
      : null;
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

export const getUserByUserId = async (ctx: QueryCtx, userId?: Id<'users'>) => {
  if (!userId) return null;
  return await ctx.db.get(userId);
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
  return await helperToGetUser(ctx, user);
};

export const getOrganisationWithoutImageByWorker = async (
  ctx: QueryCtx,
  organizationId: Id<'organizations'>
) => {
  if (!organizationId) return null;
  return await ctx.db.get(organizationId);
};

const helperToGetUser = async (ctx: QueryCtx, user: User) => {
  return user;
};
