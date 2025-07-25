// import { useEffect, useState } from 'react';
// // import { Channel, ChannelMemberResponse, DefaultGenerics } from 'stream-chat';

// import { Id } from '~/convex/_generated/dataModel';

// export const useFetchMember = (channel: Channel | null, id: Id<'users'>) => {
//   const [otherUsers, setOtherUsers] = useState<ChannelMemberResponse<DefaultGenerics>[]>([]);
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     if (channel && id) {
//       const fetchMembers = async () => {
//         try {
//           const data = await channel.queryMembers({});

//           const users = data.members.filter((i) => i?.user_id !== id);
//           setOtherUsers(users);
//         } catch (e) {
//           console.log(e);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchMembers();
//     }
//   }, [channel, id]);
//   return { loading, otherUsers };
// };
