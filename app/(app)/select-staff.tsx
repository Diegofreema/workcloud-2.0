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
          return (
            <UserPreviewWithBio
              workerId={item?._id!}
              id={item?.userId}
              imageUrl={item?.user?.image!}
              name={fullName}
              bio={item.experience!}
              skills={item.skills!}
              onPress={() =>
                onSelectStaff({
                  id: item?._id!,
                  name: fullName,
                  image: item?.user?.image!,
                  role: item.role!,
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
