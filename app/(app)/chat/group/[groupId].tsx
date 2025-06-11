import { Container } from "~/components/Ui/Container";
import { ChatHeader } from "~/components/Ui/ChatHeader";
import React from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { Id } from "~/convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import ChatSkeleton from "~/components/Ui/ChatSkeleton";
import { ChatGroupComponent } from "~/features/chat/components/group-gifted-chat";
import { useGetUserId } from "~/hooks/useGetUserId";
import { useMarkRead } from "~/hooks/useMarkRead";
import { ChatMenu } from "~/features/chat/components/chat-menu";
import { toast } from "sonner-native";

const GroupChatScreen = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  const { id: loggedInUserId } = useGetUserId();
  const group = useQuery(api.conversation.getGroup, { groupId });
  const {
    status,
    loadMore,
    results: data,
    isLoading,
  } = usePaginatedQuery(
    api.conversation.getGroupMessages,
    group && loggedInUserId
      ? {
          conversationId: group?._id!,
          loggedInUserId,
        }
      : "skip",
    { initialNumItems: 100 },
  );
  useMarkRead({
    conversationData: group!,
    loggedInUserId: loggedInUserId!,
  });
  if (group === undefined) {
    return <ChatSkeleton />;
  }

  if (group === null) {
    return <Redirect href={"/message"} />;
  }
  const isInGroup = !!group?.participants.includes(loggedInUserId!);
  if (!isInGroup) {
    toast.error("You are not in this group");
    return <Redirect href={"/message"} />;
  }
  const isCreator = group?.creatorId === loggedInUserId;
  return (
    <Container noPadding>
      <ChatHeader
        name={group?.name || "Group"}
        imageUrl={group?.imageUrl || ""}
        rightContent={
          isCreator ? (
            <ChatMenu
              menuItems={[
                {
                  text: "Group info",
                  onSelect: () =>
                    router.push(`/group-info?groupId=${group?._id}`),
                },
              ]}
            />
          ) : null
        }
      />
      <ChatGroupComponent
        conversationId={group?._id!}
        createdAt={group?._creationTime!}
        loggedInUserId={loggedInUserId!}
        data={data || []}
        status={status}
        loadMore={loadMore}
        isLoading={isLoading}
      />
    </Container>
  );
};
export default GroupChatScreen;
