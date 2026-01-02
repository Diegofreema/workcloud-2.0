import {
  ChannelPreviewMessenger,
  ChannelPreviewMessengerProps,
  LatestMessagePreview,
} from 'stream-chat-expo';
import { ChannelPreviewCount } from './chat-preview-count';
import { useAuth } from '~/context/auth';
import { useColorScheme, View } from 'react-native';
import { Reaction, renderReaction, trimText } from '~/lib/utils';
import { MyText } from '~/components/Ui/MyText';
import { File, ImageIcon } from 'lucide-react-native';
import Colors from '~/constants/Colors';
import { FontAwesome } from '@expo/vector-icons';

export const CustomListItem = (props: ChannelPreviewMessengerProps) => {
  const { unread, latestMessagePreview } = props;
  const backgroundColor = unread ? '#e6f7ff' : '#fff';
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const text = Colors[colorScheme ?? 'light'].text;

  const renderMessage = (latestMessagePreview: LatestMessagePreview) => {
    if (latestMessagePreview.messageObject?.type === 'system') {
      return trimText(latestMessagePreview.messageObject?.text || '', 35);
    }
    if (
      latestMessagePreview.messageObject?.attachments?.[0]?.type === 'image'
    ) {
      return <ImageIcon color={text} size={15} />;
    }

    if (latestMessagePreview.messageObject?.attachments?.[0]?.type === 'file') {
      return <File color={text} size={15} />;
    }
    if (
      latestMessagePreview.messageObject?.attachments?.[0]?.type ===
      'voiceRecording'
    ) {
      const durationRaw =
        latestMessagePreview.messageObject?.attachments?.[0]?.duration ?? 0;
      const totalSeconds =
        durationRaw >= 1000
          ? Math.round(durationRaw / 1000)
          : Math.round(durationRaw);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const pad = (n: number) => n.toString().padStart(2, '0');
      const formatted = `${pad(minutes)}:${pad(seconds)}`;
      return (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <FontAwesome name="microphone" color={text} size={15} />
          <MyText poppins="Light" fontSize={12}>
            Voice message
          </MyText>
          <MyText poppins="Light" fontSize={12}>
            ({formatted})
          </MyText>
        </View>
      );
    }

    return (
      trimText(latestMessagePreview.messageObject?.text || '', 20) ||
      latestMessagePreview.previews[0]?.text
    );
  };
  return (
    <View style={{ backgroundColor }}>
      <ChannelPreviewMessenger
        {...props}
        PreviewMessage={({ latestMessagePreview }) => {
          const isSystem =
            latestMessagePreview.messageObject?.type === 'system';
          return (
            <View>
              <MyText poppins="Light" fontSize={isSystem ? 12 : 16}>
                {latestMessagePreview.messageObject?.latest_reactions?.[0]
                  ? renderReaction(
                      latestMessagePreview.messageObject
                        ?.latest_reactions?.[0] as Reaction,
                      user?.id,
                      latestMessagePreview.messageObject?.user?.id,
                      latestMessagePreview.messageObject?.user?.name?.split(
                        ' '
                      )[0]
                    )
                  : ''}
                {renderMessage(latestMessagePreview)}
              </MyText>
            </View>
          );
        }}
        PreviewUnreadCount={ChannelPreviewCount}
      />
    </View>
  );
};
