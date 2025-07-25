import { useMutation } from "convex/react";
import { router } from "expo-router";
import { FlatList, Pressable, View } from "react-native";

import { MyText } from "./Ui/MyText";

import { Avatar } from "~/components/Ui/Avatar";
import { SearchType } from "~/constants/types";
import { api } from "~/convex/_generated/api";

type Props = {
  data: SearchType[];
};

export const TSearch = ({ data }: Props): JSX.Element => {
  return (
    <View>
      <MyText poppins="Bold" fontSize={20} style={{ marginBottom: 10 }}>
        Top Searches
      </MyText>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item item={item} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

const Item = ({ item }: { item: SearchType }) => {
  const increaseCount = useMutation(api.organisation.increaseSearchCount);
  const onPress = async () => {
    // @ts-ignore
    router.push(`reception/${item.id}?search=true`);
    try {
      await increaseCount({ id: item.id });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        flex: 1,

        alignItems: "center",
      })}
    >
      <Avatar image={item.avatar!} />
      <MyText
        poppins="Light"
        fontSize={14}
        style={{ textAlign: "center", maxWidth: 80 }}
      >
        {item.name}
      </MyText>
    </Pressable>
  );
};
