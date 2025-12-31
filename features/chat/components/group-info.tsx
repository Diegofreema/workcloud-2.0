import { View } from 'react-native';
import { useAppChatContext } from '~/components/providers/chat-context';
import { RoomInfoTop } from './info-header';
import { RenderInfoStaffs } from './info-body';

export const GroupInfo = () => {
  const { channel } = useAppChatContext();
  if (!channel) return null;

  const members = Object.values(channel.state.members);

  const memberCount = Object.keys(channel.state.members).length;
  return (
    <View style={{ flex: 1 }}>
      <RoomInfoTop count={memberCount || 0} channel={channel} />
      <RenderInfoStaffs members={members} channel={channel} />
    </View>
  );
};
