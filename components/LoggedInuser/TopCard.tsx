import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { HStack } from '../HStack';
import { MyText } from '../Ui/MyText';
import { UserPreview } from '../Ui/UserPreview';

import { colors } from '~/constants/Colors';
import { useDarkMode } from '~/hooks/useDarkMode';
type Props = {
  id?: string;
  image?: string;
  name?: string | null;
};

export const TopCard = ({ image, name, id }: Props): JSX.Element => {
  const router = useRouter();

  const { darkMode } = useDarkMode();

  const onEditProfile = () => {
    router.push(`/edit-new?id=${id}`);
  };
  return (
    <View style={{ backgroundColor: darkMode === 'dark' ? 'black' : 'white', marginBottom: 20 }}>
      <View
        style={[styles.absolute, { backgroundColor: darkMode === 'dark' ? 'black' : 'white' }]}
      />
      <View
        style={[
          styles.topCard,
          {
            backgroundColor: darkMode === 'dark' ? 'black' : 'white',
            shadowColor: darkMode === 'dark' ? '#fff' : '#000',
          },
        ]}>
        <HStack justifyContent="space-between" alignItems="center">
          <UserPreview imageUrl={image} name={name} id={id} />
          <Pressable
            style={{
              backgroundColor: colors.dialPad,
              padding: 10,
              borderRadius: 5,
            }}
            onPress={onEditProfile}>
            <MyText poppins="Medium" fontSize={15} style={{ color: 'white' }}>
              Edit Profile
            </MyText>
          </Pressable>
        </HStack>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topCard: {
    paddingHorizontal: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    paddingBottom: 20,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  absolute: {
    position: 'absolute',
    top: -5,
    right: 0,
    left: 0,
    width: '100%',
    height: 10,
    backgroundColor: 'white',
    zIndex: 1,
  },
});
