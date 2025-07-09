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
        // padding: 10,
        flex: 1,
      }}
      alignItems="center"
    >
      <Composer
        {...props}
        multiline
        textInputStyle={{ backgroundColor: 'transparent' }}
        textInputProps={{ numberOfLines: 5 }}
      />
      <CustomPressable onPress={onPickImage}>
        <Camera size={24} color="black" strokeWidth={1.5} />
      </CustomPressable>
    </HStack>
  );
};
