import { ProcessorType } from "~/features/staff/type";

import { StyleSheet, View } from "react-native";
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
import { router, useLocalSearchParams, useRouter } from "expo-router";
import { toast } from "sonner-native";
import { useCloseGroup } from "~/features/chat/hook/use-close-group";

type Props = {
  data: ProcessorType[];
};

export const RenderInfoStaffs = ({ data }: Props) => {
  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const [loading, setLoading] = useState(false);
  const setOpen = useCloseGroup((state) => state.setIsOpen);
  const open = useCloseGroup((state) => state.isOpen);
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  const { id } = useGetUserId();
  const removeStaffsFromConversation = useMutation(
    api.conversation.removeStaffsFromConversation,
  );
  const closeGroup = useMutation(api.conversation.closeGroup);
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
  const onCloseGroup = async () => {
    setLoading(true);
    try {
      await closeGroup({
        groupId,
        loggedInUser: id!,
      });
      toast.success("Group has been closed");
      router.replace("/message");
    } catch (e) {
      const errorMessage = generateErrorMessage(e, "Failed to close group");
      toast.error(errorMessage);
    } finally {
      setOpen(false);
      setLoading(false);
    }
  };
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <CustomModal
        title={"Remove staff"}
        onClose={() => setUserId(null)}
        isOpen={!!userId}
        onPress={onPress}
        isLoading={loading}
      />
      <CustomModal
        title={"Close group"}
        onClose={() => setOpen(false)}
        isOpen={open}
        onPress={onCloseGroup}
        isLoading={loading}
      />
      <LegendList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15, flexGrow: 1 }}
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
        ListFooterComponent={FooterButtons}
        ListFooterComponentStyle={{ marginTop: "auto" }}
        style={{ flex: 1 }}
        recycleItems
      />
    </View>
  );
};

const ActionButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <CustomPressable onPress={onPress}>
      <MyText poppins={"Medium"} style={{ color: colors.closeTextColor }}>
        Remove Staff
      </MyText>
    </CustomPressable>
  );
};

const FooterButtons = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  const setOpen = useCloseGroup((state) => state.setIsOpen);
  const router = useRouter();
  const onAdd = () => {
    router.push(`/add-staff?groupId=${groupId}`);
  };

  return (
    <HStack mt={"auto"} gap={5}>
      <CustomPressable onPress={onAdd} style={[styles.btn, styles.add]}>
        <MyText
          poppins={"Medium"}
          fontSize={15}
          style={{ color: colors.white }}
        >
          Add Staff
        </MyText>
      </CustomPressable>
      <CustomPressable
        onPress={() => setOpen(true)}
        style={[styles.btn, styles.close]}
      >
        <MyText
          poppins={"Medium"}
          fontSize={15}
          style={{ color: colors.white }}
        >
          Close group
        </MyText>
      </CustomPressable>
    </HStack>
  );
};

const styles = StyleSheet.create({
  btn: {
    flex: 1,
    borderRadius: 5,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  close: {
    backgroundColor: colors.closeTextColor,
  },
  add: {
    backgroundColor: colors.dialPad,
  },
});
