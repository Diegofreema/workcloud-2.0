import { router } from "expo-router";
import { X } from "lucide-react-native";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

import { MyText } from "./Ui/MyText";

import { useDarkMode } from "~/hooks/useDarkMode";
import { useStoreSearch } from "~/hooks/useStoreSearch";

export const RecentSearch = (): JSX.Element => {
  const recentSearchedOrgs = useStoreSearch((state) => state.orgs);
  return (
    <View style={{ marginVertical: recentSearchedOrgs.length > 0 ? 20 : 0 }}>
      <FlatList
        data={recentSearchedOrgs}
        ListHeaderComponent={
          recentSearchedOrgs.length > 0 ? (
            <MyText poppins="Medium" fontSize={16}>
              Recent Searches
            </MyText>
          ) : (
            <></>
          )
        }
        scrollEnabled={false}
        renderItem={({ item }) => <SearchItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
};

const SearchItem = ({ item }: { item: { name: string; id: string } }) => {
  const removeOrg = useStoreSearch((state) => state.removeOrg);
  const { darkMode } = useDarkMode();
  const onPress = () => {
    // @ts-ignore
    router.push(`reception/${item.id}`);
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.5 : 1 },
      ]}
    >
      <MyText poppins="Bold" fontSize={14}>
        {item.name}
      </MyText>
      <Pressable
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1, padding: 5 }]}
        onPress={() => removeOrg(item.id)}
      >
        <X size={20} color={darkMode === "dark" ? "#fff" : "#000"} />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 10,
  },
});
