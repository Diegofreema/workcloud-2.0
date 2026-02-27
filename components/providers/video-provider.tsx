import {
  CallMissedEvent,
  StreamVideo,
  StreamVideoClient,
} from '@stream-io/video-react-native-sdk';
import { useMutation } from 'convex/react';
import React, { PropsWithChildren, useCallback, useEffect } from 'react';
import { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import CallProvider from '~/context/call-provider';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { tokenProvider } from '~/lib/utils';
import { streamApiKey } from '~/utils/constants';

type CallEvent = CallMissedEvent & {
  type: 'call.missed';
  received_at?: string | Date;
};
export const VideoProvider = ({ children }: PropsWithChildren) => {
  const { user } = useAuth();
  const person = {
    id: user?.id,
    name: user?.name,
    image: user?.image as string,
  };

  const createMissedCall = useMutation(api.users.createMissedCallRecord);
  const tokenProviderCallBack = useCallback(() => {
    return tokenProvider({
      email: user?.email,
      ...person,
    });
  }, [user.email, person]);

  const client = StreamVideoClient.getOrCreateInstance({
    apiKey: streamApiKey as string,
    user: person,
    tokenProvider: tokenProviderCallBack,
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
