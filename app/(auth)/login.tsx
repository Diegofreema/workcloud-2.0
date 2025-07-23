import { Divider } from '@rneui/themed';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { AuthTitle } from '~/components/AuthTitle';
import { SignIn } from '~/components/Buttons/sign-in-button';
import { Subtitle } from '~/components/Subtitle';
import { Container } from '~/components/Ui/Container';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useWarmUpBrowser } from '~/hooks/warmUpBrowser';

export default function SignInScreen() {
  useWarmUpBrowser();
  const { height } = useWindowDimensions();

  const { darkMode } = useDarkMode();

  // const { signIn } = useSignIn();
  const { width } = useWindowDimensions();

  const color =
    darkMode === 'dark'
      ? ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.9)', '#000']
      : ['rgba(255, 255, 255, 0.7)', 'rgba(255, 255, 255, 0.9)', '#fff'];
  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={{ marginTop: 40, marginHorizontal: 20 }}>
            <AuthTitle>Get an organized way to solve problems</AuthTitle>
            <Subtitle style={{ textAlign: 'center' }}>
              Own a workspace, connect to clients and get issue solved
            </Subtitle>
          </View>
          <Divider />
          <View
            style={{
              width: '100%',

              alignItems: 'center',
              flex: 1,
            }}
          >
            <Image
              source={require('~/assets/images/d.png')}
              style={{
                height: '100%',
                width: width * 0.9,
                resizeMode: 'contain',
                marginTop: 20,
              }}
            />
          </View>
        </View>

        <LinearGradient
          //  @ts-ignore
          colors={color}
          locations={[0, 0.2, 1]}
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: height * 0.25,
          }}
        >
          <View style={{ marginTop: 'auto', marginBottom: 20 }}>
            <SignIn />
          </View>
        </LinearGradient>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
});

// 09063181894
