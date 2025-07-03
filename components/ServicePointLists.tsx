import { Divider } from "@rneui/themed";
import { FlatList } from "react-native";

import { EmptyText } from "./EmptyText";
import { MyText } from "./Ui/MyText";
import VStack from "./Ui/VStack";

import { colors } from "~/constants/Colors";
import { ServicePointType } from "~/constants/types";
import { useDarkMode } from "~/hooks/useDarkMode";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import * as Linking from "expo-linking";
import { toast } from "sonner-native";

type Props = {
  data: ServicePointType[];
};

export const ServicePointLists = ({ data }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <FlatList
      scrollEnabled={false}
      ListHeaderComponent={() => (
        <MyText poppins="Bold" fontSize={15} style={{ marginBottom: 10 }}>
          Service Point
        </MyText>
      )}
      data={data}
      renderItem={({ item }) => <ServicePointItem item={item} />}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
      ItemSeparatorComponent={() => (
        <Divider
          style={{
            marginVertical: 10,
            backgroundColor: darkMode === "dark" ? "transparent" : "#ccc",
          }}
        />
      )}
      ListEmptyComponent={() => <EmptyText text="No Service Point yet" />}
    />
  );
};

const ServicePointItem = ({ item }: { item: ServicePointType }) => {
  const { darkMode } = useDarkMode();
  const onPress = async () => {
    if (item.externalLink && (await Linking.canOpenURL(item.externalLink))) {
      await Linking.openURL(item.externalLink);
    } else {
      toast.success("Could not open URL");
    }
  };
  return (
    <VStack>
      <MyText poppins="Bold" fontSize={14}>
        {item.name}
      </MyText>
      <MyText
        poppins="Medium"
        fontSize={12}
        style={{
          color: darkMode === "dark" ? colors.white : colors.grayText,
          marginTop: 5,
        }}
      >
        {item.description}
      </MyText>
      {item.externalLink && (
        <CustomPressable onPress={onPress}>
          <MyText
            poppins="Medium"
            fontSize={14}
            style={{ color: colors.dialPad }}
          >
            {item.linkText}
          </MyText>
        </CustomPressable>
      )}
    </VStack>
  );
};
