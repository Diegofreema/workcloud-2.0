import {MyText} from "~/components/Ui/MyText";
import {RFPercentage} from "react-native-responsive-fontsize";

type Props = {
    title: string;
}

export const Title = ({ title }: Props) => {
  return (
    <MyText poppins={"Bold"} fontSize={RFPercentage(3)}>
      {title}
    </MyText>
  );
};