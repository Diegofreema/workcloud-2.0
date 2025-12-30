import { View } from 'react-native';
import { useAppChatContext } from '~/components/providers/chat-context';
import { RoomInfoTop } from './info-header';

export const GroupInfo = () => {
  const { channel } = useAppChatContext();
  if (!channel) return null;
  console.log(channel.state.members);

  // const data =
  //   groupMembers
  //     ?.filter((member) => member._id !== group?.creatorId)
  //     .map((item) => ({
  //       name: item.name!,
  //       image: item.image!,
  //       id: item._id!,
  //       role: item.role!,
  //       _id: item.workerId!,
  //       workspace: null,
  //     })) ?? [];
  const memberCount = Object.keys(channel.state.members).length;
  return (
    <View style={{ flex: 1 }}>
      <RoomInfoTop count={memberCount || 0} channel={channel} />
      {/*  <RenderInfoStaffs data={data} /> */}
    </View>
  );
};
