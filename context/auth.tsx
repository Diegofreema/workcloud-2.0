import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useMemo, useCallback } from 'react';

import { useConvex, useMutation, useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';

import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { useNotification } from './notification-context';
import { authClient } from '~/lib/auth-client';
import { User } from 'better-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

WebBrowser.maybeCompleteAuthSession();

type BetterAuthUser = User & {
  userId?: string | null | undefined;
  streamToken?: string | null | undefined;
};
const AuthContext = React.createContext({
  user: undefined as BetterAuthUser | undefined,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = authClient.useSession();

  const [isUpdating, setIsUpdating] = React.useState(false);

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
  const updateStreamToken = useMutation(api.users.updateStreamToken);

  const tokenProvider = useCallback(async () => {
    const values = JSON.stringify(person);
    setIsUpdating(true);
    await AsyncStorage.setItem('person', JSON.stringify(person));
    await AsyncStorage.setItem('body', values);
    try {
      const { data } = await axios.post(
        `https://workcloud-web.vercel.app/token`,
        person,
      );

      await updateStreamToken({ streamToken: data.token });
      await authClient.updateUser({
        streamToken: data.token,
      });
      return data.token;
    } catch (error) {
      console.error('ERROR_TOKEN_PROVIDER', { error });
      throw new Error('Failed to update user data');
    } finally {
      setIsUpdating(false);
    }
  }, [person, updateStreamToken]);

  const isAuthenticated = !!session?.session;
  const isLoading = isPending || isUpdating;

  React.useEffect(() => {
    if (expoPushToken && session?.session) {
      updatePushToken({ pushToken: expoPushToken });
      convex.mutation(api.pushNotification.recordPushNotificationToken, {
        token: expoPushToken,
      });
    }
  }, [expoPushToken, updatePushToken, convex, session?.session]);

  // Call tokenProvider on every mount when authenticated
  React.useEffect(() => {
    if (isAuthenticated && userId) {
      tokenProvider();
    }
  }, []);

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <AuthContext.Provider
      value={{
        user: session?.user,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
