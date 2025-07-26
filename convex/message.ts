import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { Id } from './_generated/dataModel';
import { getUserByUserId } from './users';

export const reactToMessage = mutation({
  args: {
    messageId: v.id('messages'),
    senderId: v.id('users'),
    emoji: v.union(
      v.literal('LIKE'),
      v.literal('SAD'),
      v.literal('LOVE'),
      v.literal('WOW'),
      v.literal('ANGRY'),
      v.literal('LAUGH')
    ),
  },
  handler: async (ctx, args) => {
    const messageToReactTo = await ctx.db.get(args.messageId);
    if (!messageToReactTo) {
      throw new ConvexError('Message not found');
    }

    const reactionExists = await ctx.db
      .query('reactions')
      .withIndex('by_sender_message_id', (q) =>
        q.eq('message_id', args.messageId).eq('user_id', args.senderId)
      )
      .first();

    const isSameReaction = reactionExists?.emoji === args.emoji;
    if (reactionExists && isSameReaction) {
      await ctx.db.delete(reactionExists._id);
      return;
    }

    if (reactionExists) {
      await ctx.db.delete(reactionExists._id);
    }

    await ctx.db.insert('reactions', {
      emoji: args.emoji,
      message_id: args.messageId,
      user_id: args.senderId,
    });
  },
});

export const deleteMessage = mutation({
  args: {
    sender_id: v.id('users'),
    message_id: v.id('messages'),
  },
  handler: async (ctx, args) => {
    await deleteMessageHelpFn(ctx, args.message_id, args.sender_id);
  },
});

// helpers

export const deleteMessageHelpFn = async (
  ctx: MutationCtx,
  message_id: Id<'messages'>,
  logged_in_user: Id<'users'>
) => {
  const messageToDelete = await ctx.db.get(message_id);
  if (!messageToDelete) {
    throw new ConvexError('Message not found');
  }
  const room = await ctx.db.get(messageToDelete.conversationId);
  if (!room) {
    throw new ConvexError('Room not found');
  }
  if (messageToDelete.senderId !== logged_in_user) {
    throw new ConvexError('Unauthorized');
  }
  if (messageToDelete.fileId) {
    await ctx.storage.delete(messageToDelete.fileId);
  }
  await findAndDeleteReplies(ctx, message_id);
  await ctx.db.delete(message_id);
  const messages = await ctx.db
    .query('messages')
    .withIndex('by_conversationId', (q) =>
      q.eq('conversationId', messageToDelete.conversationId)
    )
    .order('asc')
    .collect();
  await ctx.db.patch(room?._id, {
    lastMessage: messages[messages.length - 1]?.content || 'file',
    lastMessageTime: messages[messages.length - 1]?._creationTime,
  });
};

export const findAndDeleteReplies = async (
  ctx: MutationCtx,
  message_id: Id<'messages'>
) => {
  const isReplyTo = await ctx.db
    .query('messages')
    .withIndex('by_reply_to', (q) => q.eq('replyTo', message_id))
    .collect();
  if (isReplyTo.length > 0) {
    for (const reply of isReplyTo) {
      await ctx.db.patch(reply._id, {
        replyTo: undefined,
      });
    }
  }
};

export const messageReactions = async (
  ctx: QueryCtx,
  messageId: Id<'messages'>
) => {
  return await ctx.db
    .query('reactions')
    .withIndex('by_message_id', (q) => q.eq('message_id', messageId))
    .collect();
};

export const messageHelper = async (
  ctx: QueryCtx,
  messageId: Id<'messages'>
) => {
  const message = await ctx.db.get(messageId);
  if (!message) return;

  const sender = await getUserByUserId(ctx, message?.senderId);

  return {
    fileType: message.fileType,
    fileUrl: message.fileUrl,
    message: message.content,
    sender_id: message.senderId,
    user: {
      name: sender?.name,
      id: sender?._id,
    },
  };
};

export const sendMessage = mutation({
  args: {
    conversationId: v.id('conversations'),
    content: v.string(),
    senderId: v.id('users'),
    fileType: v.optional(
      v.union(v.literal('image'), v.literal('pdf'), v.literal('audio'))
    ),
    fileUrl: v.optional(v.string()),
    fileId: v.optional(v.id('_storage')),
    replyTo: v.optional(v.id('messages')),
    senderName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.conversationId);
    if (!room) {
      throw new ConvexError('Conversation not found');
    }

    let file_url;
    if (args.fileId) {
      file_url = (await ctx.storage.getUrl(args.fileId)) as string;
    }

    await ctx.db.insert('messages', {
      ...args,
      fileUrl: file_url,
      seenId: [args.senderId],
    });

    await ctx.db.patch(room._id, {
      lastMessage: args.content || file_url,
      lastMessageTime: new Date().getTime(),
    });
  },
});

export const editMessage = mutation({
  args: {
    text: v.string(),
    message_id: v.id('messages'),
    sender_id: v.id('users'),
  },
  handler: async (ctx, args) => {
    const messageToEdit = await ctx.db.get(args.message_id);
    if (!messageToEdit) {
      throw new ConvexError('Message not found');
    }
    if (messageToEdit.senderId !== args.sender_id) {
      throw new ConvexError('You are not authorized to edit this text');
    }
    await ctx.db.patch(messageToEdit._id, {
      content: args.text,
    });
  },
});

export const setTypingState = mutation({
  args: {
    conversationId: v.id('conversations'),
    userId: v.id('users'),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('typingStates')
      .withIndex('by_conversationId_userId', (q) =>
        q.eq('conversationId', args.conversationId).eq('userId', args.userId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
      });
    } else {
      await ctx.db.insert('typingStates', {
        conversationId: args.conversationId,
        userId: args.userId,
        isTyping: args.isTyping,
      });
    }
  },
});

// queries

export const getTypingUsers = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const states = await ctx.db
      .query('typingStates')
      .withIndex('is_typing', (q) =>
        q.eq('conversationId', args.conversationId).eq('isTyping', true)
      )
      .collect();

    return states.map((state) => state.userId); // Return list of typing user IDs
  },
});

export const getMembersInConversation = query({
  args: { conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const conversation = await ctx.db.get(args.conversationId);
    if (!conversation) return [];

    const members = conversation.participants.map(async (m) => {
      const user = await ctx.db.get(m);
      if (user?.pushToken === undefined) return null;
      return user?.pushToken;
    });

    return await Promise.all(members);
  },
});
