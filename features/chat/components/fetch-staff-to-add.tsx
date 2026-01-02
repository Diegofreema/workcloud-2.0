import { useLocalSearchParams, useRouter } from 'expo-router';
import { Id } from '~/convex/_generated/dataModel';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useMutation, useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { RenderStaffs } from '~/features/staff/components/render-staffs';
import { View } from 'react-native';
import { Button } from '~/features/common/components/Button';
import { useStaffStore } from '~/features/staff/store/staff-store';
import { useState } from 'react';
import { toast } from 'sonner-native';
import { generateErrorMessage } from '~/lib/helper';
import { useAppChatContext } from '~/components/providers/chat-context';

export const FetchStaffToAdd = () => {
  const [loading, setLoading] = useState(false);
  const { channel } = useAppChatContext();
  const router = useRouter();
  const { staffs: workers, clear } = useStaffStore();
  const data = useQuery(api.organisation.getStaffsByBossId);
  const members = Object.values(channel?.state.members || {});

  if (data === undefined) {
    return <LoadingComponent />;
  }
  console.log({ workers });

  const staffs = data
    ?.filter(
      (item) => !members.some((member) => member.user_id === item.user?.userId)
    )
    .map((item) => ({
      name: item.user?.name as string,
      image: item.user?.image as string,
      id: item.user?.userId as string,
      role: item.role!,
      workspace: null,
    }));

  const onAdd = async () => {
    try {
      setLoading(true);
      await Promise.all(
        workers.map(async (item) => {
          await channel?.addMembers([item.id], {
            text: `Admin added ${item.name.split(' ')[0]}`,
          });
        })
      );
      toast.success('Staffs added to group');
      clear();
      router.back();
    } catch (e) {
      const errorMessage = generateErrorMessage(e, 'Failed to add staffs');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const disable = workers.length === 0 || loading;
  return (
    <View style={{ flex: 1 }}>
      <RenderStaffs data={staffs} />
      <Button
        title={'Add to group'}
        onPress={onAdd}
        style={{ marginTop: 'auto' }}
        disabled={disable}
        loading={loading}
        loadingTitle={'Adding...'}
      />
    </View>
  );
};
