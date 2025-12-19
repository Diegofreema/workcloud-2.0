/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ErrorBoundaryProps, Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
  CallMissedEvent,
  DeepPartial,
  StreamVideo,
  StreamVideoClient,
  Theme,
} from '@stream-io/video-react-native-sdk';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';

import { convexQuery } from '@convex-dev/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { useAudioPlayer } from 'expo-audio';
import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import CallProvider from '~/context/call-provider';
import { useNotification } from '~/context/notification-context';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { authClient } from '~/lib/auth-client';

type CallEvent = CallMissedEvent & {
  type: 'call.missed';
  received_at?: string | Date;
};
const audioSource = require('~/assets/sound.wav');
const apiKey = 'cnvc46pm8uq9';

if (Platform.OS === 'android') {
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
}
export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}
export default function AppLayout() {
  const { user } = useAuth();
  const player = useAudioPlayer(audioSource);

  const { expoPushToken } = useNotification();
  const convex = useConvex();
  const { data, isPending, isError } = useQuery(
    convexQuery(
      api.workspace.getWaitListCount,
      user?.workerId ? { workerId: user.workerId } : 'skip'
    )
  );

  const createMissedCall = useMutation(api.users.createMissedCallRecord);
  const person = {
    id: user?.id as string,
    name: user?.name,
    image: user?.image as string,
  };
  const tokenProvider = async () => {
    const values = JSON.stringify({
      ...person,
      email: user?.email,
    });
    await AsyncStorage.setItem('person', JSON.stringify(person));
    await AsyncStorage.setItem('body', values);
    try {
      const { data } = await axios.post(
        `https://workcloud-web.vercel.app/token`,
        {
          name: user?.name,
          email: user?.email,
          image: user?.image,
          id: user?.id,
        }
      );

      await authClient.updateUser({
        streamToken: data.token,
      });
      return data.token;
    } catch (error) {
      console.error('error', error);
      throw new Error('Failed to fetch user data');
    }
  };

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user: person,
    tokenProvider,
  });
  useEffect(() => {
    if (expoPushToken) {
      convex
        .mutation(api.pushNotification.recordPushNotificationToken, {
          token: expoPushToken,
        })

        .catch((error) => alert(error));
    }
  }, [convex, expoPushToken]);
  useEffect(() => {
    const onPlaySound = () => {
      player.seekTo(0);
      player.play();
    };
    if (!isError && !isPending && data > 0) {
      onPlaySound();
    }
  }, [data, isPending, isError, player]);
  //@ts-ignore
  const theme: DeepPartial<Theme> = {
    callControls: {
      container: {},
    },
    toggleVideoPreviewButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
      },
    },
    toggleCameraFaceButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    toggleAudioPreviewButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    toggleAudioPublishingButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    toggleVideoPublishingButton: {
      container: {
        backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
    hangupCallButton: {
      container: {
        // backgroundColor: colors.callButtonBlue,
        width: 60,
        height: 60,
      },
    },
  };
  useEffect(() => {
    client.on('call.missed', async (event: CallEvent) => {
      // Track here, e.g., save to state or DB
      await createMissedCall({
        callId: event.call.id,
        missedAt: Date.now(),
        userId: event.members[0].user_id as Id<'users'>,
      });
    });
  }, [client, createMissedCall]);

  return (
    <StreamVideo client={client} style={theme}>
      <CallProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Stack
            screenOptions={{ headerShown: false }}
            initialRouteName="(tabs)"
          >
            <Stack.Screen
              name="upload-review"
              options={{
                presentation: 'modal',
                headerShown: false,
              }}
            />
          </Stack>
        </GestureHandlerRootView>
      </CallProvider>
    </StreamVideo>
  );
}
