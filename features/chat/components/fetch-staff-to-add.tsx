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

export const FetchStaffToAdd = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<'conversations'> }>();
  const { id } = useGetUserId();
  const [loading, setLoading] = useState(false);
  const addStaffs = useMutation(api.conversation.addMembers);
  const router = useRouter();
  const { staffs: workers, clear } = useStaffStore();
  const staffs = useQuery(api.conversation.fetchWorkersThatAreNotInGroup, {
    groupId,
  });

  if (staffs === undefined) {
    return <LoadingComponent />;
  }

  const data = staffs?.map((item) => ({
    name: item.name!,
    image: item.image!,
    id: item._id!,
    role: item.role!,
    workspace: null,
  }));

  const onAdd = async () => {
    try {
      setLoading(true);
      await addStaffs({
        groupId,
        members: workers.map((w) => w.id),
      });
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
      <RenderStaffs data={data} />
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
