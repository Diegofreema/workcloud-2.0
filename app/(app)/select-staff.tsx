import { useQuery } from 'convex/react';
import { ErrorBoundaryProps, router } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';

import { AuthHeader } from '~/components/AuthHeader';
import { EmptyText } from '~/components/EmptyText';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyButton } from '~/components/Ui/MyButton';
import { MyText } from '~/components/Ui/MyText';
import { UserPreviewWithBio } from '~/components/Ui/UserPreviewWithBio';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useGetUserId } from '~/hooks/useGetUserId';
import { User, useSelect } from '~/hooks/useSelect';

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <ErrorComponent
      refetch={retry}
      text={'Something went wrong. Please try again later.'}
    />
  );
}
const SelectStaff = () => {
  const { onSelect } = useSelect();
  const { id } = useGetUserId();
  const staffs = useQuery(
    api.organisation.getStaffsByBossIdNotHavingServicePoint,
    { bossId: id! }
  );

  if (!staffs) {
    return <LoadingComponent />;
  }

  const onSelectStaff = (item: User) => {
    onSelect(item);
    router.back();
  };

  return (
    <Container>
      <AuthHeader path="Select Staff" />
      <FlatList
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        data={staffs}
        renderItem={({ item }) => {
          const fullName = item?.user?.name!;
          const { worker, user } = item;
          return (
            <UserPreviewWithBio
              workerId={worker?._id!}
              id={user?._id as Id<'users'>}
              imageUrl={item?.user?.image!}
              name={fullName}
              bio={worker.experience!}
              skills={worker.skills!}
              onPress={() =>
                onSelectStaff({
                  id: worker?._id!,
                  name: fullName,
                  image: user?.image!,
                  role: worker.role!,
                })
              }
            />
          );
        }}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', gap: 10 }}>
            <EmptyText text="No free staff" />
            <MyButton onPress={() => router.push('/allStaffs')}>
              <MyText poppins="Bold" style={{ color: 'white', fontSize: 15 }}>
                Add a new staff
              </MyText>
            </MyButton>
          </View>
        )}
      />
    </Container>
  );
};

export default SelectStaff;
