// Web stub — stream-chat-expo is not supported on web.
const noop = () => {};
const noopComponent = () => null;

export const Chat = noopComponent;
export const Channel = noopComponent;
export const ChannelList = noopComponent;
export const MessageList = noopComponent;
export const MessageInput = noopComponent;
export const OverlayProvider = noopComponent;
export const StreamChat = class {
  constructor() {}
  static getInstance = () => new this();
  connectUser = noop;
  disconnectUser = noop;
  queryChannels = async () => [];
};
export const useChatContext = () => ({});
export const useChannelContext = () => ({});
export const useMessagesContext = () => ({});
export const useMessageContext = () => ({});
export default {};
