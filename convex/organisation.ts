import { ConvexError, v } from 'convex/values';
import { Doc, Id } from './_generated/dataModel';
import { mutation, query, QueryCtx } from './_generated/server';
import { getLoggedInUser, getUserByUserId, getUserForWorker } from './users';
import { internal } from './_generated/api';

export const getServicePoints = query({
  args: {},
  handler: async (ctx) => {
    const organisations = await ctx.db
      .query('organizations')
      .withIndex('by_id')
      .take(50);
    const shuffled = [...organisations];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const randomTenOrgs = shuffled.slice(0, 5);
    const servicePointsPromises = randomTenOrgs.map(async (organisation) => {
      const servicePoints = await ctx.db
        .query('servicePoints')
        .withIndex('by_organisation_id', (q) =>
          q.eq('organizationId', organisation._id),
        )
        .collect();
      if (servicePoints.length === 0) {
        return null; // Return null for organizations with no service points
      }
      const randomIndex = Math.floor(Math.random() * servicePoints.length);

      return servicePoints[randomIndex];
    });
    return (await Promise.all(servicePointsPromises)).filter(
      (point) => point !== null,
    );
  },
});

export const getOrganisationsOrNull = query({
  args: {},
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) return null;
    const orgs = await ctx.db
      .query('organizations')
      .filter((q) => q.eq(q.field('ownerId'), user._id))
      .first();
    if (!orgs) return null;
    let orgsAvatarUrl = null;
    if (orgs.avatar.startsWith('https')) {
      return {
        ...orgs,
        created_at: orgs._creationTime.toString(),
      };
    }
    if (orgs?.avatar) {
      orgsAvatarUrl = await ctx.storage.getUrl(orgs?.avatar as Id<'_storage'>);
    }
    return {
      _id: orgs._id,
      category: orgs.category,
      created_at: orgs._creationTime.toString(),
      description: orgs.description,
      email: orgs.email,
      end: orgs.end,
      followers: orgs.followers,
      followersCount: orgs.followersCount,
      location: orgs.location,
      name: orgs.name,
      ownerId: orgs.ownerId,
      start: orgs.start,
      website: orgs.website,
      workDays: orgs.workDays,
      workspaceCount: orgs.workspaceCount,
      has_group: orgs.has_group,
      avatar: orgsAvatarUrl,
      searchCount: orgs.searchCount,
    };
  },
});
export const getOrganisationsWithPostAndWorkers = query({
  args: {
    id: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const orgs = await ctx.db.get(args.id);

    if (!orgs) {
      throw new ConvexError({ message: 'Organization not found' });
    }
    const posts = await getPosts(ctx, args.id);
    const workers = await getWorkspaceWithWorkerAndUserProfile(ctx, orgs._id);

    return {
      ...orgs,
      posts,
      workers: workers.filter((m) => m.type !== 'processor' && m.workspaceId),
    };
  },
});
export const getOrganisationWithServicePoints = query({
  args: {
    organizationId: v.id('organizations'),
  },
  handler: async (ctx, { organizationId }) => {
    const organization = await getOrganizationByOrganizationId(
      ctx,
      organizationId,
    );

    const servicePoints = await ctx.db
      .query('servicePoints')
      .withIndex('by_organisation_id', (q) =>
        q.eq('organizationId', organizationId),
      )
      .collect();

    return {
      organization,
      servicePoints,
    };
  },
});

export const getOrganisationById = query({
  args: {
    organisationId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) return null;
    if (organisation.avatar.startsWith('https')) {
      return organisation;
    }

    const imageUrl = await getImageUrl(
      ctx,
      organisation.avatar as Id<'_storage'>,
    );
    return {
      ...organisation,
      avatar: imageUrl,
    };
  },
});

