import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';

type ActionBtnProps = TouchableOpacityProps & {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  btnStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
};
export const ActionBtn = ({ title, textStyle, btnStyle, isLoading, ...props }: ActionBtnProps) => {
  return (
    <TouchableOpacity style={[styles.btn, btnStyle]} activeOpacity={0.6} {...props}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.dialPad} />
      ) : (
        <MyText poppins="Medium" style={[styles.text, textStyle]}>
          {title}
        </MyText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.dialPad,
    fontSize: RFPercentage(1.7),
  },
  btn: {
    padding: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dialPad,
  },
});
