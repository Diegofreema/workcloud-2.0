import { View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useLocalSearchParams } from "expo-router";
import { Id } from "~/convex/_generated/dataModel";
import { useGetUserId } from "~/hooks/useGetUserId";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { RoomInfoTop } from "~/features/chat/components/info-header";
import { RenderInfoStaffs } from "~/features/chat/components/info-body";

export const GroupInfo = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  const { id } = useGetUserId();
  const group = useQuery(api.conversation.getGroup, { groupId });
  const groupMembers = useQuery(
    api.conversation.getGroupMember,
    group ? { memberIds: group.participants } : "skip",
  );
  if (group === undefined && groupMembers === undefined)
    return <LoadingComponent />;

  const data =
    groupMembers
      ?.filter((member) => member._id !== group?.creatorId)
      .map((item) => ({
        name: item.name!,
        image: item.imageUrl!,
        id: item._id!,
        role: item.role!,
      })) ?? [];
  return (
    <View style={{ flex: 1 }}>
      <RoomInfoTop data={group!} count={groupMembers?.length || 0} />
      <RenderInfoStaffs data={data} />
    </View>
  );
};
