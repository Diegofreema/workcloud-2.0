import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexQueryClient } from '@convex-dev/react-query';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import { useFonts } from 'expo-font';
import * as Notifications from 'expo-notifications';
import { Stack, useNavigationContainerRef, usePathname } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Toaster } from 'sonner-native';
import { useDarkMode } from '~/hooks/useDarkMode';
// import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

import * as Sentry from '@sentry/react-native';
import { isRunningInExpoGo } from 'expo';
import { MenuProvider } from 'react-native-popup-menu';
import { AuthProvider, useAuth } from '~/context/auth';
import { NotificationProvider } from '~/context/notification-context';
import { registerTask } from '~/lib/utils';
// import { registerTask } from "~/lib/utils";

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};
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

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});
const convexQueryClient = new ConvexQueryClient(convex);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);
registerTask();

Sentry.init({
  dsn: 'https://3309f876b2a32501367ff526d4b77ca7@o4506898363318273.ingest.us.sentry.io/4507879223066624',
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  tracesSampleRate: 1.0, // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. Adjusting this value in production.
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  enableNativeFramesTracking: !isRunningInExpoGo(), // Tracks slow and frozen frames in the application
  _experiments: {
    profilesSampleRate: 1.0,
    replaysSessionSampleRate: 1.0,
    replaysOnErrorSampleRate: 1.0,
  },
  attachScreenshot: true,
});

SplashScreen.preventAutoHideAsync();

const InitialRouteLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Stack>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
};

export function RootLayout() {
  const { darkMode } = useDarkMode();

  const pathname = usePathname();
  console.log('🚀 ~ RootLayoutNav ~ pathname:', pathname);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    PoppinsLight: require('../assets/fonts/Poppins-Light.ttf'),
    PoppinsBold: require('../assets/fonts/Poppins-Bold.ttf'),
    PoppinsMedium: require('../assets/fonts/Poppins-Medium.ttf'),
    PoppinsBoldItalic: require('../assets/fonts/Poppins-BoldItalic.ttf'),
    PoppinsLightItalic: require('../assets/fonts/Poppins-BoldItalic.ttf'),
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
    <ConvexAuthProvider
      client={convex}
      storage={
        Platform.OS === 'android' || Platform.OS === 'ios'
          ? secureStorage
          : undefined
      }
    >
      <NotificationProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar
                style={darkMode === 'dark' ? 'light' : 'dark'}
                backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
              />
              <SafeAreaView
                style={{
                  flex: 1,
                  backgroundColor: darkMode === 'dark' ? 'black' : 'white',
                }}
              >
                <MenuProvider>
                  <InitialRouteLayout />
                </MenuProvider>
                <Toaster />
              </SafeAreaView>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </AuthProvider>
      </NotificationProvider>
    </ConvexAuthProvider>
  );
}

export default Sentry.wrap(RootLayout);
