import { View } from "react-native";
import { useFetchCalls } from "~/features/calls/api/fetch-calls";
import { ErrorComponent } from "~/components/Ui/ErrorComponent";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { LegendList } from "@legendapp/list";
import { VideoCall } from "~/features/calls/components/video-call";
import { EmptyText } from "~/components/EmptyText";

export const FetchCalls = () => {
  const {
    data,
    isPending,
    isError,
    refetch,
    error,
    isRefetching,
    isRefetchError,
  } = useFetchCalls();
  if (isError || error || isRefetchError) {
    return <ErrorComponent refetch={refetch} text={error.message} />;
  }
  if (isPending || data === undefined) {
    return <LoadingComponent />;
  }

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <LegendList
        data={data}
        recycleItems
        onRefresh={refetch}
        refreshing={isRefetching}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100, gap: 20 }}
        renderItem={({ item }) => <VideoCall videoCall={item} />}
        ListEmptyComponent={<EmptyText text={"No calls yet"} />}
      />
    </View>
  );
};
