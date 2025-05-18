// import React, {
//   PropsWithChildren,
//   useCallback,
//   useEffect,
//   useMemo,
//   useState,
// } from 'react';
// import { StreamChat } from 'stream-chat';
// import { Chat, OverlayProvider } from 'stream-chat-expo';

// import { LoadingComponent } from '~/components/Ui/LoadingComponent';
// import { useGetUserId } from '~/hooks/useGetUserId';
// import { useUnread } from '~/hooks/useUnread';

// const client = StreamChat.getInstance(process.env.EXPO_PUBLIC_STREAM_API_KEY!);
// export const ChatWrapper = ({ children }: PropsWithChildren) => {
//   const { user, id, isLoading } = useGetUserId();
//   const [isReady, setIsReady] = useState(false);
//   const { getUnread } = useUnread();
//   const userData = useMemo(
//     () => ({
//       id,
//       name: user?.name,
//       image: user?.image,
//       streamToken: user?.streamToken,
//     }),
//     [id, user?.name, user?.image, user?.streamToken]
//   );

//   // Memoize getUnread to prevent effect re-runs
//   const memoizedGetUnread = useCallback(
//     (initialCount: number) => {
//       getUnread(initialCount);
//     },
//     [getUnread]
//   );

//   // Connect to chat service
//   const connectUser = useCallback(async () => {
//     if (
//       !userData.id ||
//       !userData.name ||
//       !userData.image ||
//       !userData.streamToken
//     ) {
//       return;
//     }

//     await client.connectUser(
//       {
//         id: userData.id,
//         name: userData.name,
//         image: userData.image,
//       },
//       userData.streamToken
//     );
//     memoizedGetUnread(0);
//     setIsReady(true);
//   }, [userData, memoizedGetUnread]);

//   useEffect((): (() => void) => {
//     connectUser();

//     // Cleanup function
//     return () => {
//       let isMounted = true;

//       const disconnect = async () => {
//         if (isReady && isMounted) {
//           try {
//             await client.disconnectUser();
//             if (isMounted) {
//               setIsReady(false);
//             }
//           } catch (err) {
//             console.error('Disconnect error:', err);
//           }
//         }
//       };

//       disconnect();

//       return () => {
//         isMounted = false;
//       };
//     };
//   }, [connectUser, isReady]);

//   if (isLoading || !isReady) {
//     return <LoadingComponent />;
//   }

//   return (
//     <OverlayProvider>
//       <Chat client={client}>{children}</Chat>
//     </OverlayProvider>
//   );
// };
