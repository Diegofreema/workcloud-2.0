import { useEffect, useMemo, useState } from 'react';
import { AscDesc, Channel } from 'stream-chat';
import { useChatContext } from 'stream-chat-expo';

import { filterChannels as filterChannelsFn } from '~/lib/helper';

const sort = { last_updated: -1 as AscDesc };

export const useFilterChannel = (id: string, query: string) => {
  console.log(id, 'hook');
  const filters = useMemo(
    () => ({
      members: { $in: [id!] },
      type: 'messaging',
    }),
    [id]
  );
  const memoizedFilters = useMemo(() => filters, [filters]);

  const [filterChannels, setFilterChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const { client } = useChatContext();
  useEffect(() => {
    if (id) {
      const fetchChannels = async () => {
        try {
          const result = await client.queryChannels(memoizedFilters, sort, {
            state: true,
            watch: true,
          });

          const channelsQueried = await filterChannelsFn(result, query);

          setFilterChannels(channelsQueried);
        } catch (e) {
          console.log(e);
        } finally {
          setLoading(false);
        }
      };
      // eslint-disable-next-line no-void
      void fetchChannels();
    }
  }, [id, query, client, memoizedFilters]);

  return { filterChannels, loading };
};
