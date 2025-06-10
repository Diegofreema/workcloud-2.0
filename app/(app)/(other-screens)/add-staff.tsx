import {useLocalSearchParams} from "expo-router";
import {Id} from "~/convex/_generated/dataModel";
import {Container} from "~/components/Ui/Container";
import {HeaderNav} from "~/components/HeaderNav";


const AddStaffScreen = () => {
  const { groupId } = useLocalSearchParams<{ groupId: Id<"conversations"> }>();
  return (
    <Container>
     <HeaderNav title={'Add staff'} />
    </Container>
  );
};
export default AddStaffScreen;
