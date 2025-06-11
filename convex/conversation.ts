import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";

import { Id } from "~/convex/_generated/dataModel";
import { getImageUrl } from "~/convex/organisation";
import { filter } from "convex-helpers/server/filter";
import { messageHelper, messageReactions } from "~/convex/message";
import { getUserByUserId, getWorkerProfile } from "~/convex/users";

export const getConversations = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
    type: v.union(v.literal("single"), v.literal("processor")),
  },
  handler: async (ctx, args) => {
    return filter(
      ctx.db
        .query("conversations")
        .withIndex("by_last_message_last_message_time"),
      (conversation) =>
        conversation.participants.includes(args.userId) &&
        conversation.type === args.type &&
        conversation.lastMessage !== undefined,
    )
      .order("asc")
      .paginate(args.paginationOpts);
  },
});
export const getConversationsSingleSearch = query({
  args: {
    userId: v.id("users"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await ctx.db.get(args.userId);
    if (!me) {
      throw new ConvexError("Unable to fetch data");
    }

    return filter(
      ctx.db
        .query("conversations")
        .withIndex("by_last_message_last_message_time"),
      (conversation) =>
        conversation.participants.includes(args.userId) &&
        conversation.participantNames.some((p) =>
          p.toLowerCase().includes(args.query.toLowerCase()),
        ),
    )
      .order("asc")
      .collect();
  },
});

export const getConversationsGroupSearch = query({
  args: {
    userId: v.id("users"),
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await ctx.db.get(args.userId);
    if (!me) {
      throw new ConvexError("Unable to fetch data");
    }

    return filter(
      ctx.db
        .query("conversations")
        .withSearchIndex("by_name", (q) => q.search("name", args.query)),
      (conversation) => conversation.participants.includes(args.userId),
    ).collect();
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
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const conversations = await getConversationIamIn(ctx, args.userId);

    const messagesThatIHaveNotRead = await Promise.all(
      conversations.map(async (conversation) => {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", conversation._id),
          )
          .collect();
        const messagesThatIHaveNotSeen = messages.filter(
          (m) => !m.seenId.includes(args.userId),
        );

        return messagesThatIHaveNotSeen.length;
      }),
    );

    return messagesThatIHaveNotRead.reduce((acc, curr) => acc + curr, 0);
  },
});

export const getSingleConversationWithMessages = query({
  args: {
    loggedInUserId: v.optional(v.id("users")),
    otherUserId: v.id("users"),
    type: v.union(v.literal("single"), v.literal("processor")),
  },
  handler: async (ctx, args) => {
    if (!args.loggedInUserId) return null;
    return filter(
      ctx.db.query("conversations").withIndex("by_id"),
      (c) =>
        (c.participants[0] === args.loggedInUserId &&
          c.participants[1] === args.otherUserId) ||
        (c.participants[1] === args.loggedInUserId &&
          c.participants[0] === args.otherUserId &&
          c.type === args.type),
    ).first();
  },
});

export const getGroup = query({
  args: { groupId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.groupId);
  },
});

export const getGroupMember = query({
  args: { memberIds: v.array(v.id("users")) },
  handler: async (ctx, args) => {
    const members = args.memberIds.map(async (id) => {
      const user = await getUserByUserId(ctx, id);
      const worker = await getWorkerProfile(ctx, id);

      return {
        ...user,
        role: worker?.role,
      };
    });
    return await Promise.all(members);
  },
});

export const getGroupConversationThatIAmIn = query({
  args: {
    loggedInUserId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    return filter(
      ctx.db
        .query("conversations")
        .withIndex("by_last_message_last_message_time"),
      (conversation) =>
        conversation.participants.includes(args.loggedInUserId) &&
        conversation.type === "group",
    ).paginate(args.paginationOpts);
  },
});

