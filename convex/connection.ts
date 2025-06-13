import {v} from "convex/values";
import {mutation, query} from "~/convex/_generated/server";
import {getOrganisations} from "~/convex/users";

export const getConnection = query({
  args: {
    from: v.id("users"),
    to: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("connections")
      .withIndex("by_ownerId_orgId", (q) =>
        q.eq("ownerId", args.from).eq("connectedTo", args.to),
      )
      .first();
  },
});
export const getUserConnections = query({
  args: {
    ownerId: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const connections = await ctx.db
      .query("connections")
      .withIndex("by_createdAt")
      .order("desc")
      .filter((q) => q.eq(q.field("ownerId"), args.ownerId))
      .collect();
    return await Promise.all(
      connections.map(async (connection) => {
        const organisation = await getOrganisations(
          ctx,
          connection.connectedTo,
        );

        return {
          connectedAt: connection.connectedAt,
          id: connection._id,
          organisation,
        };
      }),
    );
  },
});
// mutation
export const handleConnection = mutation({
  args: {
    from: v.id("users"),
    to: v.id("organizations"),
    connectedAt: v.string(),
  },
  handler: async (ctx, args) => {
    const connection = await ctx.db
      .query("connections")
      .filter((q) =>
        q.and(
          q.eq(q.field("connectedTo"), args.to),
          q.eq(q.field("ownerId"), args.from),
        ),
      )
      .first();

    if (!connection) {
      await ctx.db.insert("connections", {
        ownerId: args.from,
        connectedTo: args.to,
        connectedAt: args.connectedAt,
      });
    } else {
      await ctx.db.patch(connection._id, {
        connectedAt: args.connectedAt,
      });
    }
  },
});

export const updateConnection = mutation({
  args: {
    id: v.id("connections"),
    time: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      connectedAt: args.time,
    });
  },
});
