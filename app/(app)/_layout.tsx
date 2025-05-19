import { useUser } from '@clerk/clerk-expo';
import { ErrorBoundaryProps, Redirect, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { useDarkMode } from '~/hooks/useDarkMode';

export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}
export default function AppLayout() {
  const { isSignedIn } = useUser();
  const { darkMode } = useDarkMode();

  if (!isSignedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        style={darkMode === 'dark' ? 'light' : 'dark'}
        backgroundColor={darkMode === 'dark' ? 'black' : 'white'}
      />
      {/* <ChatWrapper>
        <VideoProvider>
          <CallProvider> */}
      <Stack screenOptions={{ headerShown: false }} />
      {/* </CallProvider>
        </VideoProvider>
      </ChatWrapper> */}
    </GestureHandlerRootView>
  );
}
