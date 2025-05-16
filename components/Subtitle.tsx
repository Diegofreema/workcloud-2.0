import { StyleProp, TextStyle } from 'react-native';

import { colors } from '../constants/Colors';
import { useDarkMode } from '../hooks/useDarkMode';
import { MyText } from './Ui/MyText';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
};

export const Subtitle = ({ children, style }: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <MyText
      poppins="Light"
      fontSize={15}
      style={[
        {
          color: darkMode === 'dark' ? 'white' : colors.textGray,
          marginTop: 10,
          fontFamily: 'PoppinsLight',
        },
        style,
      ]}>
      {children}
    </MyText>
  );
};
