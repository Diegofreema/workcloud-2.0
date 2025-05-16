import { Image } from 'expo-image';
import { Pressable } from 'react-native';

import { HStack } from '../HStack';
import { MyText } from './MyText';
import VStack from './VStack';

import { formattedSkills } from '~/app/(app)/workerProfile/[profileId]';
import { trimText } from '~/lib/helper';

type Props = {
  name: string;
  imageUrl: string;
  bio: string;
  skills: string;
  id: string;
  onPress: () => void;
};

export const UserPreviewWithBio = ({
  bio,
  id,
  imageUrl,
  name,
  skills,
  onPress,
}: Props): JSX.Element => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        gap: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        opacity: pressed ? 0.5 : 1,
      })}
    >
      <HStack alignItems="center" gap={10}>
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 60, height: 60, borderRadius: 9999 }}
          placeholder={require('~/assets/images/boy.png')}
          placeholderContentFit="cover"
        />
        <MyText poppins="Bold" fontSize={18}>
          {name}
        </MyText>
      </HStack>
      <VStack>
        <MyText poppins="Medium" fontSize={14}>
          {formattedSkills(skills)}
        </MyText>
        <MyText poppins="Medium" fontSize={15}>
          {trimText(bio, 70)}
        </MyText>
      </VStack>
    </Pressable>
  );
};
