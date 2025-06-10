import {ClerkLoaded, ClerkLoading, ClerkProvider, useAuth,} from "@clerk/clerk-expo";
import {tokenCache} from "@clerk/clerk-expo/token-cache";
import {ConvexQueryClient} from "@convex-dev/react-query";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ConvexReactClient} from "convex/react";
import {ConvexProviderWithClerk} from "convex/react-clerk";
import {useFonts} from "expo-font";
import {Slot, usePathname, useRouter, useSegments,} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {StatusBar} from "expo-status-bar";
import * as Updates from "expo-updates";
import {useEffect} from "react";
import {PermissionsAndroid, Platform} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaView} from "react-native-safe-area-context";
import {Toaster} from "sonner-native";

import {LoadingComponent} from "~/components/Ui/LoadingComponent";
import {useDarkMode} from "~/hooks/useDarkMode";

// import * as Sentry from "@sentry/react-native";
// import { isRunningInExpoGo } from "expo";
import {MenuProvider} from "react-native-popup-menu";

// Construct a new integration instance. This is needed to communicate between the integration and React
// const navigationIntegration = Sentry.reactNavigationIntegration({
//   enableTimeToInitialDisplay: !isRunningInExpoGo(),
// });

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

// Sentry.init({
//   dsn: "https://3309f876b2a32501367ff526d4b77ca7@o4506898363318273.ingest.us.sentry.io/4507879223066624",
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

SplashScreen.preventAutoHideAsync();

const InitialRouteLayout = () => {
  const segments = useSegments();
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  console.log({ isSignedIn });

  useEffect(() => {
    if (!isLoaded) return;

    const inTabsGroup = segments[0] === "(app)";

    if (isSignedIn && !inTabsGroup) {
      router.replace(`/(app)/(tabs)`);
    } else if (!isSignedIn && inTabsGroup) {
      router.replace("/(auth)/login");
    }
  }, [isSignedIn, isLoaded, segments, router]);
  return <Slot />;
};

export function RootLayout() {
  const { darkMode } = useDarkMode();

  const pathname = usePathname();
  console.log("🚀 ~ RootLayoutNav ~ pathname:", pathname);
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    PoppinsLight: require("../assets/fonts/Poppins-Light.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
    PoppinsMedium: require("../assets/fonts/Poppins-Medium.ttf"),
    PoppinsBoldItalic: require("../assets/fonts/Poppins-BoldItalic.ttf"),
    PoppinsLightItalic: require("../assets/fonts/Poppins-BoldItalic.ttf"),
    ...FontAwesome.font,
  });
  // const ref = useNavigationContainerRef();

  // useEffect(() => {
  //   if (ref?.current) {
  //     navigationIntegration.registerNavigationContainer(ref);
  //   }
  // }, [ref]);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);
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
  useEffect(() => {
    const run = async () => {
      if (Platform.OS === "android") {
        await PermissionsAndroid.requestMultiple([
          "android.permission.POST_NOTIFICATIONS",
          "android.permission.BLUETOOTH_CONNECT",
        ]);
      }
    };
    void run();
  }, []);
  if (!loaded) {
    return null;
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  if (!publishableKey) {
    throw new Error(
      "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env",
    );
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <QueryClientProvider client={queryClient}>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <StatusBar
                style={darkMode === "dark" ? "light" : "dark"}
                backgroundColor={darkMode === "dark" ? "black" : "white"}
              />
              <SafeAreaView
                style={{
                  flex: 1,
                  backgroundColor: darkMode === "dark" ? "black" : "white",
                }}
              >
                <MenuProvider>
                  <InitialRouteLayout />
                </MenuProvider>
                <Toaster />
              </SafeAreaView>
            </GestureHandlerRootView>
          </QueryClientProvider>
        </ConvexProviderWithClerk>
      </ClerkLoaded>
      <ClerkLoading>
        <LoadingComponent />
      </ClerkLoading>
    </ClerkProvider>
  );
}

export default RootLayout;
