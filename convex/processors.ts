import { v } from "convex/values";
import { query } from "./_generated/server";
import { getUserProfileByWorkerId } from "./servicePoints";

// export const getProcessorsByUserId = query({
//   args: {
//     userId: v.id("users"),
//   },
//   handler: async (ctx, args) => {},
// });

export const getProcessorThroughUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userData = await ctx.db.get(args.userId);
    if (!userData) return [];
    const worker = await ctx.db
      .query("workers")
      .withIndex("userId", (q) => q.eq("userId", args.userId))
      .first();
    if (!worker) return [];
    const processors = await ctx.db
      .query("workers")
      .withIndex("by_org_id", (q) =>
        q.eq("organizationId", worker.organizationId),
      )
      .filter((q) => q.eq(q.field("type"), "processor"))
      .collect();

    const processorsWithProfile = processors.map(async (p) => {
      return await getUserProfileByWorkerId(ctx, p._id);
    });

    return await Promise.all(processorsWithProfile);
  },
});

export const getProcessorDetail = query({
  args: {
    id: v.id("workers"),
  },
  handler: async (ctx, args) => {
    return getUserProfileByWorkerId(ctx, args.id);
  },
});
