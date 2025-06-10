import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { NewGroupForm } from "~/features/chat/components/new-group-form";

const NewGroup = () => {
  return (
    <Container>
      <HeaderNav title={"New group"} />
      <NewGroupForm />
    </Container>
  );
};
export default NewGroup;
