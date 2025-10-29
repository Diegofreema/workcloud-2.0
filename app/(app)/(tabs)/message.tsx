import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useState } from 'react';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { HStack } from '~/components/HStack';
import { UnreadProcessorMessage } from '~/components/processor-unread-message-banner';
import { Container } from '~/components/Ui/Container';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { ChatComponent } from '~/features/chat/components/chat.component';
import { GroupChats } from '~/features/chat/components/group-chats';
import { IconBtn } from '~/features/common/components/icon-btn';
import { TabsSelector } from '~/features/common/components/tabs';
import { TabsHeader } from '~/features/common/components/tabs-header';
import { Title } from '~/features/common/components/title';
import { useUnreadProcessorMessageCount } from '~/features/common/hook/use-unread-message-count';

const Components = [ChatComponent, GroupChats];
const MessageScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const unreadProcessorMessagesCount = useUnreadProcessorMessageCount();
  const ActiveComponents = Components[selectedIndex];

  const staffs = useQuery(api.organisation.getStaffsByBossId);

  const staffCount = staffs === undefined ? 0 : staffs.length;
  const onSwipeLeft = () => {
    if (selectedIndex === 0) return;
    setSelectedIndex(0);
  };
  const onSwipeRight = () => {
    if (selectedIndex === 1) return;
    setSelectedIndex(1);
  };

  const swipe = Gesture.Simultaneous(
    Gesture.Fling()
      .direction(Directions.RIGHT)
      .onEnd(() => {
        runOnJS(onSwipeLeft)();
      }),
    Gesture.Fling()
      .direction(Directions.LEFT)
      .onEnd(() => {
        runOnJS(onSwipeRight)();
      })
  );
  return (
    <GestureDetector gesture={swipe}>
      <Container>
        {unreadProcessorMessagesCount > 0 && (
          <UnreadProcessorMessage unreadCount={unreadProcessorMessagesCount} />
        )}
        <TabsHeader leftContent={<Title title={'Messages'} />} />
        <HStack mb={10}>
          <TabsSelector
            data={['Single', 'Group']}
            selectedIndex={selectedIndex}
            onSelectIndex={(index) => setSelectedIndex(index)}
          />
        </HStack>
        <ActiveComponents />

        {staffCount > 0 && (
          <IconBtn
            content={<Plus color={colors.white} />}
            onPress={() => router.push('/new-group')}
          />
        )}
      </Container>
    </GestureDetector>
  );
};

export default MessageScreen;
