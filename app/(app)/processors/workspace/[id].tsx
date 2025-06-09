import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { FetchProcessorDetails } from "~/features/processor/components/fetch-processor-details";
import { FetchMessages } from "~/features/processor/components/fetch-messages";

const ProcessorWorkspace = () => {
  return (
    <Container>
      <HeaderNav title={"Processor workspace"} />
      <FetchProcessorDetails />
      <FetchMessages />
    </Container>
  );
};
export default ProcessorWorkspace;
