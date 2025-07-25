import { View } from "react-native";
import { constantStyles } from "~/constants/styles";
import { UserPreviewWithBio } from "~/components/Ui/UserPreviewWithBio";
import { router } from "expo-router";
import { EmptyText } from "~/components/EmptyText";
import React from "react";
import { LegendList } from "@legendapp/list";
import { WorkerData } from "~/features/staff/type";

type Props = {
  data: WorkerData[];
  emptyText?: string;
};

export const RenderStaffs = ({ data, emptyText = "No staff yet" }: Props) => {
  return (
    <View style={constantStyles.contentContainerStyle}>
      <LegendList
        showsVerticalScrollIndicator={false}
        data={data}
        renderItem={({ item }) => (
          <UserPreviewWithBio
            imageUrl={item?.user?.image!}
            name={item?.user?.name!}
            bio={item?.worker?.experience!}
            skills={item?.worker?.skills || ""}
            onPress={() => router.push(`/workerProfile/${item?.worker?._id}`)}
            workerId={item?.worker?._id!}
            id={item?.user?._id!}
          />
        )}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => <EmptyText text={emptyText} />}
        recycleItems
      />
    </View>
  );
};
