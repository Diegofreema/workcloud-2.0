import { ProcessorType } from "~/features/staff/type";
import { AddStaffButton } from "~/features/staff/components/add-staff-button";
import { View } from "react-native";
import { LegendList } from "@legendapp/list";
import { HStack } from "~/components/HStack";
import { UserPreview } from "~/components/Ui/UserPreview";
import { capitaliseFirstLetter } from "~/lib/helper";
import { EmptyText } from "~/components/EmptyText";
import React from "react";

type Props = {
  data: ProcessorType[];
};

export const RenderStaffs = ({ data }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
        keyExtractor={(item) => item.id}
        data={data}
        renderItem={({ item }) => (
          <HStack justifyContent="space-between" alignItems="center">
            <UserPreview
              id={item.id}
              imageUrl={item?.image}
              name={item?.name}
              subText={capitaliseFirstLetter(item?.role)}
            />
            <AddStaffButton staff={item} />
          </HStack>
        )}
        ListEmptyComponent={() => <EmptyText text="No staffs found" />}
        recycleItems
      />
    </View>
  );
};
