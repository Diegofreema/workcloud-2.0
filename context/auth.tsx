import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';

import { useConvex, useMutation } from 'convex/react';
import { api } from '~/convex/_generated/api';

import { User } from 'better-auth';
import { authClient } from '~/lib/auth-client';
import { useNotification } from './notification-context';

type BetterAuthUser = User & {
  userId?: string | null | undefined;
  streamToken?: string | null | undefined;
};
const AuthContext = createContext({
  user: {} as BetterAuthUser,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = authClient.useSession();

  const user = session?.user;
  const userId = user?.id || '';
  const userName = user?.name || '';
  const userEmail = user?.email || '';
  const userImage = user?.image || '';

  const person = useMemo(
    () => ({
      name: userName,
      email: userEmail,
      image: userImage,
      id: userId,
    }),
    [userName, userEmail, userImage, userId],
  );

  const { expoPushToken } = useNotification();
  const convex = useConvex();
  const updatePushToken = useMutation(api.users.updatePushToken);

  const isAuthenticated = !!session?.session;

  useEffect(() => {
    if (expoPushToken && session?.session) {
      updatePushToken({ pushToken: expoPushToken });
      convex.mutation(api.pushNotification.recordPushNotificationToken, {
        token: expoPushToken,
      });
    }
  }, [expoPushToken, updatePushToken, convex, session?.session]);

  return (
    <AuthContext.Provider
      value={{
        user: session?.user!,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
