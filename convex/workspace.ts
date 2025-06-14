import { v } from "convex/values";

import { Id } from "~/convex/_generated/dataModel";
import { mutation, query, QueryCtx } from "~/convex/_generated/server";
import { getOrganizationByOrganizationId } from "~/convex/organisation";
import { getUserByUserId, getUserByWorkerId } from "~/convex/users";

export const getUserWorkspaceOrNull = query({
  args: { workerId: v.optional(v.id("workers")) },
  handler: async (ctx, args) => {
    if (!args.workerId) return null;
    const res = await ctx.db
      .query("workspaces")
      .withIndex("by_worker_id", (q) => q.eq("workerId", args.workerId))
      .first();
    if (!res) return null;
    const organization = await organisationByWorkSpaceId(
      ctx,
      res?.organizationId,
    );
    const workerProfile = await getUserByWorkerId(ctx, args.workerId);

    return {
      ...res,
      organization,
      image: workerProfile?.imageUrl,
    };
  },
});

const organisationByWorkSpaceId = async (
  ctx: QueryCtx,
  organizationId: Id<"organizations">,
) => {
  const organization = await ctx.db.get(organizationId);
  if (!organization || !organization.avatar) return null;
  if (organization.avatar.startsWith("https")) {
    return organization;
  }
  const avatar = await ctx.storage.getUrl(
    organization.avatar as Id<"_storage">,
  );
  return {
    ...organization,
    avatar,
  };
};

export const getRoles = query({
  handler: async (ctx) => {
    return await ctx.db.query("roles").collect();
  },
});

export const freeWorkspaces = query({
  args: {
    ownerId: v.id("users"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("workspaces")
      .filter((q) =>
        q.and(
          q.eq(q.field("ownerId"), args.ownerId),
          q.eq(q.field("workerId"), undefined),
        ),
      )
      .collect();
  },
});

export const getWorkspaceWithWaitingList = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return;
    const [organization, worker, waitlist] = await Promise.all([
      getOrganizationByOrganizationId(ctx, workspace.organizationId),
      getUserByWorkerId(ctx, workspace?.workerId!),
      getWaitlist({ ctx, workspaceId: workspace._id }),
    ]);

    return {
      organization,
      worker,
      waitlist,
      workspace,
    };
  },
});
// mutation

