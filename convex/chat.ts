import { v } from "convex/values";

import { Id } from "./_generated/dataModel";
import { query, QueryCtx } from "./_generated/server";

export const getConversation = query({
  args: {
    user1: v.id("users"),
    user2: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("type"), "direct"))
      .collect();

    if (!conversations) return null;
    const conversation = conversations.find(
      (c) =>
        (c.participants.includes(args.user1) &&
          c.participants.includes(args.user2)) ||
        (c.participants.includes(args.user2) &&
          c.participants.includes(args.user1)),
    );
    if (!conversation) return null;
    const messages = await ctx.db
      .query("messages")
      .filter((q) => q.eq(q.field("conversationId"), conversation._id))
      .order("desc")
      .take(100);
    if (!messages) return [];
    const messagesWithUsers = await Promise.all(
      messages.map(async (m) => {
        const user = await getUserByMessageSenderId(ctx, m.senderId);

        return {
          ...m,
          user,
        };
      }),
    );

    return {
      messages: messagesWithUsers,
      conversation,
    };
  },
});

// helpers

const getUserByMessageSenderId = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};
