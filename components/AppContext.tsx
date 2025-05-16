import React, { PropsWithChildren, useState } from 'react';
import { Channel } from 'stream-chat';

type AppContextProps = {
  channel: Channel | null;
  setChannel: (channel: Channel) => void;
};
export const AppContext = React.createContext<AppContextProps>({
  channel: null,
  setChannel: (channel: Channel) => {},
});

export const AppProvider = ({ children }: PropsWithChildren) => {
  const [channel, setChannel] = useState<Channel | null>(null);

  return <AppContext.Provider value={{ channel, setChannel }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => React.useContext(AppContext);
