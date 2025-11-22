import {api} from "~/convex/_generated/api";
import {useQuery} from "convex/react";


export const useGetCustomerInfo = () => {
  const subscriptionData = useQuery(api.users.getSubscriptions);

  const isPro = !!subscriptionData?.isPremium;

  const subscription = subscriptionData?.subscription;
  return {
    loading: subscriptionData === undefined,
    isPro,
    subscription,
  };
};
