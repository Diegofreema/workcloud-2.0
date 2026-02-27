import { Container } from '~/components/Ui/Container';
import { HeaderNav } from '~/components/HeaderNav';
import { GroupInfo } from '~/features/chat/components/group-info';

const GroupInfoScreen = () => {
  return (
    <Container>
      <HeaderNav title={'Group Info'} />
      <GroupInfo />
    </Container>
  );
};
export default GroupInfoScreen;
