import { useQuery } from '@tanstack/react-query';
import axios, { isAxiosError } from 'axios';
import { useAuth } from '~/context/auth';
import { handleRetry } from '~/lib/helper';
import { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js';
import { baseUrl } from '~/utils/constants';
import { Subscription } from '@polar-sh/sdk/models/components/subscription.js';

export const useGetCustomer = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['customer', user?.id],
    queryFn: () => getCustomer(user?.id as string),
    enabled: !!user?.id,
    retry: handleRetry,
  });
};

const getCustomer = async (userId: string) => {
  try {
    const { data } = await axios.get<{
      customer: CustomerState;
      subscription: Subscription;
    }>(`${baseUrl}/customer?userId=${userId}`);
    return data;
  } catch (error) {
    if (isAxiosError(error)) {
      const message = error.response?.data.message || 'Something went wrong';
      console.log(message);

      throw new Error(message);
    } else {
      throw new Error('Something went wrong');
    }
  }
};