export const getOrganizationByBossId = query({
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) return null;
    return await ctx.db
      .query('organizations')
      .withIndex('ownerId', (q) => q.eq('ownerId', user._id))
      .first();
  },
});
export const getOrganizationWithOwnerAndWorkspaces = query({
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'query');
    if (!user) return null;
    const result = await ctx.db
      .query('organizations')
      .withIndex('ownerId', (q) => q.eq('ownerId', user._id))
      .first();

    if (!result) return null;

    const [owner, workspaces] = await Promise.all([
      getUserByOwnerId(ctx, result.ownerId),
      getWorkspacesByOrganizationId(ctx, result._id),
    ]);

    return {
      ...result,
      avatar: result.avatar,
      owner,
      workspaces,
    };
  },
});
export const getPostsByOrganizationId = query({
  args: {
    organizationId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('posts')
      .withIndex('by_org_id', (q) =>
        q.eq('organizationId', args.organizationId),
      )
      .collect();
  },
});
export const getTopSearches = query({
  args: {
    userId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('organizations')
      .withIndex('by_search_count')
      .filter((q) => q.neq(q.field('ownerId'), args.userId))
      .order('desc')
      .take(5);

    return res.map((org) => {
      return {
        id: org._id,
        name: org.name,
        ownerId: org.ownerId,
        avatar: org.avatar,
      };
    });
  },
});
export const getOrganisationsByServicePointsSearchQuery = query({
  args: {
    query: v.optional(v.string()),
    ownerId: v.id('users'),
  },
  handler: async (ctx, { query, ownerId }) => {
    if (!query) return [];
    const servicePoints = await ctx.db
      .query('servicePoints')
      .withSearchIndex('description', (q) => q.search('description', query))
      .collect();
    if (!servicePoints) return [];
    const organisation = await Promise.all(
      servicePoints?.map(async (s) => {
        return await getOrganizationByServicePointOrganizationId(
          ctx,
          s.organizationId,
        );
      }),
    );

    return organisation.filter((org) => org?.ownerId !== ownerId) || [];
  },
});
export const getOrganisationsByServicePointsSearchQueryName = query({
  args: {
    query: v.optional(v.string()),
    ownerId: v.id('users'),
  },
  handler: async (ctx, { query, ownerId }) => {
    if (!query) return [];
    const servicePoints = await ctx.db
      .query('servicePoints')
      .withSearchIndex('name', (q) => q.search('name', query))
      .collect();
    if (!servicePoints) return [];
    console.log({ servicePoints });
    const organisation = await Promise.all(
      servicePoints?.map(async (s) => {
        return await getOrganizationByServicePointOrganizationId(
          ctx,
          s.organizationId,
        );
      }),
    );

    return organisation.filter((org) => org?.ownerId !== ownerId) || [];
  },
});

export const getOrganisationsBySearchQuery = query({
  args: {
    query: v.optional(v.string()),
    ownerId: v.id('users'),
  },
  handler: async (ctx, { query, ownerId }) => {
    if (!query) return [];
    const organisations = await ctx.db
      .query('organizations')
      .withSearchIndex('name', (q) => q.search('name', query))
      .filter((q) => q.neq(q.field('ownerId'), ownerId))
      .collect();
    if (!organisations) return [];

    return organisations.map((org) => {
      return {
        name: org.name,
        avatar: org.avatar,
        id: org._id,
        ownerId: org.ownerId,
        description: org.description,
      };
    });
  },
});
export const getStaffsByBossId = query({
  args: {},
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) return [];
    const res = await ctx.db
      .query('workers')
      .withIndex('boss_Id', (q) => q.eq('bossId', me._id))
      .filter((q) => q.neq(q.field('userId'), me._id))
      .collect();
    return await Promise.all(
      res.map(async (worker) => {
        const userProfile = await getUserForWorker(ctx, worker.userId);
        const organization = await getOrganizationByOrganizationId(
          ctx,
          worker.organizationId!,
        );
        const workspace = await getWorkspaceByWorkerWorkspaceId(
          ctx,
          worker.workspaceId!,
        );

        return {
          ...worker,
          user: userProfile,
          organization,
          workspace,
        };
      }),
    );
  },
});
export const getStaffsByBossIdNotHavingServicePoint = query({
  args: {
    bossId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query('workers')
      .filter((q) =>
        q.and(
          q.eq(q.field('bossId'), args.bossId),
          q.neq(q.field('userId'), args.bossId),
          q.eq(q.field('servicePointId'), undefined),
        ),
      )
      .collect();
    return await Promise.all(
      res.map(async (worker) => {
        const userProfile = await getUserForWorker(ctx, worker.userId);
        const organization = await getOrganizationByOrganizationId(
          ctx,
          worker.organizationId!,
        );
        const workspace = await getWorkspaceByWorkerWorkspaceId(
          ctx,
          worker.workspaceId!,
        );

        return {
          worker,
          user: userProfile,
          organization,
          workspace,
        };
      }),
    );
  },
});
//  mutations

