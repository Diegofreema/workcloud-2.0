import { View } from "react-native";
import { LegendList } from "@legendapp/list";
import { HeadingText } from "~/components/Ui/HeadingText";
import { Item } from "~/components/Item";
import { EmptyText } from "~/components/EmptyText";
import { constantStyles } from "~/constants/styles";

type Props<T> = {
  headerText: string;
  data: T[];
};

let T;
export const HomeBody = <T,>({ data, headerText }: Props<T>) => {
  return (
    <View style={{ flex: 1 }}>
      <LegendList
        ListHeaderComponent={
          <View style={{ marginVertical: 10 }}>
            <HeadingText link="/connections" rightText={headerText} />
          </View>
        }
        contentContainerStyle={constantStyles.contentContainerStyle}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const lastIndex = [1, 2, 3].length - 1;
          const isLastItemOnList = index === lastIndex;

          // @ts-ignore
          return <Item {...item} isLastItemOnList={isLastItemOnList} />;
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => {
          return <EmptyText text="No Connections yet" />;
        }}
        recycleItems
      />
    </View>
  );
};
