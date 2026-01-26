import { CustomerSession } from '@polar-sh/sdk/models/components/customersession.js';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Store = {
  customerSession: CustomerSession | null;
  setCustomerSession: (customerSession: CustomerSession) => void;
};
export const useCustomerSession = create<Store>()(
  persist(
    (set) => ({
      customerSession: null,
      setCustomerSession: (customerSession: CustomerSession) =>
        set({ customerSession }),
    }),
    {
      name: 'customer-session',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
