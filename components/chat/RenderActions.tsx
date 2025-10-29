import { ArrowUpToLine, PaperclipIcon } from 'lucide-react-native';
import React from 'react';
import { Actions, ActionsProps } from 'react-native-gifted-chat';

import { CustomPressable } from '~/components/Ui/CustomPressable';
import { useMinutes, useRecording } from '~/features/chat/hook/use-recording';

type Props = ActionsProps & {
  onPickDocument: () => void;
  onUploadVoiceNote: () => void;
};

export const RenderActions = ({
  onPickDocument,
  onUploadVoiceNote,
  ...props
}: Props) => {
  const recordState = useRecording((state) => state.recorderState);
  const minutes = useMinutes((state) => state.minutes);
  const clear = useMinutes((state) => state.clear);
  const isRecording = recordState.isRecording;
  const isAudio = isRecording || minutes > 0;
  const onHandlePress = () => {
    if (isAudio) {
      onUploadVoiceNote();
      clear();
    } else {
      onPickDocument();
    }
  };
  return (
    <Actions
      {...props}
      icon={() => (
        <CustomPressable onPress={onHandlePress} disable={isRecording}>
          {isAudio ? (
            <ArrowUpToLine size={24} color="black" />
          ) : (
            <PaperclipIcon size={24} color="black" />
          )}
        </CustomPressable>
      )}
      containerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
      }}
    />
  );
};
