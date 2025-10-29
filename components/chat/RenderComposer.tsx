import { RecorderState } from 'expo-audio';
import { AudioLines, Camera, Trash } from 'lucide-react-native';
import React from 'react';
import { Composer, ComposerProps } from 'react-native-gifted-chat';

import { format } from 'date-fns';
import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { colors } from '~/constants/Colors';
import { useMinutes, useRecording } from '~/features/chat/hook/use-recording';
import { MyText } from '../Ui/MyText';

type Props = ComposerProps & {
  onPickImage: () => void;
};
export const RenderComposer = ({ onPickImage, ...props }: Props) => {
  const recordState = useRecording((state) => state.recorderState);
  const minutes = useMinutes((state) => state.minutes);
  const isRecording = recordState.isRecording;

  return (
    <HStack
      style={{
        borderWidth: 1,
        borderColor: colors.gray,
        borderRadius: 5,
        padding: 5,
        height: 'auto',
        flex: 1,
        minHeight: 50,
      }}
      alignItems="center"
    >
      {isRecording || minutes > 0 ? (
        <RecordComponent recordState={recordState} />
      ) : (
        <>
          <Composer
            {...props}
            multiline
            textInputStyle={{
              backgroundColor: 'transparent',
              minHeight: 45,
              maxHeight: 120, // Approximately 5 lines of text (24px per line)
            }}
            textInputProps={{
              numberOfLines: 5,
              scrollEnabled: true,
            }}
          />
          <CustomPressable
            onPress={onPickImage}
            style={{
              paddingHorizontal: 8,
              alignSelf: 'flex-end',
              paddingBottom: 10,
            }}
          >
            <Camera size={24} color="black" strokeWidth={1.5} />
          </CustomPressable>
        </>
      )}
    </HStack>
  );
};

type RecordProps = {
  recordState: RecorderState;
};
const RecordComponent = ({ recordState }: RecordProps) => {
  console.log({ duration: recordState.durationMillis });
  const clearRecording = useMinutes((state) => state.clear);
  const minutes = useMinutes((state) => state.minutes);

  return (
    <HStack
      justifyContent="space-between"
      alignItems="center"
      style={{ overflow: 'hidden' }}
      flex={1}
    >
      <MyText poppins="Bold">{format(minutes, 'mm:ss')}: </MyText>
      {Array.from({
        length: 11,
      }).map((_, index) => (
        <AudioLines
          key={index}
          size={20}
          color={colors.nine}
          strokeWidth={1.5}
        />
      ))}
      {!recordState.isRecording && (
        <CustomPressable
          onPress={clearRecording}
          style={{ alignSelf: 'flex-end' }}
        >
          <Trash size={24} color="black" strokeWidth={1.5} />
        </CustomPressable>
      )}
    </HStack>
  );
};
