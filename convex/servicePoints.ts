import { v } from "convex/values";

import { Id } from "~/convex/_generated/dataModel";
import { mutation, query, QueryCtx } from "~/convex/_generated/server";
import { getImageUrl } from "~/convex/organisation";

export const getServicePoints = query({
  args: {
    organisationId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("servicePoints")
      .withIndex("by_organisation_id", (q) =>
        q.eq("organizationId", args.organisationId),
      )
      .collect();
  },
});

export const getSingleServicePointAndWorker = query({
  args: {
    servicePointId: v.optional(v.id("servicePoints")),
  },
  handler: async (ctx, args) => {
    if (!args.servicePointId) return null;
    const servicePoint = await ctx.db.get(args.servicePointId);
    if (!servicePoint) return null;

    return servicePoint;
  },
});
// mutation
export const createServicePoint = mutation({
  args: {
    description: v.optional(v.string()),
    organisationId: v.id("organizations"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("servicePoints", {
      organizationId: args.organisationId,
      name: args.name,
      form: false,
      description: args.description,
    });
  },
});

export const updateServicePoint = mutation({
  args: {
    servicePointId: v.id("servicePoints"),
    name: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.servicePointId, {
      name: args.name,
      description: args.description,
    });
  },
});

export const deleteServicePoint = mutation({
  args: { id: v.id("servicePoints") },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("workers")
      .filter((q) => q.eq(q.field("servicePointId"), args.id))
      .first();
    if (!user) return;
    await ctx.db.patch(user._id, {
      servicePointId: undefined,
    });
    await ctx.db.delete(args.id);
  },
});

// helpers

export const getUserProfileByWorkerId = async (
  ctx: QueryCtx,
  userId: Id<"workers">,
) => {
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("workerId"), userId))
    .first();
  const worker = await ctx.db.get(userId);
  if (!worker) return null;
  if (!user) return null;
  if (user?.imageUrl && user?.imageUrl.startsWith("http"))
    return {
      ...user,
      role: worker.role,
    };
  const imageUrl = await getImageUrl(ctx, user.imageUrl as Id<"_storage">);
  return {
    ...user,
    imageUrl,
    role: worker.role,
  };
};
