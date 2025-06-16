import {FlatList, View} from "react-native";
import {MyText} from "~/components/Ui/MyText";
import React from "react";
import {Suggestions} from "~/features/organization/type";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import VStack from "~/components/Ui/VStack";
import {router} from "expo-router";

type Props = {
  suggestions: Suggestions[];
  hide: boolean;
};

export const RenderSuggestions = ({ suggestions, hide }: Props) => {
  if (hide) return null;
  return (
    <View style={{ marginTop: 20 }}>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <MyText poppins={"Medium"} fontSize={14}>
            Suggested services
          </MyText>
        )}
        data={suggestions}
        renderItem={({ item }) => <Suggestion suggestion={item} />}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ gap: 15 }}
      />
    </View>
  );
};
type SuggestionsProps = {
  suggestion: Suggestions;
};
export const Suggestion = ({ suggestion }: SuggestionsProps) => {
  const onPress = () => {

    router.push(`/service-points/${suggestion.name}`);
  };
  return (
    <CustomPressable onPress={onPress}>
      <VStack gap={5}>
        <MyText poppins={"Light"} fontSize={14}>
          {suggestion.name}
        </MyText>
      </VStack>
    </CustomPressable>
  );
};
