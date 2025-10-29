import { Container } from '~/components/Ui/Container';
import { TabsHeader } from '~/features/common/components/tabs-header';
import { Title } from '~/features/common/components/title';
import { FetchCalls } from '~/features/calls/components/fetch-calls';
import { useUpdateMissedCall } from '~/hooks/use-update-missed-call';

const CallScreen = () => {
  useUpdateMissedCall();
  return (
    <Container>
      <TabsHeader leftContent={<Title title={'Call logs'} />} />
      <FetchCalls />
    </Container>
  );
};

export default CallScreen;
