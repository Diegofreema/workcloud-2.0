import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FlatList, View } from 'react-native';

import { EmptyText } from '~/components/EmptyText';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { UserPreview } from '~/components/Ui/UserPreview';
import { api } from '~/convex/_generated/api';
import { useGetUserId } from '~/hooks/useGetUserId';

const PendingStaffs = () => {
  const { id: bossId } = useGetUserId();
  const { data, isPaused, isPending, isError, refetch, isRefetching, isRefetchError } = useQuery(
    convexQuery(api.request.getPendingStaffsWithoutOrganization, { id: bossId! })
  );

  if (isError || isRefetchError || isPaused) {
    return <ErrorComponent refetch={refetch} />;
  }

  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <Container>
      <HeaderNav title="Pending Staffs" />
      <FlatList
        style={{ marginTop: 10 }}
        ListEmptyComponent={() => <EmptyText text="No pending staffs" />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        onRefresh={refetch}
        refreshing={isRefetching}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        data={data}
        renderItem={({ item }) => (
          <UserPreview
            imageUrl={item?.user?.imageUrl!}
            name={item?.user?.name}
            navigate
            subText={item?.request.pending}
            id={item?.worker?._id}
          />
        )}
        keyExtractor={(item) => item?.request?._id.toString()}
      />
    </Container>
  );
};

export default PendingStaffs;
