import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { FetchStaffs } from "~/features/staff/components/fetch-staffs";
import { MyText } from "~/components/Ui/MyText";
import { useStaffStore } from "~/features/staff/store/staff-store";

const SelectStaff = () => {
  const { staffs } = useStaffStore();

  return (
    <Container>
      <HeaderNav
        title={"Select staffs"}
        rightComponent={
          <MyText poppins={"Medium"} fontSize={20}>
            {staffs.length}
          </MyText>
        }
      />
      <FetchStaffs />
    </Container>
  );
};
export default SelectStaff;
