import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

import { Id } from "~/convex/_generated/dataModel";
import { getImageUrl } from "~/convex/organisation";
import { filter } from "convex-helpers/server/filter";
import { messageHelper, messageReactions } from "~/convex/message";
import { getUserByUserId } from "~/convex/users";

export const getConversationsSingle = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return filter(
      ctx.db
        .query("conversations")
        .withIndex("by_last_message_last_message_time"),
      (conversation) =>
        conversation.participants.includes(args.userId) &&
        conversation.lastMessage !== undefined,
    )
      .order("asc")
      .paginate(args.paginationOpts);
  },
});
export const getConversationsSingleSearch = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await ctx.db.get(args.userId);

    return filter(
      ctx.db
        .query("conversations")
        .withIndex("by_last_message_last_message_time"),
      (conversation) => {
        const otherName = conversation.participantNames
          .find((name) => name !== me?.name)
          ?.toLowerCase() as string;
        return (
          conversation.participants.includes(args.userId) &&
          otherName.includes(args.query.toLowerCase())
        );
      },
    )
      .order("asc")
      .paginate(args.paginationOpts);
  },
});

export const getUnreadMessages = query({
  args: {
    conversationId: v.id("conversations"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .filter((q) => q.neq(q.field("senderId"), args.userId))
      .collect();
    const unseenMessages = messages.filter(
      (m) => !m.seenId.includes(args.userId),
    );

    return unseenMessages.length || 0;
  },
});
export const getUnreadAllMessages = query({
  args: {
    clerkId: v.string(),
    type: v.union(
      v.literal("single"),
      v.literal("processor"),
      v.literal("group"),
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();
    if (!user) return 0;
    const workerRole = await ctx.db
      .query("workers")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();
    let conversations;
    if (workerRole && workerRole?.role?.toLowerCase() === "processor") {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_id")
        .collect();
    } else {
      conversations = await ctx.db
        .query("conversations")
        .withIndex("by_id")
        .filter((q) => q.eq(q.field("type"), args.type))
        .collect();
    }

    if (!conversations) return 0;
    const conversationThatLoggedInUserIsIn = conversations.filter((c) =>
      c.participants.includes(user?._id),
    );
    const messagesThatUserHasNotRead = conversationThatLoggedInUserIsIn.map(
      async (m) => {
        return await getMessagesUnreadCount(ctx, m._id, user?._id);
      },
    );
    const unread = await Promise.all(messagesThatUserHasNotRead);

    return unread.reduce((acc, curr) => acc + curr, 0);
  },
});

export const getSingleConversationWithMessages = query({
  args: {
    loggedInUserId: v.optional(v.id("users")),
    otherUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (!args.loggedInUserId) return null;
    return filter(
      ctx.db.query("conversations").withIndex("by_id"),
      (c) =>
        (c.participants[0] === args.loggedInUserId &&
          c.participants[1] === args.otherUserId) ||
        (c.participants[1] === args.loggedInUserId &&
          c.participants[0] === args.otherUserId),
    ).first();
  },
});
export const getMessages = query({
  args: {
    conversationId: v.optional(v.id("conversations")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId!),
      )
      .order("desc")
      .paginate(args.paginationOpts);
    const page = await Promise.all(
      messages.page.map(async (m) => {
        const sender = await getUserByUserId(ctx, m.senderId);
        const reactions = await messageReactions(ctx, m._id);
        let reply;
        if (m.replyTo) {
          reply = await messageHelper(ctx, m.replyTo);
        }
        return {
          ...m,
          user: sender,
          reactions,
          reply,
        };
      }),
    );
    return {
      ...messages,
      page,
    };
  },
});
export const getMessagesTanstack = query({
  args: {
    conversationId: v.optional(v.id("conversations")),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId!),
      )
      .collect();
  },
});
export const searchConversations = query({
  args: {
    query: v.string(),
    loggedInUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withSearchIndex("name", (q) => q.search("name", args.query))
      .collect();
    const usersConversationsWithLoggedInUsers = users.map(async (user) => {
      const conversation = await getConversationsBetweenTwoUsers(
        ctx,
        args.loggedInUserId,
        user._id,
      );

      if (!conversation) return null;

      if (user?.imageUrl?.startsWith("https")) {
        return user;
      }
      const avatar = await getImageUrl(ctx, user.imageUrl as Id<"_storage">);
      return {
        ...user,
        imageUrl: avatar,
      };
    });

    const results = await Promise.all(usersConversationsWithLoggedInUsers);
    return results.filter((result) => result !== null);
  },
});
// mutations

export const createSingleConversation = mutation({
  args: {
    loggedInUserId: v.id("users"),
    otherUserId: v.id("users"),
    type: v.union(v.literal("processor"), v.literal("single")),
  },
  handler: async (ctx, args) => {
    await createConversation(
      ctx,
      args.loggedInUserId,
      args.otherUserId,
      args.type,
    );
  },
});
export const addSeenId = mutation({
  args: {
    messages: v.array(v.id("messages")),
    id: v.id("users"),
  },
  handler: async (ctx, args) => {
    const updatePromises = args.messages.map(async (m) => {
      const message = await ctx.db.get(m);
      if (!message) return;

      // Use Set to ensure unique IDs
      const uniqueSeenIds = Array.from(new Set([...message.seenId, args.id]));

      await ctx.db.patch(m, {
        seenId: uniqueSeenIds,
      });
    });

    await Promise.all(updatePromises);
  },
});
export const createMessages = mutation({
  args: {
    senderId: v.id("users"),
    recipient: v.id("users"),
    conversationId: v.id("conversations"),
    content: v.string(),
    fileType: v.optional(v.union(v.literal("image"), v.literal("pdf"))),
    uploadUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      content: args.content,
      fileType: args.fileType,
      senderId: args.senderId,
      seenId: [args.senderId],
    });
    const lastMessage =
      args.fileType === "image" || args.fileType === "pdf"
        ? args.uploadUrl
        : args.content;
    await ctx.db.patch(args.conversationId, {
      lastMessage,
      lastMessageTime: Date.now(),
      lastMessageSenderId: args.senderId,
    });
  },
});

// helpers
const getParticipants = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

const getMessagesUnreadCount = async (
  ctx: QueryCtx,
  conversationId: Id<"conversations">,
  userId: Id<"users">,
) => {
  const messages = await ctx.db
    .query("messages")
    .filter((q) => q.eq(q.field("conversationId"), conversationId))
    .collect();
  const unreadMessages = messages.filter((m) => !m.seenId.includes(userId));
  return unreadMessages.length || 0;
};

export const getConversationsBetweenTwoUsers = async (
  ctx: QueryCtx,
  loggedInUserId: Id<"users">,
  otherUserId: Id<"users">,
) => {
  const conversations = await ctx.db.query("conversations").collect();
  if (!conversations) return null;

  return conversations.find(
    (c) =>
      (c.participants.length === 2 &&
        c.participants[0] === loggedInUserId &&
        c.participants[1] === otherUserId) ||
      (c.participants[1] === loggedInUserId &&
        c.participants[0] === otherUserId),
  );
};

export const createConversation = async (
  ctx: MutationCtx,
  loggedInUserId: Id<"users">,
  otherUserId: Id<"users">,
  type: "single" | "processor",
) => {
  const me = await ctx.db.get(loggedInUserId);
  const otherUser = await ctx.db.get(otherUserId);
  if (!me || !otherUser) {
    throw new ConvexError("User not found");
  }
  await ctx.db.insert("conversations", {
    participants: [loggedInUserId, otherUserId],
    participantNames: [me.name, otherUser.name],
    type: type,
  });
};
