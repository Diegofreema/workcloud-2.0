import { Id } from "~/convex/_generated/dataModel";

export type GroupType = {
  id: Id<"conversations">;
  name: string;
  image?: string;
  lastMessage?: string;
  lastMessageTime?: number;
  lastMessageSenderId?: Id<"users">;
  creatorId: Id<"users">;
};
