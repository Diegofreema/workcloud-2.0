import {Container} from "~/components/Ui/Container";
import {ChatComponent} from "~/features/chat/components/chat.component";
import {TabsHeader} from "~/features/common/components/tabs-header";
import {Title} from "~/features/common/components/title";

const MessageScreen = () => {
  return (
    <Container>
      <TabsHeader leftContent={<Title title={"Messages"} />} />
      <ChatComponent />
    </Container>
  );
};

export default MessageScreen;
