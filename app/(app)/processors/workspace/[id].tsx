import { Container } from '~/components/Ui/Container';
import { HeaderNav } from '~/components/HeaderNav';
import { FetchProcessorDetails } from '~/features/processor/components/fetch-processor-details';
import { FetchMessages } from '~/features/processor/components/fetch-messages';
import { WorkerButton } from '../../wk/[id]';
import { Id } from '~/convex/_generated/dataModel';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';

const ProcessorWorkspace = () => {
  const { id } = useLocalSearchParams<{ id: Id<'workers'> }>();
  const profileData = useQuery(api.processors.getProcessorDetail, { id });

  if (profileData === undefined) return <LoadingComponent />;

  return (
    <Container>
      <HeaderNav
        title={'Processor workspace'}
        rightComponent={
          <WorkerButton
            workspaceId={profileData?.workspaceId as Id<'workspaces'>}
            isProcessor
          />
        }
      />
      <FetchProcessorDetails profileData={profileData} />
      <FetchMessages />
    </Container>
  );
};
export default ProcessorWorkspace;