export const getGroupMessages = query({
  args: {
    conversationId: v.id("conversations"),
    loggedInUserId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("members")
      .withIndex("by_conversation_id", (q) =>
        q.eq("conversationId", args.conversationId),
      )
      .collect();

    const currentMember = members.find(
      (member) => member.memberId === args.loggedInUserId,
    );
    if (!currentMember) {
      throw new ConvexError("Member not found");
    }
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId!),
      )
      .filter((q) =>
        q.gt(q.field("_creationTime"), currentMember?._creationTime),
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
export const createGroupConversation = mutation({
  args: {
    loggedInUserId: v.id("users"),
    otherUsers: v.array(v.id("users")),
    name: v.string(),
    description: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    let imageUrl = "";
    if (args.imageId) {
      imageUrl = (await ctx.storage.getUrl(args.imageId)) as string;
    }
    const id = await ctx.db.insert("conversations", {
      name: args.name,
      type: "group",
      participants: [args.loggedInUserId, ...args.otherUsers],
      description: args.description,
      lastMessage: `${args.name} was created by`,
      participantNames: [],
      lastMessageTime: new Date().getTime(),
      imageId: args.imageId,
      imageUrl,
      creatorId: args.loggedInUserId,
    });
    const members = [args.loggedInUserId, ...args.otherUsers];
    for (const member of members) {
      await ctx.db.insert("members", {
        conversationId: id,
        memberId: member,
      });
    }

    return id;
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
export const addMembers = mutation({
  args: {
    members: v.array(v.id("users")),
    loggedInUserId: v.id("users"),
    groupId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);

    if (!group) {
      throw new ConvexError("Group not found");
    }

    if (group.creatorId !== args.loggedInUserId) {
      throw new ConvexError("You are not authorized");
    }

    await ctx.db.patch(group._id, {
      participants: [...group.participants, ...args.members],
    });
    for (const member of args.members) {
      await ctx.db.insert("members", {
        memberId: member,
        conversationId: group._id,
      });
    }
  },
});
export const fetchWorkersThatAreNotInGroup = query({
  args: {
    groupId: v.id("conversations"),
    loggedInUserId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const workers = await ctx.db
      .query("workers")
      .withIndex("boss_Id", (q) => q.eq("bossId", args.loggedInUserId))
      .collect();
    if (!workers) return [];
    const group = await ctx.db.get(args.groupId);
    if (!group) return [];

    const workersNotInGroup = workers.filter((worker) => {
      return !group.participants.includes(worker.userId);
    });

    return await Promise.all(
      workersNotInGroup.map(async (worker) => {
        const user = await getUserByUserId(ctx, worker.userId);
        return {
          ...user,
          role: worker.role,
        };
      }),
    );
  },
});
export const closeGroup = mutation({
  args: {
    loggedInUser: v.id("users"),
    groupId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError("Group not found");
    }
    if (group.creatorId !== args.loggedInUser) {
      throw new ConvexError("You are not authorized");
    }

    const members = await ctx.db
      .query("members")
      .withIndex("by_conversation_id", (q) =>
        q.eq("conversationId", args.groupId),
      )
      .collect();

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.groupId),
      )
      .collect();

    for (const member of members) {
      await ctx.db.delete(member._id);
    }
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
    if (group.imageId) {
      await ctx.storage.delete(group.imageId);
    }

    await ctx.db.delete(group._id);
  },
});
export const removeStaffsFromConversation = mutation({
  args: {
    loggedInUserId: v.id("users"),
    userToRemoveId: v.id("users"),
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.conversationId);
    if (!group) {
      throw new ConvexError("Failed to remove user");
    }
    if (group.creatorId !== args.loggedInUserId) {
      throw new ConvexError("You are not authorized");
    }

    await ctx.db.patch(group._id, {
      participants: group.participants.filter((p) => p !== args.userToRemoveId),
    });
  },
});
// helpers
export const getParticipants = async (ctx: QueryCtx, userId: Id<"users">) => {
  return await ctx.db.get(userId);
};

export const getMessagesUnreadCount = async (
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

export const getConversationIamIn = async (
  ctx: QueryCtx,
  userId: Id<"users">,
) => {
  return filter(
    ctx.db.query("conversations").withIndex("by_id"),
    (conversation) => conversation.participants.includes(userId),
  ).collect();
};
