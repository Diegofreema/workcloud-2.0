import { Image } from 'expo-image';
import { router } from 'expo-router';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { Doc } from '~/convex/_generated/dataModel';

type Props = {
  notification: Doc<'notifications'> & {
    image?: string;
  };
};

export const Notification = ({ notification }: Props) => {
  console.log({ notification });
  const onPress = () => {
    if (notification.requestId) {
      router.push('/request');
    }
  };
  return (
    <CustomPressable onPress={onPress} style={{ flex: 1 }}>
      <HStack gap={10} flex={1}>
        <Image
          source={{ uri: notification.image }}
          placeholder={require('~/assets/images/boy.png')}
          contentFit="cover"
          style={{ width: 50, height: 50, borderRadius: 100 }}
        />
        <VStack flex={1}>
          <MyText poppins="Bold" fontSize={17}>
            {notification.title}
          </MyText>
          <MyText poppins="Light" fontSize={15} style={{ flex: 1 }}>
            {notification.message}
          </MyText>
        </VStack>
      </HStack>
    </CustomPressable>
  );
};
