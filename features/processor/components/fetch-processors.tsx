import { useGetUserId } from '~/hooks/useGetUserId';
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { RenderProcessors } from '~/features/processor/components/render-processors';

export const FetchProcessors = () => {
  const { id } = useGetUserId();
  const processors = useQuery(api.processors.getProcessorThroughUser, {
    userId: id,
  });

  if (processors === undefined) {
    return <LoadingComponent />;
  }

  const formattedData = processors.map((item) => ({
    name: item?.name!,
    image: item?.imageUrl!,
    id: item?._id!,
    role: item?.role!,
    workspace: null,
  }));
  return <RenderProcessors data={formattedData} />;
};
