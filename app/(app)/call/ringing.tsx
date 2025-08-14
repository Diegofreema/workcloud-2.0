import {
  NoiseCancellationProvider,
  RingingCallContent,
  StreamCall,
  useCalls,
} from '@stream-io/video-react-native-sdk';
import React from 'react';
import { CallComponent } from '~/features/calls/components/call-component';

const Ringing = () => {
  const calls = useCalls().filter((c) => c.ringing);
  const ringingCall = calls[0];

  if (!ringingCall) return null;
  return (
    <StreamCall call={ringingCall}>
      <NoiseCancellationProvider>
        <RingingCallContent CallContent={CallComponent} />
      </NoiseCancellationProvider>
    </StreamCall>
  );
};

export default Ringing;
