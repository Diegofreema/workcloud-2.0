import { CustomerState } from '@polar-sh/sdk/models/components/customerstate.js';
import { Subscription } from '@polar-sh/sdk/models/components/subscription.js';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useAuth } from '~/context/auth';
import { baseUrl } from '~/utils/constants';

export const useGetCustomer = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['customer', user?.id],
    queryFn: () => getCustomer(user?.id as string),
    enabled: !!user?.id,
  });
};

const getCustomer = async (userId: string) => {
  try {
    const { data } = await axios.get<{
      customer: CustomerState;
      subscription: Subscription;
    }>(`${baseUrl}/customer/get-customer?userId=${userId}`);
    return data;
  } catch (error) {
    return {
      customer: {} as CustomerState,
      subscription: {} as Subscription,
    };
  }
};
