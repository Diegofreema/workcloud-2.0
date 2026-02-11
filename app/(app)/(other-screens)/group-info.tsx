import { Container } from '~/components/Ui/Container';
import { HeaderNav } from '~/components/HeaderNav';
import { GroupInfo } from '~/features/chat/components/group-info';
import { ChatWrapper } from '~/components/providers/ChatWrapper';

const GroupInfoScreen = () => {
  return (
    <ChatWrapper>
      <Container>
        <HeaderNav title={'Group Info'} />
        <GroupInfo />
      </Container>
    </ChatWrapper>
  );
};
export default GroupInfoScreen;
