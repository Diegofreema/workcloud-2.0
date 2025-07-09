import {
  StyleProp,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { colors } from '~/constants/Colors';
import { MyText } from '../Ui/MyText';

type Props = TextInputProps & {
  label: string;

  password?: boolean;
  toggleSecure?: () => void;
  secureTextEntry?: boolean;

  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  textarea?: boolean;
};

export const Input = ({
  placeholder,
  containerStyle,
  leftIcon,
  label,
  password,
  secureTextEntry,
  textarea,
  toggleSecure,
  ...rest
}: Props): JSX.Element => {
  return (
    <View>
      <MyText poppins="Medium">{label}</MyText>
      <TextInput
        {...rest}
        style={[
          {
            flex: 1,
            fontFamily: 'NunitoRegular',
            fontSize: 15,
            color: colors.black,
          },
          rest.style,
        ]}
        placeholderTextColor={colors.textGray}
        secureTextEntry={secureTextEntry}
      />
    </View>
  );
};
