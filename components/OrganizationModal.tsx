import { Feather } from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, useWindowDimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import { RFValue } from 'react-native-responsive-fontsize';

import { colors } from '../constants/Colors';
import { useOrganizationModal } from '../hooks/useOrganizationModal';
import { MyText } from './Ui/MyText';

import { useDarkMode } from '~/hooks/useDarkMode';
import { useIsFirstTime } from '~/hooks/use-is-first-time';

export const OrganizationModal = (): JSX.Element => {
  const { isOpen, onClose } = useOrganizationModal();
  const { height } = useWindowDimensions();
  const router = useRouter();
  const { darkMode } = useDarkMode();
  const setIsFirstTimeToFalse = useIsFirstTime((state) => state.setIsFirstTime);
  const handleClose = () => {
    onClose();
    setIsFirstTimeToFalse();
  };
  const createOrganization = () => {
    router.push('/create-workspace');
    handleClose();
  };
  const connectToOrganization = () => {
    router.push('/search');
    handleClose();
  };

  const createWorkerProfile = () => {
    router.push('/create-worker-profile');
    handleClose();
  };

  return (
    <Modal
      hasBackdrop={false}
      onDismiss={onClose}
      animationIn="slideInDown"
      isVisible={isOpen}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View
        style={[
          styles.dialog,
          {
            backgroundColor: darkMode === 'dark' ? 'white' : '#1b1b1b',
            borderRadius: 20,
            padding: 20,
          },
        ]}
      >
        <View style={{ alignItems: 'center' }}>
          <MyText
            poppins="Bold"
            fontSize={RFValue(17, height)}
            style={{
              textAlign: 'center',
              marginTop: 15,
              color: darkMode === 'dark' ? 'black' : 'white',
            }}
          >
            Hi, start your journey on workcloud
          </MyText>
          <Pressable
            onPress={handleClose}
            style={({ pressed }) => [
              { opacity: pressed ? 0.5 : 1 },
              { position: 'absolute', right: 15, top: -8 },
            ]}
          >
            <Feather
              name="x"
              size={20}
              color={darkMode === 'dark' ? 'black' : 'white'}
            />
          </Pressable>
        </View>
        <View
          style={{
            height: 0.5,
            width: '100%',
            backgroundColor: 'white',
            marginTop: 10,
          }}
        />
        <View style={{ padding: 10, alignItems: 'center' }}>
          <View style={{ gap: 15, marginTop: 20 }}>
            <Button
              color={colors.buttonBlue}
              onPress={createOrganization}
              titleStyle={{
                fontFamily: 'PoppinsLight',
                color: 'white',
                fontSize: RFValue(14, height),
              }}
              title="Create An Organization"
              radius={10}
            />

            <Button
              color="#C0D1FE"
              onPress={connectToOrganization}
              titleStyle={{
                fontFamily: 'PoppinsBold',
                color: colors.lightBlue,
                fontSize: RFValue(14, height),
              }}
              containerStyle={{
                width: '100%',
              }}
              title="Connect To An Organization"
              radius={10}
            />

            <Button
              color={colors.lightBlue}
              onPress={createWorkerProfile}
              titleStyle={{
                fontFamily: 'PoppinsLight',
                color: colors.white,
                fontSize: RFValue(14, height),
              }}
              title="Register as a worker"
              radius={10}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
});
