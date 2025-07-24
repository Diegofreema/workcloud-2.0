import { useQuery } from 'convex/react';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { RenderProcessors } from '~/features/processor/components/render-processors';

export const FetchProcessors = () => {
  const { user } = useAuth();
  const processors = useQuery(
    api.processors.getProcessorThroughUser,
    user
      ? {
          userId: user?._id,
        }
      : 'skip'
  );

  if (processors === undefined) {
    return <LoadingComponent />;
  }

  const formattedData = processors.map((item) => ({
    name: item?.name!,
    image: item?.image!,
    id: item?._id!,
    role: item?.role!,
    workspace: null,
  }));
  return <RenderProcessors data={formattedData} />;
};
