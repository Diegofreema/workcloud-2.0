import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import AttendingUi from './AttendingUi';

import { HStack } from '~/components/HStack';
import { Profile } from '~/components/Ui/WorkspaceProfile';
import { WaitList as WaitlistType } from '~/constants/types';
import { Id } from '~/convex/_generated/dataModel';
import { useDarkMode } from '~/hooks/useDarkMode';
import { MyText } from './MyText';
import { RFPercentage } from 'react-native-responsive-fontsize';

type WaitlistsProps = {
  waitlists: WaitlistType[];
  isWorker: boolean;
  onLongPress: (customerId: Id<'users'>) => void;
  onAddToCall: (
    currentUser: Id<'waitlists'>,
    nextUser: Id<'waitlists'>,
    customerId: Id<'users'>
  ) => void;
  isLoading: boolean;
};
export const Waitlists = ({
  waitlists,
  isWorker,
  onLongPress,
  onAddToCall,
  isLoading,
}: WaitlistsProps) => {
  const { darkMode } = useDarkMode();
  const getIdsToUpdate = (id: Id<'waitlists'>, customerId: Id<'users'>) => {
    const userToAttendTo = waitlists.findIndex((user) => user._id === id);
    if (userToAttendTo === -1) return;
    const isNextUser = waitlists[userToAttendTo + 1]?._id;
    onAddToCall(id, isNextUser, customerId);
  };
  const usersToAttendTo = waitlists.filter(
    (u) => u.type === 'attending' || u.type === 'next'
  );
  const filteredWaitlists = waitlists.filter((u) => u.type === 'waiting');

  return (
    <>
      {usersToAttendTo.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <MyText
            poppins="Bold"
            fontSize={RFPercentage(1.7)}
            style={{ marginBottom: 10 }}
          >
            Live interaction
          </MyText>
          <AttendingUi users={usersToAttendTo} />
        </View>
      )}
      <FlatList
        contentContainerStyle={{
          flexGrow: 1,
          gap: 10,
          width: '100%',
        }}
        columnWrapperStyle={{ gap: 10 }}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <HStack gap={5} alignItems="center" my={20}>
            <Text
              style={{
                color: darkMode === 'dark' ? 'white' : 'black',
                fontFamily: 'PoppinsBold',
              }}
            >
              {isWorker ? 'Waiting in your lobby' : 'Waiting in lobby'}
            </Text>
            <View style={styles.rounded}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'PoppinsMedium',
                  fontSize: 12,
                }}
              >
                {filteredWaitlists?.length}
              </Text>
            </View>
          </HStack>
        )}
        scrollEnabled={false}
        data={filteredWaitlists}
        renderItem={({ item }) => (
          <Profile
            item={item}
            onAddToCall={getIdsToUpdate}
            onLongPress={() => onLongPress(item?.customerId)}
            isLoading={isLoading}
          />
        )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  rounded: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue',
    alignItems: 'center',
  },
});
