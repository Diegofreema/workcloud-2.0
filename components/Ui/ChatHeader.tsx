import { Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { HStack } from '~/components/HStack';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { ReactNode } from 'react';

type Props = {
  imageUrl: string;
  name: string;
  rightContent?: ReactNode;
};

export const ChatHeader = ({ imageUrl, name, rightContent }: Props) => {
  const onPress = () => {
    router.back();
  };
  return (
    <HStack
      alignItems={'center'}
      justifyContent={'space-between'}
      style={{ paddingRight: 10 }}
    >
      <HStack alignItems="center" gap={10} bg="transparent" py={15} px={2}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
          <ChevronLeft
            color={colors.black}
            size={40}
            style={{ marginRight: -10 }}
          />
        </TouchableOpacity>
        <Avatar
          rounded
          source={{ uri: imageUrl }}
          imageProps={{
            defaultSource: require('../../assets/images/boy.png'),
            resizeMode: 'cover',
          }}
          size={60}
        />
        <MyText
          poppins="Medium"
          fontSize={20}
          style={{ color: colors.black, flex: 1 }}
        >
          {name}
        </MyText>
      </HStack>
      {rightContent}
    </HStack>
  );
};
