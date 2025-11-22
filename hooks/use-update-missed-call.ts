import { useMutation } from 'convex/react';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';

export const useUpdateMissedCall = () => {
  const updateMissedCall = useMutation(api.users.markMissedCallsAsSeen);
  const { user } = useAuth();
  const userId = user?._id;
  useFocusEffect(
    useCallback(() => {
      if (!userId) return;
      const updateCalls = async () => {
        try {
          await updateMissedCall({ userId });
          console.log('Called');
        } catch (error) {
          console.log(error);
        }
      };
      updateCalls();
    }, [updateMissedCall, userId])
  );
};
