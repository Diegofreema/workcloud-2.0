import {
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
} from 'stream-chat-expo';
import { ChannelPreviewCount } from './chat-preview-count';
import { useAuth } from '~/context/auth';
import { View } from 'react-native';
import { Reaction, renderReaction, trimText } from '~/lib/utils';
import { MyText } from '~/components/Ui/MyText';

export const CustomListItem = (props: ChannelPreviewMessengerProps) => {
  const { unread, latestMessagePreview } = props;
  const backgroundColor = unread ? '#e6f7ff' : '#fff';
  const { user } = useAuth();

  return (
    <View style={{ backgroundColor }}>
      <ChannelPreviewMessenger
        {...props}
        PreviewMessage={({ latestMessagePreview }) => (
          <View>
            <MyText poppins="Light" fontSize={16}>
              {latestMessagePreview.messageObject?.latest_reactions?.[0]
                ? renderReaction(
                    latestMessagePreview.messageObject
                      ?.latest_reactions?.[0] as Reaction,
                    user?._id,
                    latestMessagePreview.messageObject?.user?.id,
                    latestMessagePreview.messageObject?.user?.name?.split(
                      ' '
                    )[0]
                  )
                : ''}
              {trimText(latestMessagePreview.messageObject?.text || '', 20)}
            </MyText>
          </View>
        )}
        PreviewUnreadCount={ChannelPreviewCount}
      />
    </View>
  );
};
