import { Pressable, View } from "react-native";
import { HStack } from "~/components/HStack";
import { UserPreview } from "~/components/Ui/UserPreview";
import { capitaliseFirstLetter } from "~/lib/helper";
import { EmptyText } from "~/components/EmptyText";
import React from "react";
import { LegendList } from "@legendapp/list";
import { ProcessorType } from "~/features/staff/type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDarkMode } from "~/hooks/useDarkMode";

type Props = {
  data: ProcessorType[];
  showMenu: (item: ProcessorType) => void;
};
export const StaffLists = ({ data, showMenu }: Props) => {
  const { darkMode } = useDarkMode();
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        data={data}
        renderItem={({ item }) => (
          <HStack justifyContent="space-between" alignItems="center">
            <UserPreview
              id={item.id}
              imageUrl={item?.image}
              name={item?.name}
              subText={capitaliseFirstLetter(item?.role)}
            />
            <Pressable
              onPress={() => showMenu(item)}
              style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            >
              <MaterialCommunityIcons
                name="dots-vertical"
                size={24}
                color={darkMode === "dark" ? "white" : "black"}
              />
            </Pressable>
          </HStack>
        )}
        ListEmptyComponent={() => <EmptyText text="No staffs found" />}
        recycleItems
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
