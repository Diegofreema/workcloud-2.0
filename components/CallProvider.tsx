import { useCalls } from '@stream-io/video-react-native-sdk';
import { router, usePathname } from 'expo-router';
import { PropsWithChildren, useEffect } from 'react';

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls();
  const call = calls[0];

  const pathname = usePathname();
  const isOnCallScreen = pathname === '/call';
  const isRinging = call?.state?.callingState === 'ringing';
  useEffect(() => {
    if (!call) {
      return;
    }
    if (!isOnCallScreen && isRinging) {
      router.push(`/call`);
    }
  }, [call, isOnCallScreen, isRinging]);

  return <>{children}</>;
}
