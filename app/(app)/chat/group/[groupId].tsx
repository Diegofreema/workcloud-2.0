import { Container } from "~/components/Ui/Container";
import { ChatHeader } from "~/components/Ui/ChatHeader";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Id } from "~/convex/_generated/dataModel";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import ChatSkeleton from "~/components/Ui/ChatSkeleton";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { EllipsisVertical } from "lucide-react-native";
import { ChatGroupComponent } from "~/features/chat/components/group-gifted-chat";
import { useGetUserId } from "~/hooks/useGetUserId";
import { useMarkRead } from "~/hooks/useMarkRead";

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
    api.conversation.getMessages,
    {
      conversationId: group?._id!,
    },
    { initialNumItems: 100 },
  );
  useMarkRead({
    conversationData: group!,
    loggedInUserId: loggedInUserId!,
  });
  if (group === undefined) {
    return <ChatSkeleton />;
  }
  return (
    <Container noPadding>
      <ChatHeader
        name={group?.name || "Group"}
        imageUrl={group?.imageUrl || ""}
        rightContent={
          <CustomPressable onPress={() => {}}>
            <EllipsisVertical color={"black"} size={25} />
          </CustomPressable>
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
