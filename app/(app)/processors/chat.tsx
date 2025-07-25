import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { FetchProcessorConversations } from "~/features/processor/components/fetch-processor-converstions";

const ProcessorChatScreen = () => {
  return (
    <Container>
      <HeaderNav title={"Processors"} />
      <FetchProcessorConversations />
    </Container>
  );
};

export default ProcessorChatScreen;
