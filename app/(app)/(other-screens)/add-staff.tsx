import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { FetchStaffToAdd } from "~/features/chat/components/fetch-staff-to-add";

const AddStaffScreen = () => {
  return (
    <Container>
      <HeaderNav title={"Add staff"} />
      <FetchStaffToAdd />
    </Container>
  );
};
export default AddStaffScreen;
