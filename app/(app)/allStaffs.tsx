import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';

import { EmptyText } from '~/components/EmptyText';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { UserPreviewWithBio } from '~/components/Ui/UserPreviewWithBio';
import { api } from '~/convex/_generated/api';
import { useGetUserId } from '~/hooks/useGetUserId';

const AllStaffs = () => {
  const { id } = useGetUserId();
  const { data, isPending, isError, isPaused, refetch, isRefetching } = useQuery(
    convexQuery(api.worker.getAllOtherWorkers, { bossId: id! })
  );

  // const {
  //   data: pendingData,
  //   isPending: isPendingData,
  //   isError: isErrorData,
  //   isPaused: isPausedData,
  //   refetch: refetchData,
  //   isRefetching: isRefetchingData,
  //   isRefetchError: isRefetchErrorData,
  // } = usePendingWorkers();

  const handleRefetch = () => {
    refetch();
  };
  if (isPaused || isError) {
    return <ErrorComponent refetch={handleRefetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <Container>
      <HeaderNav title="Add staff" />
      <FlatList
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefetch}
        refreshing={isRefetching}
        data={data}
        renderItem={({ item }) => (
          <UserPreviewWithBio
            id={item?.userId}
            imageUrl={item?.user?.imageUrl!}
            name={item?.user?.name!}
            bio={item?.experience!}
            skills={item?.skills}
            onPress={() => router.push(`/workerProfile/${item?._id}`)}
          />
        )}
        style={{ marginTop: 20 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        keyExtractor={(item, index) => index.toString()}
        ListEmptyComponent={() => <EmptyText text="No staff yet" />}
      />
    </Container>
  );
};

export default AllStaffs;
