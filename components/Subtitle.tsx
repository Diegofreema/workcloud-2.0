import { StyleProp, TextStyle } from 'react-native';

import { MyText } from './Ui/MyText';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export const Subtitle = ({ children, style }: Props): JSX.Element => {
  return (
    <MyText
      poppins="Light"
      fontSize={15}
      style={[
        {
          marginTop: 10,
          fontFamily: 'PoppinsLight',
        },
        style,
      ]}
    >
      {children}
    </MyText>
  );
};
