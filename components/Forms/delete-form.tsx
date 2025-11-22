import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';
import { toast } from 'sonner-native';
import { z } from 'zod';
import { api } from '~/convex/_generated/api';
import { Button } from '~/features/common/components/Button';
import { generateErrorMessage } from '~/lib/helper';
import { CustomInput } from '../InputComponent';

import { useState } from 'react';
import { CustomModal } from '../Dialogs/CustomModal';

const schema = z.object({
  reason: z.string().min(1, 'Reason is required'),
  feedback: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export const DeleteForm = (): JSX.Element => {
  const deleteRequest = useMutation(api.deleteRequests.createDeletionRequest);
  const [isOpen, setIsOpen] = useState(false);
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      feedback: '',
      reason: '',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await deleteRequest(data);
      toast.success('Success', {
        description: 'Your request has been submitted',
      });
    } catch (error) {
      const errorMessage = generateErrorMessage(error, 'Something went wrong');
      toast.error('An error occurred', {
        description: errorMessage,
      });
    }
  };
  return (
    <View style={{ gap: 16 }}>
      <CustomModal
        title="Request to Delete Account"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onPress={handleSubmit(onSubmit)}
        btnText="Submit"
        cancelText="Cancel"
        actionBtnColor="red"
        isLoading={isSubmitting}
      />

      <CustomInput
        control={control}
        errors={errors}
        name="reason"
        placeholder="Why do you want to delete your account"
        label="Reason"
        numberOfLines={5}
        multiline
        textarea
      />
      <CustomInput
        control={control}
        errors={errors}
        name="feedback"
        placeholder="Please let us know how we can improve"
        label="Feedback (Optional)"
        numberOfLines={5}
        multiline
        textarea
      />
      <Button
        title={'Submit'}
        onPress={() => setIsOpen(true)}
        loadingTitle={'Submitting...'}
        loading={isSubmitting}
        disabled={isSubmitting}
        style={{ backgroundColor: 'red' }}
      />
    </View>
  );
};
