import {Container} from "~/components/Ui/Container";
import {ChatHeader} from "~/components/Ui/ChatHeader";
import React from "react";
import {useLocalSearchParams} from "expo-router";
import {Id} from "~/convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import ChatSkeleton from "~/components/Ui/ChatSkeleton";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import {EllipsisVertical} from "lucide-react-native";

const GroupChatScreen = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  const group = useQuery(api.conversation.getGroup, { groupId });
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
            <EllipsisVertical color={"black"} size={20} />
          </CustomPressable>
        }
      />
    </Container>
  );
};
export default GroupChatScreen;
