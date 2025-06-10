import {View} from "react-native";
import {HStack} from "~/components/HStack";
import {UserPreview} from "~/components/Ui/UserPreview";
import {capitaliseFirstLetter} from "~/lib/helper";
import {EmptyText} from "~/components/EmptyText";
import React, {ReactNode} from "react";
import {LegendList} from "@legendapp/list";
import {ProcessorType} from "~/features/staff/type";

type Props = {
  data: ProcessorType[];
  rightContent?: ReactNode;
};
export const StaffLists = ({ data, rightContent }: Props) => {
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
            {rightContent}
          </HStack>
        )}
        ListEmptyComponent={() => <EmptyText text="No staffs found" />}
        recycleItems
      />
    </View>
  );
};
