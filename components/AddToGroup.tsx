//

// import { useAuth } from '@clerk/clerk-expo';
// import { router, useLocalSearchParams } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { FlatList, View } from 'react-native';
// import { toast } from 'sonner-native';

// import { AuthHeader } from './AuthHeader';
// import { EmptyText } from './EmptyText';
// import { ErrorComponent } from './Ui/ErrorComponent';
// import { LoadingComponent } from './Ui/LoadingComponent';
// import { UserPreviewWithBio } from './Ui/UserPreviewWithBio';

// import { ChatMember, useMembers } from '~/hooks/useMembers';
// import { useGetMyStaffs } from '~/lib/queries';

// export const AddToGroup = (): JSX.Element => {
//   const { userId } = useAuth();
//   const { chatId } = useLocalSearchParams<{ chatId: string }>();
//   const [channel, _] = useState<ChannelType | null>(null);
//   const getMembers = useMembers((state) => state.getMembers);

//   useEffect(() => {
//     const fetchChannel = async () => {};
//     fetchChannel();
//   }, [chatId]);

//   const { data, isPending, isError, refetch, isRefetching, isRefetchError } =
//     useGetMyStaffs(userId);
//   const members = useMembers((state) => state.members);
//   if (isError || isRefetchError) {
//     return <ErrorComponent refetch={refetch} />;
//   }

//   if (isPending) {
//     return <LoadingComponent />;
//   }

//   const membersToDisplay = data.staffs.filter(
//     (staff) => !members.some((member) => member.user?.id === staff?.userId)
//   );
//   console.log(membersToDisplay.length);

//   const onAddMember = async (id: string) => {
//     if (!channel) return;
//     try {
//       const newMb = await channel?.addMembers([id]);
//       const newMembers = await channel.queryMembers({});
//       const formattedMembers = Object.values(newMembers);

//       if (newMembers) {
//         getMembers(formattedMembers[0] as ChatMember[]);
//       }
//       if (newMb) {
//         router.back();
//         toast.success('Success', {
//           description: 'Member added successfully',
//         });
//       }
//     } catch (error) {
//       console.log(error);

//       toast.error('Something went wrong', {
//         description: 'Failed to add member',
//       });
//     }
//   };
//   return (
//     <View>
//       <AuthHeader path="Select a staff" />
//       <FlatList
//         showsVerticalScrollIndicator={false}
//         ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
//         onRefresh={refetch}
//         refreshing={isRefetching}
//         data={membersToDisplay}
//         renderItem={({ item }) => (
//           <UserPreviewWithBio
//             id={item?.userId!}
//             imageUrl={item?.user?.imageUrl!}
//             name={item?.user?.name!}
//             bio={item.experience!}
//             skills={item.skills!}
//             onPress={() => onAddMember(item?.userId!)}
//           />
//         )}
//         ListEmptyComponent={() => <EmptyText text="No staffs to add" />}
//       />
//     </View>
//   );
// };
