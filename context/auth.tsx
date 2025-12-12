import * as React from 'react';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { authClient } from '~/lib/auth-client';
import { useNotification } from './notification-context';
import { Id } from '~/convex/_generated/dataModel';

type User = {
  createdAt: Date;
  date_of_birth?: string | null;
  email: string;
  emailVerified: boolean;
  id: string;
  image: string | null;
  isOnline?: boolean | null;
  lastSeen?: string | null;
  name: string;
  organizationId?: Id<'organizations'> | null;
  pushToken?: string | null;
  storageId?: Id<'_storage'> | null;
  streamToken?: string | null;
  updatedAt: Date;
  workerId?: Id<'workers'> | null;
};
const AuthContext = React.createContext({
  user: undefined as User | undefined,
  isAuthenticated: false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, isPending } = authClient.useSession();

  const { expoPushToken } = useNotification();

  const isAuthenticated = !!session?.user;
  const user = session?.user;
  console.log({ user });

  React.useEffect(() => {
    if (expoPushToken && !user?.pushToken) {
      const onUpdate = async () => {
        await authClient.updateUser({
          pushToken: expoPushToken,
        });
      };
      void onUpdate();
    }
  }, [expoPushToken, user]);
  if (isPending) {
    return <LoadingComponent />;
  }
  return (
    <AuthContext.Provider
      value={{
        user: user as User,
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
