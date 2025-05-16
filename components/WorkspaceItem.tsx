import { Image } from 'expo-image';
import { StyleSheet, Pressable } from 'react-native';

import { MyText } from './Ui/MyText';

import { Organization } from '~/constants/types';

export const WorkspaceItem = ({ item, onPress }: { item: Organization; onPress?: () => void }) => {
  return (
    <Pressable onPress={onPress} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
      {item?.avatar && (
        <Image
          source={{ uri: item?.avatar }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: 'black',
          }}
          placeholder={require('~/assets/images/icon.png')}
          placeholderContentFit="cover"
          contentFit="cover"
        />
      )}
      <MyText
        poppins="Medium"
        style={{
          fontSize: 12,

          textTransform: 'capitalize',
        }}>
        {item?.name}
      </MyText>
    </Pressable>
  );
};
