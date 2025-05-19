import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const User = {
  email: v.string(),
  clerkId: v.string(),
  imageUrl: v.optional(v.string()),
  name: v.string(),
  pushToken: v.optional(v.string()),
  organizationId: v.optional(v.id("organizations")),
  workerId: v.optional(v.id("workers")),
  phoneNumber: v.optional(v.string()),
  date_of_birth: v.optional(v.string()),
  isOnline: v.optional(v.boolean()),
  lastSeen: v.optional(v.string()),
  streamToken: v.optional(v.string()),
};

export const Organization = {
  avatar: v.union(v.id("_storage"), v.string()),
  category: v.string(),
  description: v.string(),
  email: v.string(),
  end: v.string(),
  followers: v.optional(v.array(v.id("users"))),
  followersCount: v.number(),
  location: v.string(),
  name: v.string(),
  ownerId: v.id("users"),
  start: v.string(),
  website: v.string(),
  workDays: v.string(),
  workspaceCount: v.number(),
  has_group: v.boolean(),
  workers: v.optional(v.array(v.id("workers"))),
  searchCount: v.number(),
};

export const Star = {
  customerId: v.id("users"),
  workspaceId: v.id("workspaces"),
  text: v.string(),
};

export const Worker = {
  userId: v.id("users"),
  experience: v.string(),
  location: v.string(),
  organizationId: v.optional(v.id("organizations")),
  qualifications: v.string(),
  servicePointId: v.optional(v.id("servicePoints")),
  skills: v.string(),
  workspaceId: v.optional(v.id("workspaces")),
  role: v.optional(v.string()),
  bossId: v.optional(v.id("users")),
  gender: v.string(),
  email: v.string(),
  type: v.optional(v.union(v.literal("processor"), v.literal("normal"))),
};
export const Post = {
  image: v.union(v.id("_storage"), v.string()),
  organizationId: v.id("organizations"),
};
export const Role = {
  role: v.string(),
};
export const Request = {
  from: v.id("users"),
  to: v.id("users"),
  role: v.string(),
  salary: v.string(),
  responsibility: v.string(),
  qualities: v.string(),
  accepted: v.boolean(),
  unread: v.boolean(),
  pending: v.boolean(),
};
export const Workspace = {
  active: v.boolean(),
  leisure: v.boolean(),
  organizationId: v.id("organizations"),
  ownerId: v.id("users"),
  responsibility: v.optional(v.string()),
  salary: v.optional(v.string()),
  waitlistCount: v.number(),
  role: v.string(),
  workerId: v.optional(v.id("workers")),
  servicePointId: v.optional(v.id("servicePoints")),
  locked: v.boolean(),
  type: v.union(
    v.literal("personal"),
    v.literal("processor"),
    v.literal("normal"),
  ),
};
export const Connection = {
  ownerId: v.id("users"),
  connectedTo: v.id("organizations"),
  connectedAt: v.string(),
};

export const WaitList = {
  customerId: v.id("users"),
  workspaceId: v.id("workspaces"),
  joinedAt: v.string(),
  type: v.union(
    v.literal("waiting"),
    v.literal("next"),
    v.literal("attending"),
  ),
};

export const Attendance = {
  signInAt: v.string(),
  workerId: v.id("users"),
  date: v.string(),
  signOutAt: v.optional(v.string()),
};

export const Conversation = {
  name: v.optional(v.string()),
  lastMessage: v.optional(v.string()),
  participants: v.array(v.id("users")),
  lastMessageTime: v.optional(v.number()),
  lastMessageSenderId: v.optional(v.id("users")),
  type: v.optional(
    v.union(v.literal("single"), v.literal("processor"), v.literal("group")),
  ),
};

export const Message = {
  senderId: v.id("users"),
  recipient: v.id("users"),
  conversationId: v.id("conversations"),
  isEdited: v.optional(v.boolean()),
  content: v.union(v.id("_storage"), v.string()),
  contentType: v.union(v.literal("image"), v.literal("text")),
  seenId: v.array(v.id("users")),
  parentMessageId: v.optional(v.id("messages")),
};

export const Suggestion = {
  text: v.string(),
};

export const ServicePoints = {
  description: v.string(),
  externalLink: v.optional(v.boolean()),
  form: v.optional(v.boolean()),
  name: v.string(),
  organizationId: v.id("organizations"),
  service: v.boolean(),
  staff: v.id("workers"),
};
export const Reviews = {
  organizationId: v.id("organizations"),
  text: v.optional(v.string()),
  rating: v.number(),
  userId: v.id("users"),
};
export default defineSchema({
  users: defineTable(User)
    .index("by_workerId", ["workerId"])
    .index("clerkId", ["clerkId"])
    .searchIndex("name", {
      searchField: "name",
    }),
  organizations: defineTable(Organization)
    .index("ownerId", ["ownerId"])
    .index("by_search_count", ["searchCount"])
    .searchIndex("name", {
      searchField: "name",
    }),
  workers: defineTable(Worker)
    .index("by_org_id", ["organizationId"])
    .index("boss_Id", ["bossId"])
    .index("userId", ["userId"]),
  workspaces: defineTable(Workspace)
    .index("workspace", ["organizationId", "ownerId"])
    .index("personal", ["organizationId", "type"]),
  connections: defineTable(Connection)
    .index("by_ownerId_orgId", ["ownerId", "connectedTo"])
    .index("by_createdAt", ["connectedAt"]),
  waitlists: defineTable(WaitList).index("by_customer_id_workspace_id", [
    "workspaceId",
    "customerId",
  ]),
  servicePoints: defineTable(ServicePoints)
    .searchIndex("description", {
      searchField: "description",
    })
    .index("by_organisation_id", ["organizationId"]),
  roles: defineTable(Role),
  posts: defineTable(Post).index("by_org_id", ["organizationId"]),
  requests: defineTable(Request),
  conversations: defineTable(Conversation).index(
    "by_last_message_last_message_time",
    ['lastMessageTime'],
  ),
  messages: defineTable(Message)
    .index("by_conversationId", ["conversationId"])
    .index("by_conversationId_recipient", ["conversationId", "recipient"]),
  attendance: defineTable(Attendance)
    .index("worker_id_date", ["workerId", "date"])
    .index("worker_id", ["workerId"]),
  suggestions: defineTable(Suggestion)
    .searchIndex("text", {
      searchField: "text",
    })
    .index("by_text", ["text"]),
  reviews: defineTable(Reviews).index("by_organization_id", ["organizationId"]),
  stars: defineTable(Star).index("by_workspace_id", ["workspaceId"]),
});
