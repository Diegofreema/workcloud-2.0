import { paginationOptsValidator } from 'convex/server';
import { ConvexError, v } from 'convex/values';

import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';

import { filter } from 'convex-helpers/server/filter';
import { Id } from './_generated/dataModel';
import { getMemberHelper } from './member';
import { messageHelper, messageReactions } from './message';
import { getImageUrl } from './organisation';
import { getLoggedInUser, getUserByUserId, getWorkerProfile } from './users';

export const getConversations = query({
  args: {
    type: v.union(v.literal('single'), v.literal('processor')),
  },
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    return filter(
      ctx.db
        .query('conversations')
        .withIndex('type', (q) => q.eq('type', args.type)),
      (conversation) =>
        conversation.participants.includes(me?._id!) &&
        conversation.lastMessage !== undefined,
    )
      .order('desc')
      .take(50);
  },
});
export const getConversationsSingleSearch = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) {
      throw new ConvexError('Unable to fetch data');
    }

    return filter(
      ctx.db
        .query('conversations')
        .withIndex('by_last_message_last_message_time'),
      (conversation) =>
        conversation.participants.includes(me._id) &&
        conversation.participantNames.some((p) =>
          p.toLowerCase().includes(args.query.toLowerCase()),
        ),
    )
      .order('desc')
      .collect();
  },
});

export const getConversationsGroupSearch = query({
  args: {
    query: v.string(),
  },
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) {
      return [];
    }

    return filter(
      ctx.db
        .query('conversations')
        .withSearchIndex('by_name', (q) => q.search('name', args.query)),
      (conversation) => conversation.participants.includes(me._id),
    ).collect();
  },
});

export const getUnreadMessages = query({
  args: {
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) return 0;
    const member = await getMemberHelper(ctx, args.conversationId, me._id);
    if (!member) return 0;
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId),
      )
      .filter((q) =>
        q.and(
          q.neq(q.field('senderId'), me._id),
          q.gt(q.field('_creationTime'), member._creationTime),
        ),
      )
      .collect();
    const unseenMessages = messages.filter((m) => !m.seenId.includes(me._id));

    return unseenMessages.length || 0;
  },
});
export const getUnreadAllMessages = query({
  args: {},
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) return 0;
    const conversations = await getConversationIamIn(ctx, me._id);

    const messagesThatIHaveNotRead = await Promise.all(
      conversations.map(async (conversation) => {
        const member = await getMemberHelper(ctx, conversation._id, me._id);
        if (!member) return 0;
        const messages = await ctx.db
          .query('messages')
          .withIndex('by_conversationId', (q) =>
            q.eq('conversationId', conversation._id),
          )
          .filter((q) =>
            q.and(
              q.neq(q.field('senderId'), me._id),
              q.gt(q.field('_creationTime'), member._creationTime),
            ),
          )
          .collect();

        const messagesThatIHaveNotSeen = messages.filter(
          (m) => !m.seenId.includes(me._id),
        );

        return messagesThatIHaveNotSeen.length;
      }),
    );

    return messagesThatIHaveNotRead.reduce((acc, curr) => acc + curr, 0);
  },
});
export const getUnreadProcessorMessages = query({
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) return 0;
    const conversations = await getProcessorConversationIamIn(ctx, me._id);

    const messagesThatIHaveNotRead = await Promise.all(
      conversations.map(async (conversation) => {
        const member = await getMemberHelper(ctx, conversation._id, me._id);
        if (!member) return 0;
        const messages = await ctx.db
          .query('messages')
          .withIndex('by_conversationId', (q) =>
            q.eq('conversationId', conversation._id),
          )
          .filter((q) =>
            q.and(
              q.neq(q.field('senderId'), me._id),
              q.gt(q.field('_creationTime'), member._creationTime),
            ),
          )
          .collect();

        const messagesThatIHaveNotSeen = messages.filter(
          (m) => !m.seenId.includes(me._id),
        );

        return messagesThatIHaveNotSeen.length;
      }),
    );

    return messagesThatIHaveNotRead.reduce((acc, curr) => acc + curr, 0);
  },
});

export const getSingleConversationWithMessages = query({
  args: {
    otherUserId: v.id('users'),
    type: v.union(v.literal('single'), v.literal('processor')),
  },
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) return null;
    return filter(
      ctx.db
        .query('conversations')
        .withIndex('type', (q) => q.eq('type', args.type)),
      (c) =>
        (c.participants[0] === me._id &&
          c.participants[1] === args.otherUserId) ||
        (c.participants[1] === me._id &&
          c.participants[0] === args.otherUserId),
    ).first();
  },
});

export const getGroup = query({
  args: { groupId: v.id('conversations') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.groupId);
  },
});

export const getGroupMember = query({
  args: { memberIds: v.array(v.id('users')) },
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
  args: {},
  handler: async (ctx, args) => {
    const me = await getLoggedInUser(ctx, 'query');
    if (!me) return [];
    return filter(
      ctx.db
        .query('conversations')
        .withIndex('by_last_message_last_message_time'),
      (conversation) =>
        conversation.participants.includes(me._id) &&
        conversation.type === 'group',
    ).take(100);
  },
});

