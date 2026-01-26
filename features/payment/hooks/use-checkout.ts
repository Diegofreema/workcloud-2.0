import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as WebBrowser from 'expo-web-browser';
import { toast } from 'sonner-native';
import { useAuth } from '~/context/auth';
import { checkout, createSession } from '../api';

export const useCheckout = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: ({ productId }: { productId: string }) =>
      checkout({ productId, userId: user?.id as string }),
    onSuccess: async (data) => {
      await WebBrowser.openBrowserAsync(data.url);
      queryClient.invalidateQueries({
        queryKey: ['customer', user?.id],
      });
      // Call createSession after successful checkout
      await createSession(user?.id as string);
    },
    onError: (error: any) => {
      console.log(JSON.stringify(error, null, 2));

      const errorMessage =
        error?.message ||
        error?.error?.message ||
        error?.toString() ||
        'Failed to subscribe';

      toast.error('Error', {
        description: errorMessage,
      });
    },
  });
};
