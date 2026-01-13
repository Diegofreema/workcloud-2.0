import { useQuery } from 'convex/react';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { RenderProcessors } from '~/features/processor/components/render-processors';

export const FetchProcessors = () => {
  const processors = useQuery(api.processors.getProcessorThroughUser);

  if (processors === undefined) {
    return <LoadingComponent />;
  }

  const formattedData = processors.map((item) => ({
    name: item?.name as string,
    image: item?.image as string,
    id: item?.userId!,
    role: item?.role as string,
    workspace: null,
  }));
  return <RenderProcessors data={formattedData} />;
};