export const getGroupMessages = query({
  args: {
    conversationId: v.id('conversations'),
    loggedInUserId: v.id('users'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query('members')
      .withIndex('by_conversation_id', (q) =>
        q.eq('conversationId', args.conversationId),
      )
      .collect();

    const currentMember = members.find(
      (member) => member.memberId === args.loggedInUserId,
    );
    if (!currentMember) {
      throw new ConvexError('Member not found');
    }
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId!),
      )
      .filter((q) =>
        q.gt(q.field('_creationTime'), currentMember?._creationTime),
      )
      .order('desc')
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
    conversationId: v.optional(v.id('conversations')),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId!),
      )
      .order('desc')
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
    conversationId: v.optional(v.id('conversations')),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.conversationId!),
      )
      .collect();
  },
});
export const searchConversations = query({
  args: {
    query: v.string(),
    loggedInUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query('users')
      .withSearchIndex('name', (q) => q.search('name', args.query))
      .collect();
    const usersConversationsWithLoggedInUsers = users.map(async (user) => {
      const conversation = await getConversationsBetweenTwoUsers(
        ctx,
        args.loggedInUserId,
        user._id,
      );

      if (!conversation) return null;

      if (user?.imageUrl?.startsWith('https')) {
        return user;
      }
      const avatar = await getImageUrl(ctx, user.imageUrl as Id<'_storage'>);
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

export const addSeenId = mutation({
  args: {
    messages: v.array(v.id('messages')),
    id: v.id('users'),
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
    senderId: v.id('users'),
    recipient: v.id('users'),
    conversationId: v.id('conversations'),
    content: v.string(),
    fileType: v.optional(v.union(v.literal('image'), v.literal('pdf'))),
    uploadUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('messages', {
      conversationId: args.conversationId,
      content: args.content,
      fileType: args.fileType,
      senderId: args.senderId,
      seenId: [args.senderId],
    });
    const lastMessage =
      args.fileType === 'image' || args.fileType === 'pdf'
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
    members: v.array(v.id('users')),

    groupId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await getLoggedInUser(ctx, 'mutation');
    if (!identity) {
      throw new ConvexError({ message: 'You are not authorized' });
    }
    const group = await ctx.db.get(args.groupId);

    if (!group) {
      throw new ConvexError({ message: 'Group not found' });
    }
    const user = await ctx.db.get(identity._id);
    if (group.creatorId !== identity._id || !user) {
      throw new ConvexError({ message: 'You are not authorized' });
    }

    await ctx.db.patch(group._id, {
      participants: [...group.participants, ...args.members],
    });
    for (const member of args.members) {
      await ctx.db.insert('members', {
        memberId: member,
        conversationId: group._id,
        addedBy: user.name!,
      });
    }
  },
});
export const fetchWorkersThatAreNotInGroup = query({
  args: {
    groupId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const identity = await getLoggedInUser(ctx, 'query');
    if (!identity) {
      return [];
    }

    const workers = await ctx.db
      .query('workers')
      .withIndex('boss_Id', (q) => q.eq('bossId', identity._id))
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
    loggedInUser: v.id('users'),
    groupId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.groupId);
    if (!group) {
      throw new ConvexError('Group not found');
    }
    if (group.creatorId !== args.loggedInUser) {
      throw new ConvexError('You are not authorized');
    }

    const members = await ctx.db
      .query('members')
      .withIndex('by_conversation_id', (q) =>
        q.eq('conversationId', args.groupId),
      )
      .collect();

    const messages = await ctx.db
      .query('messages')
      .withIndex('by_conversationId', (q) =>
        q.eq('conversationId', args.groupId),
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
    loggedInUserId: v.id('users'),
    userToRemoveId: v.id('users'),
    conversationId: v.id('conversations'),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.conversationId);
    if (!group) {
      throw new ConvexError('Failed to remove user');
    }
    const member = await getMemberHelper(ctx, group._id, args.userToRemoveId);

    if (group.creatorId !== args.loggedInUserId || !member) {
      throw new ConvexError('You are not authorized');
    }

    await ctx.db.patch(group._id, {
      participants: group.participants.filter((p) => p !== args.userToRemoveId),
    });
    await ctx.db.delete(member._id);
  },
});
// helpers
export const getParticipants = async (ctx: QueryCtx, userId: Id<'users'>) => {
  return await ctx.db.get(userId);
};

export const getMessagesUnreadCount = async (
  ctx: QueryCtx,
  conversationId: Id<'conversations'>,
  userId: Id<'users'>,
) => {
  const messages = await ctx.db
    .query('messages')
    .filter((q) => q.eq(q.field('conversationId'), conversationId))
    .collect();
  const unreadMessages = messages.filter((m) => !m.seenId.includes(userId));
  return unreadMessages.length || 0;
};

export const getConversationsBetweenTwoUsers = async (
  ctx: QueryCtx,
  loggedInUserId: Id<'users'>,
  otherUserId: Id<'users'>,
) => {
  const conversations = await ctx.db.query('conversations').collect();
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
  loggedInUserId: Id<'users'>,
  otherUserId: Id<'users'>,
  type: 'single' | 'processor',
) => {
  const me = await ctx.db.get(loggedInUserId);
  const otherUser = await ctx.db.get(otherUserId);
  if (!me || !otherUser) {
    throw new ConvexError('User not found');
  }
  const members = [loggedInUserId, otherUserId];
  const id = await ctx.db.insert('conversations', {
    participants: members,
    participantNames: [me.name!, otherUser.name!],
    type: type,
  });
  for (const member of members) {
    await ctx.db.insert('members', {
      memberId: member,
      conversationId: id,
      addedBy: me.name!,
    });
  }
};

export const getConversationIamIn = async (
  ctx: QueryCtx,
  userId: Id<'users'>,
) => {
  return filter(
    ctx.db.query('conversations').withIndex('by_id'),
    (conversation) => conversation.participants.includes(userId),
  ).collect();
};
export const getProcessorConversationIamIn = async (
  ctx: QueryCtx,
  userId: Id<'users'>,
) => {
  return filter(
    ctx.db.query('conversations').withIndex('by_id'),
    (conversation) =>
      conversation.participants.includes(userId) &&
      conversation.type === 'processor',
  ).collect();
};
