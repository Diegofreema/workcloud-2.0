import { ConvexError, v } from "convex/values";

import { FullOrgsType } from "~/constants/types";
import { Id } from "~/convex/_generated/dataModel";
import { mutation, query, QueryCtx } from "~/convex/_generated/server";
import { getUserByUserId, getUserForWorker } from "~/convex/users";

export const getOrganisationsOrNull = query({
  args: {
    ownerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    if (!args.ownerId) return null;
    const orgs = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
      .first();
    if (!orgs) return null;
    let orgsAvatarUrl = null;
    if (orgs.avatar.startsWith("https")) {
      return {
        ...orgs,
        created_at: orgs._creationTime.toString(),
      };
    }
    if (orgs?.avatar) {
      orgsAvatarUrl = await ctx.storage.getUrl(orgs?.avatar as Id<"_storage">);
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
    id: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const orgs = await ctx.db.get(args.id);

    if (!orgs) return null;
    const posts = await getPosts(ctx, args.id);
    const workers = await getWorkspaceWithWorkerAndUserProfile(ctx, orgs._id);
    const avatar = await getImageUrl(ctx, orgs.avatar as Id<"_storage">);
    return {
      ...orgs,
      avatar,
      posts,
      workers: workers.filter((m) => m.type !== "processor"),
    };
  },
});
export const getOrganisationWithServicePoints = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { organizationId }) => {
    const organization = await getOrganizationByOrganizationId(
      ctx,
      organizationId,
    );
    const servicePoints = await ctx.db
      .query("servicePoints")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organizationId", organizationId),
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
    organisationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const organisation = await ctx.db.get(args.organisationId);
    if (!organisation) return null;
    if (organisation.avatar.startsWith("https")) {
      return organisation;
    }

    const imageUrl = await getImageUrl(
      ctx,
      organisation.avatar as Id<"_storage">,
    );
    return {
      ...organisation,
      avatar: imageUrl,
    };
  },
});
export const getOrganizationWithOwnerAndWorkspaces = query({
  args: {
    ownerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query("organizations")
      .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
      .first();

    if (!result) return null;

    const [owner, workspaces] = await Promise.all([
      getUserByOwnerId(ctx, result.ownerId),
      getWorkspacesByOrganizationId(ctx, result._id),
    ]);
    if (result.avatar.startsWith("https")) {
      return {
        ...result,
        owner,
        workspaces,
      };
    }

    const avatarUrl = await ctx.storage.getUrl(result.avatar as Id<"_storage">);
    return {
      ...result,
      avatar: avatarUrl,
      owner,
      workspaces,
    };
  },
});
export const getPostsByOrganizationId = query({
  args: {
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query("posts")
      .withIndex("by_org_id", (q) =>
        q.eq("organizationId", args.organizationId),
      )
      .collect();

    if (!res) return null;

    return await Promise.all(
      res.map(async (r) => {
        if (r.image.startsWith("https")) {
          return r;
        }
        const imageUrl = await getImageUrl(ctx, r.image as Id<"_storage">);

        return {
          ...r,
          image: imageUrl,
        };
      }),
    );
  },
});
export const getTopSearches = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const findIfLoggedInUserOwnsAnOrganisation = await ctx.db
      .query("organizations")
      .withIndex("ownerId", (q) => q.eq("ownerId", args.userId))
      .first();
    const takeNumber = findIfLoggedInUserOwnsAnOrganisation ? 6 : 5;
    const res = await ctx.db
      .query("organizations")
      .withIndex("by_search_count")
      .order("desc")
      .take(takeNumber);
    let orgs: FullOrgsType[];
    if (findIfLoggedInUserOwnsAnOrganisation) {
      orgs = res.filter((r) => r.ownerId !== args.userId);
    } else {
      orgs = res;
    }

    return await Promise.all(
      orgs.map(async (org) => {
        const avatar = await getImageUrl(ctx, org?.avatar as Id<"_storage">);
        return {
          id: org._id,
          name: org.name,
          ownerId: org.ownerId,
          avatar,
        };
      }),
    );
  },
});
export const getOrganisationsByServicePointsSearchQuery = query({
  args: {
    query: v.optional(v.string()),
    ownerId: v.id("users"),
  },
  handler: async (ctx, { query, ownerId }) => {
    if (!query) return [];
    const servicePoints = await ctx.db
      .query("servicePoints")
      .withSearchIndex("description", (q) => q.search("description", query))
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
export const getOrganisationsBySearchQuery = query({
  args: {
    query: v.optional(v.string()),
    ownerId: v.id("users"),
  },
  handler: async (ctx, { query, ownerId }) => {
    if (!query) return [];
    const organisations = await ctx.db
      .query("organizations")
      .withSearchIndex("name", (q) => q.search("name", query))
      .filter((q) => q.neq(q.field("ownerId"), ownerId))
      .collect();
    if (!organisations) return [];
    const organisationsWithImages = await Promise.all(
      organisations.map(async (org) => {
        const avatar = await getImageUrl(ctx, org.avatar as Id<"_storage">);
        return {
          name: org.name,
          avatar,
          id: org._id,
          ownerId: org.ownerId,
          description: org.description,
        };
      }),
    );

    return organisationsWithImages || [];
  },
});
export const getStaffsByBossId = query({
  args: {
    bossId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query("workers")
      .withIndex("boss_Id", (q) => q.eq("bossId", args.bossId))
      .filter((q) => q.neq(q.field("userId"), args.bossId))
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
        if (userProfile?.imageUrl?.startsWith("https")) {
          return {
            ...worker,
            user: userProfile,
            organization,
            workspace,
          };
        }
        const imageUrl = await getImageUrl(
          ctx,
          userProfile?.imageUrl as Id<"_storage">,
        );
        return {
          ...worker,
          user: {
            ...userProfile,
            imageUrl,
          },
          organization,
          workspace,
        };
      }),
    );
  },
});
export const getStaffsByBossIdNotHavingServicePoint = query({
  args: {
    bossId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const res = await ctx.db
      .query("workers")
      .filter((q) =>
        q.and(
          q.eq(q.field("bossId"), args.bossId),
          q.neq(q.field("userId"), args.bossId),
          q.eq(q.field("servicePointId"), undefined),
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
        if (userProfile?.imageUrl?.startsWith("https")) {
          return {
            ...worker,
            user: userProfile,
            organization,
            workspace,
          };
        }
        const imageUrl = await getImageUrl(
          ctx,
          userProfile?.imageUrl as Id<"_storage">,
        );
        return {
          ...worker,
          user: {
            ...userProfile,
            imageUrl,
          },
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
    avatar: v.id("_storage"),
    category: v.string(),
    description: v.string(),
    email: v.string(),
    end: v.string(),
    location: v.string(),
    name: v.string(),
    ownerId: v.id("users"),
    start: v.string(),
    website: v.string(),
    workDays: v.string(),
  },
  handler: async (ctx, args) => {
    const organizationExist = await ctx.db
      .query("organizations")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();
    if (organizationExist) {
      throw new ConvexError("Organization with name exists");
    }
    const organizationId = await ctx.db.insert("organizations", {
      ...args,
      has_group: false,
      workspaceCount: 0,
      followersCount: 0,
      searchCount: 0,
    });
    if (!organizationId) {
      throw new ConvexError("Failed to create organization");
    }
    await ctx.db.patch(args.ownerId, {
      organizationId: organizationId,
    });
  },
});

export const updateOrganization = mutation({
  args: {
    organizationId: v.id("organizations"),
    avatar: v.union(v.id("_storage"), v.string()),
    category: v.string(),
    description: v.string(),
    email: v.string(),
    end: v.string(),
    location: v.string(),
    name: v.string(),
    start: v.string(),
    website: v.string(),
    workDays: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.organizationId, {
      avatar: args.avatar,
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
  },
});

// posts
export const createPosts = mutation({
  args: {
    organizationId: v.id("organizations"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("posts", {
      image: args.storageId,
      organizationId: args.organizationId,
    });
  },
});

export const deletePosts = mutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.postId);
  },
});
export const handleFollow = mutation({
  args: {
    organizationId: v.id("organizations"),
    userId: v.id("users"),
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

export const getUserByOwnerId = async (ctx: QueryCtx, ownerId: Id<"users">) => {
  const result = await ctx.db.get(ownerId);
  if (!result) return null;
  if (result.imageUrl?.startsWith("http")) return result;

  const userAvatarUrl = await ctx.storage.getUrl(
    result.imageUrl as Id<"_storage">,
  );
  return {
    ...result,
    imageUrl: userAvatarUrl,
  };
};

export const getWorkspacesByOrganizationId = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
) => {
  return await ctx.db
    .query("workspaces")
    .withIndex("personal", (q) =>
      q.eq("organizationId", organizationId).eq("type", "personal"),
    )
    .first();
};

export const getImageUrl = async (ctx: QueryCtx, storageId: Id<"_storage">) => {
  return await ctx.storage.getUrl(storageId);
};

export const getOrganizationByOrganizationId = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
) => {
  const res = await ctx.db.get(organizationId);
  if (!res) return null;
  if (res.avatar.startsWith("https")) return res;
  const organizationAvatar = await ctx.storage.getUrl(
    res.avatar as Id<"_storage">,
  );
  return {
    ...res,
    avatar: organizationAvatar,
  };
};
export const getOrganizationByServicePointOrganizationId = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
) => {
  const res = await ctx.db.get(organizationId);
  if (!res) return null;
  const organizationAvatar = await ctx.storage.getUrl(
    res.avatar as Id<"_storage">,
  );
  return {
    name: res.name,
    avatar: organizationAvatar,
    id: res._id,
    ownerId: res.ownerId,
    description: res.description,
  };
};

export const getOrganizationByOwnerId = async (
  ctx: QueryCtx,
  id: Id<"users">,
) => {
  const res = await ctx.db
    .query("organizations")
    .filter((q) => q.eq(q.field("ownerId"), id))
    .first();
  if (!res) return null;
  if (res.avatar.startsWith("https")) return res;
  const organizationAvatar = await ctx.storage.getUrl(
    res.avatar as Id<"_storage">,
  );
  return {
    ...res,
    avatar: organizationAvatar,
  };
};

export const getWorkspaceByWorkerWorkspaceId = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">,
) => {
  if (!workspaceId) return null;
  return await ctx.db.get(workspaceId);
};

export const getPosts = async (ctx: QueryCtx, orgsId: Id<"organizations">) => {
  const res = await ctx.db
    .query("posts")
    .withIndex("by_org_id", (q) => q.eq("organizationId", orgsId))
    .collect();

  if (!res) return [];
  return await Promise.all(
    res.map(async (r) => {
      return await getImageUrl(ctx, r.image as Id<"_storage">);
    }),
  );
};

export const getWorkspaceWithWorkerAndUserProfile = async (
  ctx: QueryCtx,
  orgsId: Id<"organizations">,
) => {
  const workers = await ctx.db
    .query("workers")
    .withIndex("by_org_id", (q) => q.eq("organizationId", orgsId))
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
    id: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const org = await ctx.db.get(args.id);
    if (!org) return;
    await ctx.db.patch(org._id, {
      searchCount: org.searchCount + 1,
    });
  },
});
