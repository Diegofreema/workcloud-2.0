import { useMutation } from 'convex/react';
import { useEffect } from 'react';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

export const useUpdateStarred = ({
  isProcessor,
  isSeen,
  id,
}: {
  isProcessor: boolean;
  isSeen: boolean;
  id: Id<'stars'>;
}) => {
  const updateSeenArray = useMutation(api.worker.updateSeenStarred);
  useEffect(() => {
    if (isProcessor && !isSeen) {
      const onUpdate = async () => {
        await updateSeenArray({ id });
      };
      void onUpdate();
    }
  }, [isProcessor, updateSeenArray, id, isSeen]);
};
