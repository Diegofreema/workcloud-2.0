import { useQuery } from 'convex/react';
import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import {
  Directions,
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { ChannelFilters } from 'stream-chat';
import { HStack } from '~/components/HStack';
import { UnreadProcessorMessage } from '~/components/processor-unread-message-banner';
import { Container } from '~/components/Ui/Container';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { ChannelList } from '~/features/chat/components/channel-list';
import { IconBtn } from '~/features/common/components/icon-btn';
import { SearchComponent } from '~/features/common/components/SearchComponent';
import { TabsSelectorString } from '~/features/common/components/tabs';
import { useUnreadProcessorMessageCount } from '~/features/common/hook/use-unread-message-count';
export const Messages = () => {
  const { user } = useAuth();
  const id = user?.id!;
  const [type, setType] = useState<string>('single');
  const [value, setValue] = useState('');
  const filters: ChannelFilters = useMemo(
    () => ({
      members: { $in: [id] },
      type: 'messaging',
      filter_tags: { $eq: [type] },
      'member.user.name': value ? { $autocomplete: value } : undefined,
    }),
    [id, type, value]
  );

  const unreadProcessorMessagesCount = useUnreadProcessorMessageCount();

  const staffs = useQuery(api.organisation.getStaffsByBossId);

  const staffCount = staffs === undefined ? 0 : staffs.length;
  const onSwipeLeft = () => {
    if (type === 'single') return;
    setType('single');
  };
  const onSwipeRight = () => {
    if (type === 'group') return;
    setType('group');
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
        <SearchComponent
          show={false}
          placeholder={'Search messages...'}
          value={value}
          setValue={setValue}
          showArrow={false}
        />
        <HStack mb={10}>
          <TabsSelectorString
            data={['single', 'group']}
            selected={type}
            setSelected={setType}
          />
        </HStack>
        <ChannelList filters={filters} />

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
