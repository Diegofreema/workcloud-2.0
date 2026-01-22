import { useMutation } from 'convex/react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';

export const useUpdateMissedCall = () => {
  const updateMissedCall = useMutation(api.users.markMissedCallsAsSeen);

  useFocusEffect(
    useCallback(() => {
      const updateCalls = async () => {
        try {
          await updateMissedCall();
        } catch (error) {
          console.log(error);
        }
      };
      updateCalls();
    }, [updateMissedCall]),
  );
};
