import { useCalls } from '@stream-io/video-react-native-sdk';
import { Redirect, usePathname } from 'expo-router';
import { PropsWithChildren } from 'react';

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls().filter((c) => c.ringing);
  const ringingCall = calls[0];
  console.log(ringingCall);

  const pathname = usePathname();
  const isOnRingingScreen = pathname === '/call/ringing';
  if (ringingCall && !isOnRingingScreen) {
    return <Redirect href="/call/ringing" />;
  }

  return <>{children}</>;
}
