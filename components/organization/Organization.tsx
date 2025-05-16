import { Divider } from '@rneui/themed';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { colors } from '../../constants/Colors';
import { useDarkMode } from '../../hooks/useDarkMode';
import { HStack } from '../HStack';
import { MyText } from '../Ui/MyText';
import VStack from '../Ui/VStack';

type Props = {
  isLastItem: boolean;
};

export const Organization = ({ isLastItem }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <>
      <HStack
        justifyContent="space-between"
        alignItems="center"
        style={{
          paddingVertical: 10,
          paddingBottom: 15,
        }}>
        <HStack gap={15} alignItems="center">
          <Image style={styles.img} source={{ uri: 'https://via.placeholder.com/48x48' }} />
          <VStack>
            <MyText style={{ color: darkMode ? 'white' : 'black' }} poppins="Light">
              Fidelity
            </MyText>
            <MyText style={styles.open} poppins="Light">
              open
            </MyText>
          </VStack>
        </HStack>

        <VStack>
          <MyText style={styles.greyColor} poppins="Light">
            Today
          </MyText>
          <MyText style={styles.greyColor} poppins="Light">
            22:00
          </MyText>
        </VStack>
      </HStack>
      {!isLastItem && <Divider style={{ marginTop: 10, backgroundColor: '#DADADA' }} />}
    </>
  );
};

const styles = StyleSheet.create({
  open: {
    backgroundColor: colors.openBackgroundColor,
    color: colors.openTextColor,
    verticalAlign: 'middle',
    borderRadius: 10,
  },
  close: {
    backgroundColor: colors.closeBackgroundColor,
    color: colors.closeTextColor,
    verticalAlign: 'middle',
    borderRadius: 10,
  },

  greyColor: {
    color: '#999999',
  },
  img: {
    height: 48,
    width: 48,
    borderRadius: 9999,
  },
});
