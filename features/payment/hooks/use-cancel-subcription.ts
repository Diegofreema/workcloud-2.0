import { useMutation } from '@tanstack/react-query';

export const useCancelSubscription = () => {
  return useMutation({
    mutationFn: async () => {},
    onSuccess: () => {},
    onError: () => {},
  });
};
