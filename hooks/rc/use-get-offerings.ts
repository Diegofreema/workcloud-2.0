import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';
import Purchases from 'react-native-purchases';
const isIos = Platform.OS === 'ios';
export const useGetOfferings = () => {
  return useQuery({
    queryKey: ['offerings'],
    queryFn: async () => {
      if (isIos) return null;
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          // Display packages for salers
          return offerings;
        }
        return null; // No offerings available
      } catch (e) {
        console.log('Error fetching offerings:', e);

        throw new Error('Failed to fetch offerings');
      }
    },
    refetchOnWindowFocus: true,
  });
};
