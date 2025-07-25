import { Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { User } from '~/constants/types';

type Props = {
  user: User;
};
export const SearchConversation = ({ user }: Props) => {
  const onPress = () => {
    router.push(`/chat/${user._id}`);
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderBottomWidth: 1,
        borderBottomColor: colors.gray10,
        paddingBottom: 10,
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <Avatar rounded size={60} source={{ uri: user?.image! }} />
      <MyText poppins="Bold" fontSize={RFPercentage(2)}>
        {user?.name}
      </MyText>
    </TouchableOpacity>
  );
};
