import { ProcessorType } from "~/features/staff/type";

import { View } from "react-native";
import { LegendList } from "@legendapp/list";
import { HStack } from "~/components/HStack";
import { UserPreview } from "~/components/Ui/UserPreview";
import { capitaliseFirstLetter, generateErrorMessage } from "~/lib/helper";
import { EmptyText } from "~/components/EmptyText";
import React, { useState } from "react";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { MyText } from "~/components/Ui/MyText";
import { colors } from "~/constants/Colors";
import { Id } from "~/convex/_generated/dataModel";
import { CustomModal } from "~/components/Dialogs/CustomModal";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { useGetUserId } from "~/hooks/useGetUserId";
import { useLocalSearchParams } from "expo-router";
import { toast } from "sonner-native";

type Props = {
  data: ProcessorType[];
};

export const RenderInfoStaffs = ({ data }: Props) => {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [loading, setLoading] = useState(false);
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  const { id } = useGetUserId();
  const removeStaffsFromConversation = useMutation(
    api.conversation.removeStaffsFromConversation,
  );
  const onPress = async () => {
    if (!id || !userId) return;
    setLoading(true);
    try {
      await removeStaffsFromConversation({
        conversationId: groupId,
        loggedInUserId: id,
        userToRemoveId: userId,
      });
      toast.success("Staffs removed from conversation");
    } catch (e) {
      const errorMessage = generateErrorMessage(
        e,
        "Failed to remove staffs from conversation",
      );
      toast.error(errorMessage);
    } finally {
      setUserId(null);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <CustomModal
        title={"Remove Staff"}
        onClose={() => setUserId(null)}
        isOpen={!!userId}
        onPress={onPress}
        isLoading={loading}
      />
      <LegendList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HStack justifyContent="space-between" alignItems="center">
            <UserPreview
              id={item.id}
              imageUrl={item?.image}
              name={item?.name}
              subText={capitaliseFirstLetter(item?.role)}
            />
            <ActionButton onPress={() => setUserId(item.id)} />
          </HStack>
        )}
        ListEmptyComponent={() => <EmptyText text="No members found" />}
        recycleItems
      />
    </View>
  );
};

export const ActionButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <CustomPressable onPress={onPress}>
      <MyText poppins={"Medium"} style={{ color: colors.closeTextColor }}>
        Remove Staff
      </MyText>
    </CustomPressable>
  );
};
