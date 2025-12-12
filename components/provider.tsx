import { PropsWithChildren } from 'react';

import { ConvexQueryClient } from '@convex-dev/react-query';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConvexReactClient } from 'convex/react';
import { authClient } from '~/lib/auth-client';
import { ConvexBetterAuthProvider } from '@convex-dev/better-auth/react';
const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
  expectAuth: true,
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
export const Provider = ({ children }: PropsWithChildren) => {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ConvexBetterAuthProvider>
  );
};
