import { useConvex } from 'convex/react';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { registerForPushNotificationsAsync } from '~/utils/registerPushNotification';

interface NotificationContextType {
  expoPushToken: string | undefined;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');

  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const convex = useConvex();
  const router = useRouter();
  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => {
        setExpoPushToken(token);
      },
      (error) => setError(error)
    );
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data.type === 'single') {
          router.push(`/chat/${data.conversationId}?type=single`);
        }
        if (data.type === 'group') {
          router.push(`/chat/group/${data.conversationId}`);
        }
        if (data.type === 'processor') {
          router.push(`/chat/${data.conversationId}?type=single`);
        }
        if (data.type === 'notification') {
          router.push('/notification');
        }
        if (data.type === 'review') {
          router.push(
            `/orgs/reviews/review?reviewId=${data.reviewId}&owner=true&orgId=${data.orgId}`
          );
        }
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, [router, convex]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
