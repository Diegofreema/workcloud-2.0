import { StyleSheet } from 'react-native';

import { HStack } from '../HStack';
import { Avatar } from './Avatar';
import { MyText } from './MyText';
import VStack from './VStack';

import { WaitList } from '~/constants/types';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { colors } from '~/constants/Colors';

type Props = {
  users: WaitList[];
};

const AttendingUi = ({ users }: Props) => {
  const { attending: user1, next: user2 } = users.reduce(
    (acc, user) => ({
      ...acc,
      [user.type]: user,
    }),
    { attending: undefined, next: undefined }
  );
  return (
    <HStack>
      <AttendingUser waitlist={user1!} actionText="Attending to" />
      {user2 && <AttendingUser waitlist={user2} actionText="Next" />}
    </HStack>
  );
};

export default AttendingUi;

const styles = StyleSheet.create({
  container: {},
  text: {
    textAlign: 'center',
    fontSize: RFPercentage(1.7),
  },
  text2: {
    fontSize: RFPercentage(1.5),
    color: colors.grayText,
  },
});

const AttendingUser = ({ waitlist, actionText }: { waitlist: WaitList; actionText: string }) => {
  return (
    <VStack justifyContent="center" alignItems="center" gap={5}>
      <Avatar image={waitlist.customer?.imageUrl!} height={50} width={50} />
      <MyText poppins="Medium" style={styles.text2}>
        {actionText}
      </MyText>
      <MyText poppins="Medium" style={styles.text}>
        {waitlist.customer?.name.split(' ')[0]}
      </MyText>
    </VStack>
  );
};
