import { ActivitiesType } from '~/constants/types';
import { HStack } from '~/components/HStack';
import { Avatar } from '~/features/common/components/avatar';
import VStack from '~/components/Ui/VStack';
import { MyText } from '~/components/Ui/MyText';
import { format } from 'date-fns';
import { ChatMenu } from '~/features/chat/components/chat-menu';
import React from 'react';
import { useGetUserId } from '~/hooks/useGetUserId';
import { router } from 'expo-router';
import { Alert } from 'react-native';

type Props = {
  item: ActivitiesType;
};
interface MenuItem {
  text: string;
  onSelect: () => void;
}
export const Starred = ({ item }: Props) => {
  const { workspaceId } = useGetUserId();
  const handleUnstar = async () => {};
  const onAlert = () => {
    Alert.alert('Are you sure?', 'This can not be undone.', [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Unstar',
        onPress: handleUnstar,
        style: 'destructive',
      },
    ]);
  };
  const menuItems: MenuItem[] = [
    {
      text: 'Send to processor',
      onSelect: () =>
        router.push(
          `/select-processor?workspaceId=${workspaceId}&id=${item._id}`
        ),
    },
    {
      text: 'Unstar client',
      onSelect: onAlert,
    },
  ];

  return (
    <HStack alignItems={'center'} justifyContent={'space-between'}>
      <HStack gap={5} alignItems={'center'}>
        <Avatar url={item.user.image as string} size={60} />
        <VStack>
          <MyText poppins={'Bold'} fontSize={15}>
            {item.user.name}
          </MyText>
          <MyText poppins={'Light'} fontSize={15}>
            {format(item._creationTime, 'PP')}
          </MyText>
        </VStack>
      </HStack>
      <ChatMenu alignSelf={'flex-end'} menuItems={menuItems} />
    </HStack>
  );
};
