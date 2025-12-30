import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';

import { useMutation, useQuery } from 'convex/react';
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
  const person = {
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    image: session?.user?.image || '',
    id: session?.user?.id || '',
  };
  const user = session?.user;
  const { expoPushToken } = useNotification();
  const updatePushToken = useMutation(api.users.updatePushToken);
  const updateStreamToken = useMutation(api.users.updateStreamToken);
  const tokenProvider = React.useCallback(async () => {
    const values = JSON.stringify({
      ...person,
    });
    setIsUpdating(true);
    await AsyncStorage.setItem('person', JSON.stringify(person));
    await AsyncStorage.setItem('body', values);
    try {
      const { data } = await axios.post(
        `https://workcloud-web.vercel.app/token`,
        person
      );

      await updateStreamToken({ streamToken: data.token });
      await authClient.updateUser({
        streamToken: data.token,
      });
      return data.token;
    } catch (error) {
      console.error('error', error);
      throw new Error('Failed to update user data');
    } finally {
      setIsUpdating(false);
    }
  }, [person, updateStreamToken]);
  const isAuthenticated = !!session?.session && !!session?.user.streamToken;

  const isLoading = isPending || isUpdating;
  React.useEffect(() => {
    if (expoPushToken) {
      updatePushToken({ pushToken: expoPushToken });
    }
  }, [expoPushToken, updatePushToken]);
  React.useEffect(() => {
    if (isAuthenticated && person?.id && !user?.streamToken) {
      tokenProvider();
    }
  }, [isAuthenticated, tokenProvider, person?.id, user?.streamToken]);

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
