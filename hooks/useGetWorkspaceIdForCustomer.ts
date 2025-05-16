import { useEffect } from 'react';

import { useWaitlistId } from './useWaitlistId';

import { Id } from '~/convex/_generated/dataModel';

type Props = {
  isWorker: boolean;
  waitlistId: Id<'waitlists'> | undefined;
};

export const useGetWaitlistIdForCustomer = ({ isWorker, waitlistId }: Props) => {
  const { setId } = useWaitlistId();
  useEffect(() => {
    if (!isWorker && waitlistId) {
      setId(waitlistId, false);
    }
  }, [setId, waitlistId, isWorker]);
};
