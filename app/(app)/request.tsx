import { convexQuery } from "@convex-dev/react-query";
import { Divider } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { FlatList } from "react-native";

import { EmptyText } from "~/components/EmptyText";
import { HeaderNav } from "~/components/HeaderNav";
import { Container } from "~/components/Ui/Container";
import { ErrorComponent } from "~/components/Ui/ErrorComponent";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { WorkPreview } from "~/components/Ui/UserPreview";
import { api } from "~/convex/_generated/api";
import { useDarkMode } from "~/hooks/useDarkMode";

const RequestScreen = () => {
  // const info = useInfos((state) => state.infoIds);

  const { darkMode } = useDarkMode();
  const {
    data,
    isPaused,
    isPending,
    isError,
    refetch,
    isRefetching,
    isRefetchError,
    error,
  } = useQuery(convexQuery(api.request.getPendingRequestsWithOrganization, {}));

  if (isError || isRefetchError || isPaused || error) {
    return <ErrorComponent refetch={refetch} text={error?.message as string} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <>
      <Container>
        <HeaderNav title="Offers" />

        <FlatList
          style={{ marginTop: 10 }}
          ListEmptyComponent={() => (
            <EmptyText text="No pending notifications" />
          )}
          ItemSeparatorComponent={() => (
            <Divider
              style={{
                height: 2,
                backgroundColor: darkMode === "dark" ? "transparent" : "#ccc",
                width: "100%",
              }}
            />
          )}
          onRefresh={refetch}
          refreshing={isRefetching}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 50,
            flexGrow: 1,
          }}
          data={data}
          renderItem={({ item }) => <WorkPreview item={item} />}
          keyExtractor={(item) => item?.request._id.toString()}
        />
      </Container>
    </>
  );
};

export default RequestScreen;