export const createOrganization = mutation({
  args: {
    category: v.string(),
    description: v.string(),
    email: v.string(),
    end: v.string(),
    location: v.string(),
    name: v.string(),

    start: v.string(),
    website: v.string(),
    workDays: v.string(),
    avatarId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const user = await getLoggedInUser(ctx, 'mutation');
    if (!user) {
      throw new ConvexError({ message: 'Unauthorized' });
    }
    const organizationExist = await ctx.db
      .query('organizations')
      .withIndex('by_name', (q) => q.eq('name', args.name))
      .first();
    if (organizationExist) {
      throw new ConvexError({ message: 'Organization with name exists' });
    }
    const avatar = await getImageUrl(ctx, args.avatarId);
    const organizationId = await ctx.db.insert('organizations', {
      ...args,
      has_group: false,
      workspaceCount: 0,
      followersCount: 0,
      searchCount: 0,
      avatar: avatar!,
      ownerId: user._id,
    });
    if (!organizationId) {
      throw new ConvexError({ message: 'Failed to create organization' });
    }
    await ctx.db.patch(user._id, {
      organizationId: organizationId,
    });
    await ctx.scheduler.runAfter(0, internal.sendEmails.sendNewOrgEmail, {
      name: args.name as string,
      email: args.email as string,
    });
    await ctx.scheduler.runAfter(0, internal.users.sendNotice, {
      orgId: organizationId,
      address: args.location,
      email: args.email,
      description: args.description,
      name: args.name,
      imageUrl: avatar || '',
      cursor: null,
      numItems: 400,
      userId: user._id,
    });
  },
});

export const updateOrganization = mutation({
  args: {
    organizationId: v.id('organizations'),
    avatar: v.union(v.id('_storage'), v.string()),
    category: v.string(),
    description: v.string(),
    email: v.string(),
    end: v.string(),
    location: v.string(),
    name: v.string(),
    start: v.string(),
    website: v.string(),
    workDays: v.string(),
    oldId: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    if (args.oldId) {
      await ctx.storage.delete(args.oldId);
      const image = await ctx.storage.getUrl(args.avatar);
      await ctx.db.patch(args.organizationId, {
        avatar: image!,
        location: args.location,
        email: args.email,
        description: args.description,
        name: args.name,
        start: args.start,
        end: args.end,
        website: args.website,
        workDays: args.workDays,
        category: args.category,
        avatarId: args.avatar as Id<'_storage'>,
      });
    } else {
      await ctx.db.patch(args.organizationId, {
        location: args.location,
        email: args.email,
        description: args.description,
        name: args.name,
        start: args.start,
        end: args.end,
        website: args.website,
        workDays: args.workDays,
        category: args.category,
      });
    }
  },
});

// posts
export const createPosts = mutation({
  args: {
    organizationId: v.id('organizations'),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const image = await ctx.storage.getUrl(args.storageId);
    if (!image) {
      throw new ConvexError('Failed to upload post');
    }
    await ctx.db.insert('posts', {
      image,
      organizationId: args.organizationId,
      imageId: args.storageId,
    });
  },
});

export const deletePosts = mutation({
  args: {
    postId: v.id('posts'),
  },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new ConvexError('Post not found');
    }
    await ctx.storage.delete(post.imageId);
    await ctx.db.delete(post._id);
  },
});
export const handleFollow = mutation({
  args: {
    organizationId: v.id('organizations'),
    userId: v.id('users'),
  },
  handler: async (ctx, { organizationId, userId }) => {
    const organization = await ctx.db.get(organizationId);
    if (!organization) return;
    const isFollowing = organization?.followers?.includes(userId);
    const prevFollowers = organization?.followers || [];
    if (!isFollowing) {
      await ctx.db.patch(organizationId, {
        followers: [...prevFollowers, userId],
      });
    } else {
      await ctx.db.patch(organizationId, {
        followers: prevFollowers.filter((f) => f !== userId),
      });
    }
  },
});
// helpers

export const getUserByOwnerId = async (ctx: QueryCtx, ownerId: Id<'users'>) => {
  const result = await ctx.db.get(ownerId);
  if (!result) return null;

  return result;
};

