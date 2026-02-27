import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as Updates from 'expo-updates';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack, useNavigationContainerRef, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Appearance, PermissionsAndroid, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { useColorScheme } from '~/hooks/useColorScheme';
// import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { MenuProvider } from 'react-native-popup-menu';
import { AuthProvider, useAuth } from '~/context/auth';
import { NotificationProvider } from '~/context/notification-context';
import { useTheme } from '~/hooks/use-theme';
// import { registerTask } from '~/lib/utils';
import { CustomStatusBar } from '~/components/custom-status-bar';
import Colors from '~/constants/Colors';
import { Provider } from '~/components/provider';
import { useConvex } from 'convex/react';
// import { registerTask } from "~/lib/utils";

// Construct a new integration instance. This is needed to communicate between the integration and React
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
    priority: Notifications.AndroidNotificationPriority.HIGH,
  }),
});

// registerTask();

// Sentry.init({
//   dsn: 'https://3309f876b2a32501367ff526d4b77ca7@o4506898363318273.ingest.us.sentry.io/4507879223066624',
//   debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
//   tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
//   integrations: [
//     // Pass integration
//     navigationIntegration,
//   ],
//   enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
//   _experiments: {
//     profilesSampleRate: 1.0,
//     replaysSessionSampleRate: 1.0,
//     replaysOnErrorSampleRate: 1.0,
//   },
//   attachScreenshot: true,
// });

void SplashScreen.preventAutoHideAsync();

const InitialRouteLayout = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    async function onFetchUpdateAsync() {
      try {
        const update = await Updates.checkForUpdateAsync();

        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // You can also add an alert() to see the error message in case of an error when fetching updates.
        console.log(error);
      }
    }
    void onFetchUpdateAsync();
  }, []);

  return (
    <KeyboardProvider>
      <Stack>
        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </KeyboardProvider>
  );
};

export function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme((state) => state.theme);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      Appearance.setColorScheme(theme);
    }
  }, [theme]);
  const pathname = usePathname();
  console.log('🚀 ~ RootLayoutNav ~ pathname:', pathname);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBoldItalic: require('../assets/fonts/Poppins-BoldItalic.ttf'),
    PoppinsLightItalic: require('../assets/fonts/Poppins-LightItalic.ttf'),
    ...FontAwesome.font,
  });
  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref?.current) {
      navigationIntegration.registerNavigationContainer(ref);
    }
  }, [ref]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    const run = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          'android.permission.POST_NOTIFICATIONS',
          'android.permission.BLUETOOTH_CONNECT',
        ]);
      }
    };
    void run();
  }, []);
  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Provider>
        <NotificationProvider>
          <AuthProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaView
                style={{
                  flex: 1,
                  backgroundColor: Colors[colorScheme ?? 'light'].background,
                }}
                // edges={['left', 'top', 'right']}
              >
                <MenuProvider>
                  <CustomStatusBar />
                  <InitialRouteLayout />
                </MenuProvider>
                <Toaster />
              </SafeAreaView>
            </GestureHandlerRootView>
          </AuthProvider>
        </NotificationProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default RootLayout;
