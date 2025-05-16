import { Avatar } from '@rneui/themed';
import { router } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

import { HStack } from '~/components/HStack';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';

type Props = {
  imageUrl: string;
  name: string;
};

export const ChatHeader = ({ imageUrl, name }: Props) => {
  const onPress = () => {
    router.back();
  };
  return (
    <HStack alignItems="center" gap={10} bg="transparent" py={15} px={2}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        <ChevronLeft color={colors.black} size={40} style={{ marginRight: -10 }} />
      </TouchableOpacity>
      <Avatar rounded source={{ uri: imageUrl }} size={60} />
      <MyText poppins="Medium" fontSize={20} style={{ color: colors.black }}>
        {name}
      </MyText>
    </HStack>
  );
};
