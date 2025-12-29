import { View, Text } from 'react-native';
import React, { PropsWithChildren, useEffect } from 'react';
import { useAuth } from '~/context/auth';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMutation } from 'convex/react';
import { colors } from '~/constants/Colors';
import { Id } from '~/convex/_generated/dataModel';
import {
  CallMissedEvent,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import CallProvider from '~/context/call-provider';
import { api } from '~/convex/_generated/api';

const apiKey = 'cnvc46pm8uq9';
type CallEvent = CallMissedEvent & {
  type: 'call.missed';
  received_at?: string | Date;
};
export const VideoProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const person = {
    id: user?._id!,
    name: user?.name,
    image: user?.image!,
  };

  const createMissedCall = useMutation(api.users.createMissedCallRecord);

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey,
    user: person,
    token: user?.streamToken as string,
  });

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
      <CallProvider>{children}</CallProvider>
    </StreamVideo>
  );
};
