import { usePaginatedQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";

type ConversationProps = {
  userId: Id<"users">;
  type: "processor" | "single";
};

export const useGetConversationType = ({ userId, type }: ConversationProps) => {
  return usePaginatedQuery(
    api.conversation.getConversations,
    userId ? { userId, type } : "skip",
    { initialNumItems: 20 },
  );
};
