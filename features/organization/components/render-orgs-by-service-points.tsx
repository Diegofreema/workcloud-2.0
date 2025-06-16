import { View } from "react-native";
import { BFetchOrgsByServicePointsType } from "~/features/organization/type";
import { LegendList } from "@legendapp/list";
import { OrganizationCard } from "~/features/organization/components/organization-card";

type Props = {
  data: BFetchOrgsByServicePointsType[];
};
export const RenderOrgsByServicePoints = ({ data }: Props) => {
  console.log(
    "RenderOrgsByServicePoints",
    data.map((m) => m.id),
  );
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        data={data}
        recycleItems
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => item.id + index.toString()}
        contentContainerStyle={{ gap: 20, paddingBottom: 50 }}
        renderItem={({ item }) => <OrganizationCard data={item} />}
      />
    </View>
  );
};
