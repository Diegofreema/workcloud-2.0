import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { api } from "~/convex/_generated/api";
import { Doc, Id } from "~/convex/_generated/dataModel";

type Props = {
  loggedInUserId: Id<"users">;
  conversationData: Doc<"conversations">;
};

export const useMarkRead = ({ loggedInUserId, conversationData }: Props) => {
  const { data } = useQuery(
    convexQuery(api.conversation.getMessagesTanstack, {
      conversationId: conversationData?._id,
    }),
  );
  const markAsRead = useMutation(api.conversation.addSeenId);
  useEffect(() => {
    const onMarkMessagesAsRead = async () => {
      // Early return if no data or no conversation participants
      if (!data || !conversationData?.participants?.length) return;

      // Find messages unseen by ALL participants
      const messagesThatEveryParticipantHasNotSeen = data?.filter((message) => {
        // Ensure seenId is an array and check against all participants
        return !message.senderId.includes(loggedInUserId);
      });
      console.log(messagesThatEveryParticipantHasNotSeen.length);
      // Only proceed if there are messages to mark
      if (messagesThatEveryParticipantHasNotSeen.length > 0) {
        await markAsRead({
          messages: messagesThatEveryParticipantHasNotSeen.map((m) => m._id),
          id: loggedInUserId,
        });
      }
    };
    void onMarkMessagesAsRead();
  }, [markAsRead, data, loggedInUserId, conversationData?.participants]);
};
