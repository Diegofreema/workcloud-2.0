// import { useRouter } from 'expo-router';
// import React, { useMemo } from 'react';
// import { AscDesc, Channel } from 'stream-chat';
// import { ChannelList } from 'stream-chat-expo';

// import { EmptyChat } from '~/components/EmptyChat';
// import { SearchHeader } from '~/components/SearchHeader';
// import { Container } from '~/components/Ui/Container';
// import { LoadingComponent } from '~/components/Ui/LoadingComponent';
// import { useGetUserId } from '~/hooks/useGetUserId';

// const sort = { last_updated: -1 as AscDesc };
// const options = {
//   state: true,
//   watch: true,
// };

// const Messages = () => {
//   const { id, isLoading } = useGetUserId();

//   const filters = useMemo(
//     () => ({
//       members: { $in: [id!] },
//       type: 'messaging',
//     }),
//     [id]
//   );
//   const memoizedFilters = useMemo(() => filters, [filters]);
//   const router = useRouter();

//   const onPress = (channel: Channel) => {
//     router.push(`/channel/${channel.cid}`);
//   };
//   if (isLoading) return <LoadingComponent />;

//   return (
//     <Container>
//       <SearchHeader
//         placeholder="Search by name"
//         search={false}
//         onPress={() => router.push(`/searchChannel?id=${id}`)}
//       />

//       <ChannelList
//         filters={memoizedFilters}
//         options={options}
//         sort={sort}
//         onSelect={onPress}
//         EmptyStateIndicator={EmptyChat}
//         numberOfSkeletons={10}
//         loadMoreThreshold={0.1}
//       />
//     </Container>
//   );
// };

// export default Messages;
