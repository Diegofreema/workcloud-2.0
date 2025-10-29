import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { Mic, MicOff, SendIcon } from 'lucide-react-native';
import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { IMessage, Send, SendProps } from 'react-native-gifted-chat';
import { colors } from '~/constants/Colors';
import { useMinutes, useRecording } from '~/features/chat/hook/use-recording';

// const AnimatedSend = Animated.createAnimatedComponent(Send);
type Props = SendProps<IMessage> & {
  sending: boolean;
};
export const RenderSend = ({
  sending,

  onSend,
  text,
  sendButtonProps,
  ...props
}: Props) => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  console.log({ audioUrl: audioRecorder.uri });

  const setRecordingState = useRecording((state) => state.setRecordingState);
  const setMins = useMinutes((state) => state.setMinutes);
  const recorderState = useAudioRecorderState(audioRecorder);
  const isRecording = recorderState.isRecording;

  const record = async () => {
    await audioRecorder.prepareToRecordAsync();
    audioRecorder.record();
  };
  useEffect(() => {
    if (isRecording) {
      setRecordingState({
        ...recorderState,
        isRecording: true,
        url: audioRecorder.uri,
      });
      setMins(recorderState.durationMillis);
    } else {
      setRecordingState({
        ...recorderState,
        isRecording: false,
        url: audioRecorder.uri,
      });
    }
  }, [
    isRecording,
    setRecordingState,
    recorderState,
    audioRecorder.uri,

    setMins,
  ]);

  const stopRecording = async () => {
    // The recording will be available on `audioRecorder.uri`.
    await audioRecorder.stop();

    console.log('Press out');
  };

  useEffect(() => {
    (async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert('Permission to access microphone was denied');
      }

      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: true,
        shouldPlayInBackground: true,
      });
    })();
  }, []);

  const customSendPress = (
    onSend:
      | ((
          messages: Partial<IMessage> | Partial<IMessage>[],
          shouldResetInputToolbar: boolean
        ) => void)
      | undefined,
    text?: string
  ) => {
    if (text && onSend) {
      onSend({ text: text.trim() }, true);
    } else {
      return false;
    }
  };

  const renderIcon = () => {
    if (text?.trim() !== '') {
      return <SendIcon color={colors.white} size={23} />;
    }

    return (
      <TouchableOpacity
        onPress={isRecording ? stopRecording : record}
        style={[styles.send]}
        hitSlop={20}
      >
        {isRecording ? (
          <MicOff color={colors.white} size={23} />
        ) : (
          <Mic color={colors.white} size={23} />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <Send
      {...props}
      sendButtonProps={{
        ...sendButtonProps,
        onPress: () => customSendPress(onSend, text),
      }}
      containerStyle={[
        {
          justifyContent: 'center',
          marginBottom: 5,
          marginLeft: 5,
        },
        styles.send,
      ]}
    >
      {sending ? (
        <ActivityIndicator size={'small'} color={colors.white} />
      ) : (
        <View>{renderIcon()}</View>
      )}
    </Send>
  );
};

const styles = StyleSheet.create({
  send: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dialPad,
    width: 50,
    borderRadius: 50,
  },
});
