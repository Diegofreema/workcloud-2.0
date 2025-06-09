import { View } from "react-native";
import { ProcessorType } from "~/features/staff/type";
import { router } from "expo-router";
import { EmptyText } from "~/components/EmptyText";
import { LegendList } from "@legendapp/list";
import React from "react";
import { UserPreview } from "~/components/Ui/UserPreview";
import { colors } from "~/constants/Colors";

type Props = {
  data: ProcessorType[];
};

export const RenderProcessors = ({ data }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <UserPreview
            imageUrl={item.image}
            name={item.name}
            onPress={() => router.push(`/chat/${item?.id}?type=processor`)}
            id={item?.id}
            roleText={item.role}
          />
        )}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 2,
              width: "100%",
              backgroundColor: colors.grayText,
            }}
          />
        )}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => <EmptyText text={"No processors found"} />}
        recycleItems
      />
    </View>
  );
};