export const starCustomer = mutation({
  args: {
    text: v.string(),
    customerId: v.id("users"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { customerId, workspaceId, text }) => {},
});

export const handleWaitlist = mutation({
  args: {
    customerId: v.id("users"),
    workspaceId: v.id("workspaces"),
    joinedAt: v.string(),
  },
  handler: async (ctx, { customerId, workspaceId, joinedAt }) => {
    const isInWaitlist = await ctx.db
      .query("waitlists")
      .withIndex("by_customer_id_workspace_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("customerId", customerId),
      )
      .first();
    if (isInWaitlist) {
      await ctx.db.patch(isInWaitlist._id, {
        joinedAt,
      });
    } else {
      return await ctx.db.insert("waitlists", {
        customerId,
        workspaceId,
        joinedAt,
        type: "waiting",
      });
    }
  },
});
export const toggleWorkspaceStatus = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    type: v.union(v.literal("active"), v.literal("leisure")),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return;
    if (args.type === "active") {
      await ctx.db.patch(workspace._id, {
        active: !workspace.active,
      });
    } else {
      await ctx.db.patch(workspace._id, {
        leisure: !workspace.leisure,
      });
    }
  },
});
export const createAndAssignWorkspace = mutation({
  args: {
    ownerId: v.id("users"),
    organizationId: v.id("organizations"),
    role: v.string(),
    type: v.union(
      v.literal("personal"),
      v.literal("processor"),
      v.literal("front"),
    ),
    workerId: v.id("workers"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("workspaces", {
      type: args.type,
      role: args.role,
      ownerId: args.ownerId,
      organizationId: args.organizationId,
      locked: args.type !== "personal",
      active: false,
      leisure: false,
      waitlistCount: 0,
      workerId: args.workerId,
    });

    await ctx.db.patch(args.workerId, {
      workspaceId: id,
    });
    // update worker table with workspace id and boss id
  },
});
export const createWorkspace = mutation({
  args: {
    ownerId: v.id("users"),
    organizationId: v.id("organizations"),
    role: v.string(),
    type: v.literal("personal"),
    workerId: v.id("workers"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("workspaces", {
      type: args.type,
      role: args.role,
      ownerId: args.ownerId,
      organizationId: args.organizationId,
      locked: args.type !== "personal",
      active: false,
      leisure: false,
      waitlistCount: 0,
      workerId: args.workerId,
    });

    await ctx.db.patch(args.workerId, {
      workspaceId: id,
      organizationId: args.organizationId,
      role: args.role,
    });

    return id;
    // update worker table with workspace id and boss id
  },
});
export const existLobby = mutation({
  args: {
    customerId: v.id("users"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, { customerId, workspaceId }) => {
    const waitlist = await ctx.db
      .query("waitlists")
      .withIndex("by_customer_id_workspace_id", (q) =>
        q.eq("workspaceId", workspaceId).eq("customerId", customerId),
      )
      .first();
    if (waitlist) {
      await ctx.db.delete(waitlist._id);
    }
  },
});
export const handleAttendance = mutation({
  args: {
    signOutAt: v.optional(v.string()),
    signInAt: v.optional(v.string()),
    workerId: v.id("users"),
    today: v.string(),
    workspaceId: v.optional(v.id("workspaces")),
  },
  handler: async (
    ctx,
    { workerId, signOutAt, signInAt, today, workspaceId },
  ) => {
    const findTodayAttendance = await ctx.db
      .query("attendance")
      .withIndex("worker_id_date", (q) =>
        q.eq("workerId", workerId).eq("date", today),
      )
      .first();

    if (!findTodayAttendance && signInAt) {
      await ctx.db.insert("attendance", {
        signInAt,
        workerId,
        date: today,
      });
    }
    if (findTodayAttendance) {
      await ctx.db.patch(findTodayAttendance._id, {
        signOutAt,
      });
    }
    if (!workspaceId) return;
    await ctx.db.patch(workspaceId, {
      active: false,
    });
  },
});
export const checkIfWorkerSignedInToday = query({
  args: {
    workerId: v.id("users"),
    today: v.string(),
  },
  handler: async (ctx, { workerId, today }) => {
    const todayAttendance = await ctx.db
      .query("attendance")
      .withIndex("worker_id_date", (q) => q.eq("workerId", workerId))
      .filter((q) => q.eq(q.field("date"), today))
      .first();

    return {
      signedInToday: !!todayAttendance,
      signedOutToday: !!todayAttendance?.signOutAt,
    };
  },
});
export const deleteWorkspace = mutation({
  args: {
    id: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
export const attendToCustomer = mutation({
  args: {
    waitlistId: v.id("waitlists"),
    nextWaitListId: v.optional(v.id("waitlists")),
  },
  handler: async (ctx, { waitlistId, nextWaitListId }) => {
    const waitlist = await ctx.db.get(waitlistId);
    if (!waitlist) return;
    await ctx.db.patch(waitlist._id, {
      type: "attending",
    });
    if (!nextWaitListId) return;
    await ctx.db.patch(nextWaitListId, {
      type: "next",
    });
  },
});

export const removeFromWaitlist = mutation({
  args: {
    waitlistId: v.id("waitlists"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.waitlistId);
  },
});
export const addStaffToWorkspace = mutation({
  args: {
    workerId: v.id("workers"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workspaceId, {
      workerId: args.workerId,
    });
    await ctx.db.patch(args.workerId, {
      workspaceId: args.workspaceId,
    });
  },
});
export const removeFromWorkspace = mutation({
  args: {
    workerId: v.id("workers"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.workspaceId, {
      workerId: undefined,
      locked: true,
    });
    await ctx.db.patch(args.workerId, {
      workspaceId: undefined,
    });
  },
});

export const toggleWorkspace = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return;
    await ctx.db.patch(workspace._id, {
      locked: !workspace.locked,
      active: false,
    });
  },
});
// helper
// const updateWorkerTableWithBossIdAndWorkspaceId = async (
//   ctx: QueryCtx,
//   bossId: Id<'users'>,
//   workspaceId: Id<'workspaces'>,
//   workerId: Id<'users'>
// ) => {};

export const getWaitlist = async ({
  ctx,
  workspaceId,
}: {
  ctx: QueryCtx;
  workspaceId: Id<"workspaces">;
}) => {
  const waitlists = await ctx.db
    .query("waitlists")
    .filter((q) => q.eq(q.field("workspaceId"), workspaceId))
    .collect();
  if (!waitlists) return [];
  const usersInWaitlist = waitlists.map(async (waitlist) => {
    const customer = await getUserByUserId(ctx, waitlist.customerId);
    return {
      ...waitlist,
      customer,
    };
  });
  return await Promise.all(usersInWaitlist);
};
