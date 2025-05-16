import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';

import { HeaderNav } from '~/components/HeaderNav';
import { Processors } from '~/components/Processors';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';

const ProcessorStaff = () => {
  const { orgId } = useLocalSearchParams<{ orgId: Id<'organizations'> }>();

  const organisation = useQuery(api.organisation.getOrganisationById, { organisationId: orgId });
  const processor = useQuery(api.worker.getProcessors, { organizationId: orgId });
  if (!organisation || !processor) {
    return <LoadingComponent />;
  }
  return (
    <Container>
      <HeaderNav title="Staff list" subTitle={organisation?.name} />
      <Processors processor={processor} />
    </Container>
  );
};
export default ProcessorStaff;
