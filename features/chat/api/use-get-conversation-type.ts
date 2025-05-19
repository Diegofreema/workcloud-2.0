import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { getUserById } from "~/convex/users";

type ConversationProps = {
  userId: Id<"users">;
};

export const useGetConversationType = ({ userId }: ConversationProps) => {
  return usePaginatedQuery(
    api.conversation.getConversationsSingle,
    { userId },
    { initialNumItems: 20 },
  );
};
