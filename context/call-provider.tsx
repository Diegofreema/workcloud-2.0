import { useCalls } from '@stream-io/video-react-native-sdk';
import { Href, Redirect, usePathname } from 'expo-router';
import { PropsWithChildren } from 'react';
import { useCallStore } from '~/features/calls/hook/useCallStore';

export default function CallProvider({ children }: PropsWithChildren) {
  const calls = useCalls().filter((c) => c.ringing);
  const ringingCall = calls[0];
  console.log(ringingCall);
  const {
    data: { workspaceId },
  } = useCallStore();

  const pathname = usePathname();
  const redirectPath: Href = workspaceId ? `/wk/${workspaceId}` : '/';
  const isOnRingingScreen = pathname === '/call/ringing';
  if (ringingCall && !isOnRingingScreen) {
    return <Redirect href="/call/ringing" />;
  }
  if (!ringingCall && isOnRingingScreen) {
    return <Redirect href={redirectPath} />;
  }

  return <>{children}</>;
}
