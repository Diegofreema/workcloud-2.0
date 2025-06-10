import { CustomPressable } from "~/components/Ui/CustomPressable";
import { MyText } from "~/components/Ui/MyText";
import { ProcessorType } from "~/features/staff/type";
import { useStaffStore } from "~/features/staff/store/staff-store";
import { colors } from "~/constants/Colors";

type Props = {
  staff: ProcessorType;
};
export const AddStaffButton = ({ staff }: Props) => {
  const staffs = useStaffStore((state) => state.staffs);
  const setStaffs = useStaffStore((state) => state.setStaffs);
  const onPress = () => {
    setStaffs(staff);
  };

  const isInStore = staffs.some((item) => item.id === staff.id);
  const text = isInStore ? "Remove" : "Add";
  return (
    <CustomPressable onPress={onPress}>
      <MyText
        poppins={"Medium"}
        style={{ color: isInStore ? colors.closeTextColor : colors.dialPad }}
      >
        {text} Staff
      </MyText>
    </CustomPressable>
  );
};
