import { View, Text, Pressable } from "react-native";
import { WorkSpace } from "~/constants/types";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { HStack } from "~/components/HStack";
import { Avatar } from "@rneui/themed";
import VStack from "~/components/Ui/VStack";
import { MyText } from "~/components/Ui/MyText";
import { colors } from "~/constants/Colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";

export const WorkspaceComponent = ({ item }: { item: WorkSpace }) => {
  const handlePress = () => {
    if (item?.locked) {
      toast("This workspace is locked", {
        description: "Please wait till the admin unlocks it",
      });
      return;
    }
    router.push(`/wk/${item?._id}`);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <HStack gap={10} alignItems="center">
        <Avatar
          rounded
          source={{ uri: item.organization?.avatar! }}
          size={50}
        />
        <VStack>
          <MyText poppins="Bold" style={{ fontSize: 13 }}>
            {item?.role}
          </MyText>
          <View
            style={{
              backgroundColor: item?.active
                ? colors.openTextColor
                : colors.closeBackgroundColor,
              paddingHorizontal: 2,
              borderRadius: 3,
              alignItems: "center",
            }}
          >
            <MyText
              poppins="Light"
              style={{
                color: item?.active
                  ? colors.openBackgroundColor
                  : colors.closeTextColor,
              }}
            >
              {item?.active ? "Active" : "Not active"}
            </MyText>
          </View>
        </VStack>
      </HStack>

      {item?.locked && (
        <HStack
          gap={5}
          alignItems="center"
          bg={colors.closeBackgroundColor}
          px={5}
          rounded={6}
        >
          <FontAwesome name="lock" size={20} color={colors.closeTextColor} />
          <MyText poppins="Bold" style={{ color: colors.closeTextColor }}>
            Locked
          </MyText>
        </HStack>
      )}
    </Pressable>
  );
};
