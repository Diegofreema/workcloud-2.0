import React from "react";
import { HeaderNav } from "~/components/HeaderNav";
import { Container } from "~/components/Ui/Container";
import { FetchProcessors } from "~/features/processor/components/fetch-processors";

const Processors = () => {
  return (
    <Container>
      <HeaderNav title="Processors" />
      <FetchProcessors />
    </Container>
  );
};
export default Processors;
