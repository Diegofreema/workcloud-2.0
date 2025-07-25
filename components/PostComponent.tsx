import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";

import { EmptyText } from "./EmptyText";

import { PostType } from "~/constants/types";
import { useDeletePost } from "~/hooks/useDeletePost";
import { LegendList } from "@legendapp/list";
import { colors } from "~/constants/Colors";

type Props = {
  imgUrls: PostType[];
};

export const PostComponent = ({ imgUrls }: Props): JSX.Element => {
  return (
    <LegendList
      style={{ marginTop: 20 }}
      data={imgUrls}
      renderItem={({ item }) => <PostItem {...item} />}
      keyExtractor={(item) => item._id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 50 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      ListEmptyComponent={() => <EmptyText text="No posts yet" />}
      recycleItems
    />
  );
};

const PostItem = ({ image, _id }: PostType) => {
  const { getId, onOpen } = useDeletePost();
  const handleDelete = () => {
    getId(_id);
    onOpen();
  };
  return (
    <View>
      <Image
        source={{ uri: image! }}
        style={{ width: "100%", height: 200, borderRadius: 10 }}
        contentFit="cover"
        placeholder={require("~/assets/images.png")}
        placeholderContentFit="cover"
      />
      <Pressable
        onPress={handleDelete}
        style={({ pressed }) => ({
          position: "absolute",
          top: 10,
          right: 10,
          padding: 10,
          opacity: pressed ? 0.5 : 1,
          backgroundColor: colors.closeTextColor,
          borderRadius: 100,
        })}
      >
        <FontAwesome name="trash" color="white" size={20} />
      </Pressable>
    </View>
  );
};
