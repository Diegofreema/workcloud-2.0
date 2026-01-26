import { useEffect } from 'react';
import { useAuth } from '~/context/auth';
import { createSession } from '../api';
import { useCustomerSession } from './use-customer-session';

export const useGetSession = () => {
  const { user } = useAuth();
  const setCustomerSession = useCustomerSession(
    (state) => state.setCustomerSession,
  );
  useEffect(() => {
    if (user?.id) {
      const getSession = async () => {
        const customerSession = await createSession(user.id);

        setCustomerSession(customerSession.session);
      };
      getSession();
    }
  }, [user?.id, setCustomerSession]);
};
