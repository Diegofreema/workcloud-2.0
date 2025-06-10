import {ProcessorType} from "~/features/staff/type";

import {View} from "react-native";
import {LegendList} from "@legendapp/list";
import {HStack} from "~/components/HStack";
import {UserPreview} from "~/components/Ui/UserPreview";
import {capitaliseFirstLetter} from "~/lib/helper";
import {EmptyText} from "~/components/EmptyText";
import React from "react";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import {MyText} from "~/components/Ui/MyText";
import {colors} from "~/constants/Colors";
import {Id} from "~/convex/_generated/dataModel";

type Props = {
  data: ProcessorType[];
};

export const RenderInfoStaffs = ({ data }: Props) => {
  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <LegendList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 15 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <HStack justifyContent="space-between" alignItems="center">
            <UserPreview
              id={item.id}
              imageUrl={item?.image}
              name={item?.name}
              subText={capitaliseFirstLetter(item?.role)}
            />
            <AddStaffButton id={item.id} />
          </HStack>
        )}
        ListEmptyComponent={() => <EmptyText text="No staffs found" />}
        recycleItems
      />
    </View>
  );
};

export const AddStaffButton = ({ id }: { id: Id<"users"> }) => {
  const onPress = () => {};

  return (
    <CustomPressable onPress={onPress}>
      <MyText poppins={"Medium"} style={{ color: colors.closeTextColor }}>
        Remove Staff
      </MyText>
    </CustomPressable>
  );
};
