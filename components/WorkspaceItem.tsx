import { Image } from "expo-image";
import { StyleSheet, Pressable } from "react-native";

import { MyText } from "./Ui/MyText";

import { Organization } from "~/constants/types";
import { Avatar } from "~/features/common/components/avatar";

export const WorkspaceItem = ({
  item,
  onPress,
}: {
  item: Organization;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
    >
      {item?.avatar && <Avatar url={item.avatar!} />}
      <MyText
        poppins="Medium"
        style={{
          fontSize: 12,

          textTransform: "capitalize",
        }}
      >
        {item?.name}
      </MyText>
    </Pressable>
  );
};
