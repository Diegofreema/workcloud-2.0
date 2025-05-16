import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors } from '../constants/Colors';
import { useDarkMode } from '../hooks/useDarkMode';
import { MyText } from './Ui/MyText';

export const WorkCloudHeader = (): JSX.Element => {
  const { darkMode } = useDarkMode();
  const router = useRouter();
  return (
    <>
      <Pressable
        onPress={() => router.push('/create-workspace')}
        style={[
          {
            flexDirection: 'row',
            gap: 10,
            marginTop: 13,
            alignItems: 'center',
          },
        ]}>
        <View style={styles.briefcase}>
          <FontAwesome
            name="briefcase"
            size={20}
            color={darkMode === 'dark' ? colors.white : colors.black}
          />
          <FontAwesome
            name="plus-circle"
            size={15}
            color={colors.lightBlue}
            style={{ position: 'absolute', bottom: 5, right: 3 }}
          />
        </View>
        <MyText
          poppins="Bold"
          style={{
            maxWidth: 100,

            fontSize: 12,
          }}>
          Create an organization
        </MyText>
      </Pressable>
    </>
  );
};

const styles = StyleSheet.create({
  briefcase: {
    borderWidth: 1,
    borderColor: colors.textGray,
    borderRadius: 50,
    padding: 10,
  },
});
