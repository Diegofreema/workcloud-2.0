import { MyText } from "~/components/Ui/MyText";
import { RFPercentage } from "react-native-responsive-fontsize";

type Props = {
  title: string;
  fontSize?: number;
};

export const Title = ({ title, fontSize = 3 }: Props) => {
  return (
    <MyText poppins={"Bold"} fontSize={RFPercentage(fontSize)}>
      {title}
    </MyText>
  );
};
