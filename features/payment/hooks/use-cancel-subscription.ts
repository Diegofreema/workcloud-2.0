import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelSubscription } from '../api';
import { toast } from 'sonner-native';

export const useCancelSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      cancelSubscription(id, token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      toast.success('Subscription cancelled successfully');
    },
    onError: (error: any) => {
      console.log(JSON.stringify(error, null, 2));

      // Extract the actual error message string
      const errorMessage =
        error?.message ||
        error?.error?.message ||
        error?.toString() ||
        'An unexpected error occurred';

      toast.error('Something went wrong', {
        description: errorMessage,
      });
    },
  });
};
