import { useMutation, useQuery } from 'convex/react';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { toast } from 'sonner-native';
import { CustomModal } from '~/components/Dialogs/CustomModal';
import { UserPreview } from '~/components/Ui/UserPreview';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Button } from '~/features/common/components/Button';
import { SmallLoader } from '~/features/common/components/small-loader';
import { generateErrorMessage } from '~/lib/helper';

export const FetchProcessorDetails = () => {
  const { id } = useLocalSearchParams<{ id: Id<'workers'> }>();
  const [open, setIsOpen] = useState(false);
  const [isResigning, setIsResigning] = useState(false);
  const profileData = useQuery(api.processors.getProcessorDetail, { id });
  const resign = useMutation(api.worker.resignFromOrganization);
  if (profileData === undefined) return <SmallLoader />;
  const handleResign = async () => {
    if (!profileData || !profileData.workerId) return;
    setIsResigning(true);

    try {
      await resign({
        workerId: profileData.workerId,
      });
      toast.success('Resigned successfully');
      router.replace('/');
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Something went wrong');
      toast.error('Something went wrong', {
        description: errorMessage,
      });
    } finally {
      setIsResigning(false);
    }
  };
  return (
    <>
      <CustomModal
        title="Are you sure you want to resign from this organization?"
        btnText="Resign"
        onPress={handleResign}
        isOpen={open}
        onClose={() => setIsOpen(false)}
        isLoading={isResigning}
      />
      <View style={styles.container}>
        <UserPreview
          name={profileData?.name!}
          roleText={'Processor'}
          imageUrl={profileData?.image!}
          size={80}
        />
        <Button
          title="Resign"
          onPress={() => setIsOpen(true)}
          disabled={isResigning}
          style={{ backgroundColor: colors.closeTextColor }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: colors.gray,
    borderBottomWidth: 1,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
