import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

type Props = {
  id: Id<'organizations'>;
  from: Id<'users'> | undefined;
  isBoss: boolean;
  isWorker: boolean;
};

export const useHandleConnection = ({ id, from, isBoss, isWorker }: Props) => {
  const handleConnection = useMutation(api.connection.handleConnection);
  useEffect(() => {
    if (!id || !from || isBoss || isWorker) return;

    const onConnect = async () => {
      try {
        await handleConnection({
          connectedAt: format(Date.now(), 'dd/MM/yyyy, HH:mm:ss'),
          from,
          to: id,
        });
      } catch (e) {
        console.error('Connection error:', e);
      }
    };

    onConnect().catch(console.log);
  }, [id, isBoss, isWorker, from, handleConnection]);
};
