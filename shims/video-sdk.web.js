// Web stub — @stream-io/video-react-native-sdk is not supported on web.
const noop = () => {};
const noopComponent = () => null;

export const StreamVideo = noopComponent;
export const StreamVideoClient = class {
  constructor() {}
  connectUser = noop;
  disconnectUser = noop;
  call = () => ({ join: noop, leave: noop, camera: {}, microphone: {} });
};
export const StreamCall = noopComponent;
export const useStreamVideoClient = () => null;
export const useCall = () => null;
export const useCallStateHooks = () => ({});
export const CallingState = {};
export const RingingCallContent = noopComponent;
export const IncomingCallContent = noopComponent;
export const OutgoingCallContent = noopComponent;
export const CallContent = noopComponent;
export default {};
