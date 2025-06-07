import { v } from "convex/values";

import { mutation, query, QueryCtx } from "~/convex/_generated/server";
import { filter } from "convex-helpers/server/filter";
import { Id } from "~/convex/_generated/dataModel";

export const getStaffRoles = query({
  args: {
    bossId: v.id("users"),
  },
  handler: async (ctx, { bossId }) => {
    const roles = await ctx.db
      .query("workers")
      .withIndex("boss_Id", (q) => q.eq("bossId", bossId))
      .collect();

    return roles.map((role) => role.role!) || [];
  },
});

// mutations

export const createStaffRole = mutation({
  args: {
    role: v.string(),
  },
  handler: async (ctx, { role }) => {
    await ctx.db.insert("roles", {
      role,
    });
  },
});

export const searchStaffsToEmploy = query({
  args: {
    query: v.string(),
    loggedInUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const users = await getUserWithSearchQuery(
      ctx,
      args.query,
      args.loggedInUserId,
    );
    const workers = users.map(async (user) => {
      const worker = await getWorkersThatAreNotWorking(ctx, user.workerId);
      let imgUrl;
      if (user?.imageUrl?.startsWith("https")) {
        imgUrl = user.imageUrl;
      } else {
        imgUrl = await ctx.storage.getUrl(user?.imageUrl as Id<"_storage">);
      }
      if (!worker) return null;
      return {
        user: {
          ...user,
          imageUrl: imgUrl,
        },
        worker,
      };
    });

    return await Promise.all(workers);
  },
});

const getUserWithSearchQuery = async (
  ctx: QueryCtx,
  query: string,
  loggedInUser: Id<"users">,
) => {
  return filter(
    ctx.db
      .query("users")
      .withSearchIndex("name", (q) => q.search("name", query)),
    (user) => user.workerId !== undefined && user._id !== loggedInUser,
  ).collect();
};

export const getWorkersThatAreNotWorking = async (
  ctx: QueryCtx,
  workerId?: Id<"workers">,
) => {
  if (!workerId) return null;
  const worker = await ctx.db.get(workerId);
  if (worker?.bossId) return null;
  return worker;
};
