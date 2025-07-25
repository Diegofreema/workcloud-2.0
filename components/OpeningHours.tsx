import { StyleSheet, View, Text } from "react-native";

import { HStack } from "./HStack";
import { MyText } from "./Ui/MyText";
import { colors } from "../constants/Colors";

export const OpeningHours = (): JSX.Element => {
  return (
    <HStack gap={20} mb={10}>
      <MyText poppins="Medium">Monday - Friday</MyText>
      <HStack>
        <View style={styles.subCon}>
          <MyText
            poppins="Bold"
            style={{
              color: colors.openBackgroundColor,
            }}
          >
            8:00am
          </MyText>
        </View>
        <Text> - </Text>
        <View
          style={[
            styles.subCon,
            { backgroundColor: colors.closeBackgroundColor },
          ]}
        >
          <MyText
            poppins="Bold"
            style={{
              color: colors.closeTextColor,
            }}
          >
            5:00pm
          </MyText>
        </View>
      </HStack>
    </HStack>
  );
};

const styles = StyleSheet.create({
  subCon: {
    paddingHorizontal: 7,
    borderRadius: 3,
    backgroundColor: colors.openTextColor,
    alignItems: "center",
  },
});
