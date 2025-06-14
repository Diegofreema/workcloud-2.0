import { FlatList, View } from "react-native";
import { MyText } from "~/components/Ui/MyText";
import React from "react";
import { Suggestions } from "~/features/organization/type";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import VStack from "~/components/Ui/VStack";
import { colors } from "~/constants/Colors";
import { router } from "expo-router";

type Props = {
  suggestions: Suggestions[];
};

export const RenderSuggestions = ({ suggestions }: Props) => {
  return (
    <View style={{ marginVertical: 15, flex: 1 }}>
      <FlatList
        ListHeaderComponent={() => (
          <MyText poppins={"Medium"} fontSize={14}>
            Suggested services
          </MyText>
        )}
        data={suggestions}
        renderItem={({ item }) => <Suggestion suggestion={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ gap: 15 }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              width: "100%",
              height: 1,
              backgroundColor: colors.grayText,
            }}
          />
        )}
      />
    </View>
  );
};
type SuggestionsProps = {
  suggestion: Suggestions;
};
export const Suggestion = ({ suggestion }: SuggestionsProps) => {
  const onPress = () => {
    // @ts-ignore
    router.push(`reception/${suggestion.organizationId}`);
  };
  return (
    <CustomPressable onPress={onPress}>
      <VStack gap={5}>
        <MyText poppins={"Medium"} fontSize={14}>
          {suggestion.organizationName}
        </MyText>
        <MyText poppins={"Light"} fontSize={14}>
          {suggestion.name}
        </MyText>
      </VStack>
    </CustomPressable>
  );
};