export const getWorkspacesByOrganizationId = async (
  ctx: QueryCtx,
  organizationId: Id<'organizations'>,
) => {
  return await ctx.db
    .query('workspaces')
    .withIndex('personal', (q) =>
      q.eq('organizationId', organizationId).eq('type', 'personal'),
    )
    .first();
};

export const getImageUrl = async (ctx: QueryCtx, storageId: Id<'_storage'>) => {
  return await ctx.storage.getUrl(storageId);
};

export const getOrganizationByOrganizationId = async (
  ctx: QueryCtx,
  organizationId: Id<'organizations'>,
) => {
  const res = await ctx.db.get(organizationId);
  if (!res) {
    throw new ConvexError({ message: 'Organization not found' });
  }
  const owner = await getUserByOwnerId(ctx, res.ownerId!);
  if (!owner) {
    throw new ConvexError({ message: 'Owner not found' });
  }
  if (res.avatar.startsWith('https'))
    return {
      ...res,
      owner,
    };
  const organizationAvatar = await ctx.storage.getUrl(
    res.avatar as Id<'_storage'>,
  );

  return {
    ...res,
    avatar: organizationAvatar,
    owner,
  };
};
export const getOrganizationByServicePointOrganizationId = async (
  ctx: QueryCtx,
  organizationId: Id<'organizations'>,
) => {
  const res = await ctx.db.get(organizationId);
  if (!res) return null;

  return {
    name: res.name,
    avatar: res.avatar,
    id: res._id,
    ownerId: res.ownerId,
    description: res.description,
  };
};

export const getOrganizationByOwnerId = async (
  ctx: QueryCtx,
  id: Id<'users'>,
) => {
  const res = await ctx.db
    .query('organizations')
    .withIndex('ownerId', (q) => q.eq('ownerId', id))
    .first();
  if (!res) return null;

  return res;
};

export const getWorkspaceByWorkerWorkspaceId = async (
  ctx: QueryCtx,
  workspaceId: Id<'workspaces'>,
) => {
  if (!workspaceId) return null;
  return await ctx.db.get(workspaceId);
};

export const getPosts = async (ctx: QueryCtx, orgsId: Id<'organizations'>) => {
  const res = await ctx.db
    .query('posts')
    .withIndex('by_org_id', (q) => q.eq('organizationId', orgsId))
    .collect();

  if (!res) return [];
  return res;
};

export const getWorkspaceWithWorkerAndUserProfile = async (
  ctx: QueryCtx,
  orgsId: Id<'organizations'>,
) => {
  const workers = await ctx.db
    .query('workers')
    .withIndex('by_org_id', (q) => q.eq('organizationId', orgsId))
    .collect();

  return await Promise.all(
    workers.map(async (worker) => {
      const user = await getUserByUserId(ctx, worker?.userId!);
      const workspace = await getWorkspaceByWorkerWorkspaceId(
        ctx,
        worker?.workspaceId!,
      );
      return {
        ...worker,
        user,
        workspace,
      };
    }),
  );
};

// mutation

export const increaseSearchCount = mutation({
  args: {
    id: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.id);
    if (!org) return;
    await ctx.db.patch(org._id, {
      searchCount: org.searchCount + 1,
    });
  },
});

export const deleteImageId = mutation({
  args: {
    id: v.id('_storage'),
    orgsId: v.id('organizations'),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orgsId, {
      avatar: undefined,
    });
    return await ctx.storage.delete(args.id);
  },
});

export const getTeamMembers = query({
  args: {
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    const emptyResult = {
      boss: null,
      workers: [],
    };
    if (!workspace) return emptyResult;
    const organization = await ctx.db.get(workspace.organizationId);
    if (!organization) return emptyResult;
    const workers = await ctx.db
      .query('workers')
      .withIndex('by_org_id', (q) => q.eq('organizationId', organization._id))
      .collect();

    const boss = await getUserByUserId(ctx, organization.ownerId);
    const workersWithProfiles = await Promise.all(
      workers.map(async (worker) => {
        const user = await getUserByUserId(ctx, worker.userId);
        return {
          ...worker,
          user,
        };
      }),
    );

    return {
      boss,
      workers: workersWithProfiles,
    };
  },
});
