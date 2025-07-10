import { useCalls } from '@stream-io/video-react-native-sdk';
import { Redirect, router, usePathname } from 'expo-router';
import { PropsWithChildren, useEffect } from 'react';
import { useCallStore } from '~/features/calls/hook/useCallStore';

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls().filter((c) => c.ringing);
  const ringingCall = calls[0];

  const {
    data: { workspaceId },
  } = useCallStore();

  const pathname = usePathname();

  const isOnRingingScreen = pathname === '/call/ringing';
  useEffect(() => {
    if (!ringingCall && isOnRingingScreen && workspaceId) {
      router.back();
    }
    if (ringingCall && !isOnRingingScreen) {
      router.push(`/call/ringing`);
    }
  }, [ringingCall, isOnRingingScreen, workspaceId]);

  if (!ringingCall && isOnRingingScreen && !workspaceId) {
    return <Redirect href={'/'} />;
  }

  return <>{children}</>;
}
