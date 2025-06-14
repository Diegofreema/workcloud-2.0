import { View } from "react-native";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { Redirect, useLocalSearchParams } from "expo-router";
import { Id } from "~/convex/_generated/dataModel";
import { useGetUserId } from "~/hooks/useGetUserId";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { RoomInfoTop } from "~/features/chat/components/info-header";
import { RenderInfoStaffs } from "~/features/chat/components/info-body";
import { toast } from "sonner-native";

export const GroupInfo = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  const { id } = useGetUserId();
  const group = useQuery(api.conversation.getGroup, { groupId });
  const groupMembers = useQuery(
    api.conversation.getGroupMember,
    group ? { memberIds: group.participants } : "skip",
  );
  if (group === undefined && groupMembers === undefined) {
    return <LoadingComponent />;
  }

  const isInGroup = !!group?.participants.includes(id!);
  if (!isInGroup) {
    toast.error("You are not in this group");
    return <Redirect href={"/message"} />;
  }
  const data =
    groupMembers
      ?.filter((member) => member._id !== group?.creatorId)
      .map((item) => ({
        name: item.name!,
        image: item.imageUrl!,
        id: item._id!,
        role: item.role!,
        _id: item.workerId!,
        workspace: null,
      })) ?? [];

  return (
    <View style={{ flex: 1 }}>
      <RoomInfoTop data={group!} count={groupMembers?.length || 0} />
      <RenderInfoStaffs data={data} />
    </View>
  );
};
