import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { PropsWithChildren } from 'react';
import { Platform } from 'react-native';

import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import * as SecureStore from 'expo-secure-store';

const convex = new ConvexReactClient(
  'https://kindred-chihuahua-431.convex.cloud',
  {
    unsavedChangesWarning: false,
  }
);
const convexQueryClient = new ConvexQueryClient(convex);
const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: convexQueryClient.hashFn(),
      queryFn: convexQueryClient.queryFn(),
    },
  },
});
convexQueryClient.connect(queryClient);
export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <ConvexAuthProvider
      client={convex}
      storage={
        Platform.OS === 'android' || Platform.OS === 'ios'
          ? secureStorage
          : undefined
      }
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexAuthProvider>
  );
};
