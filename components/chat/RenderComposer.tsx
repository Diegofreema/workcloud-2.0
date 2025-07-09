import { Camera } from 'lucide-react-native';
import React from 'react';
import { Composer, ComposerProps } from 'react-native-gifted-chat';

import { HStack } from '~/components/HStack';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { colors } from '~/constants/Colors';

type Props = ComposerProps & {
  onPickImage: () => void;
};
export const RenderComposer = ({ onPickImage, ...props }: Props) => {
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
    </HStack>
  );
};
