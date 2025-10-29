import { MyText } from '~/components/Ui/MyText';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { StyleProp, TextStyle } from 'react-native';

type Props = {
  title: string;
  fontSize?: number;
  styles?: StyleProp<TextStyle>;
};

export const Title = ({ title, fontSize = 2, styles }: Props) => {
  return (
    <MyText poppins={'Bold'} fontSize={RFPercentage(fontSize)} style={styles}>
      {title}
    </MyText>
  );
};
