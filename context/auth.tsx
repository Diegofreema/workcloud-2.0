import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';

import { useMutation, useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { Doc } from '~/convex/_generated/dataModel';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { useNotification } from './notification-context';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = React.createContext({
  user: null as Doc<'users'> | null | undefined,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const user = useQuery(api.users.getUser, {});
  console.log({ image: user?.image });

  const { expoPushToken } = useNotification();
  const updatePushToken = useMutation(api.users.updatePushToken);
  const isAuthenticated = !!user;
  const isLoading = user === undefined;
  React.useEffect(() => {
    if (expoPushToken) {
      updatePushToken({ pushToken: expoPushToken });
    }
  }, [expoPushToken, updatePushToken]);
  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <AuthContext.Provider
      value={{
        user,
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
