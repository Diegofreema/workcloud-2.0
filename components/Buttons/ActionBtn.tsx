import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { Badge } from '../badge/Badge';

type ActionBtnProps = TouchableOpacityProps & {
  title: string;
  textStyle?: StyleProp<TextStyle>;
  btnStyle?: StyleProp<ViewStyle>;
  isLoading?: boolean;
  right?: number | string;
};
export const ActionBtn = ({
  title,
  textStyle,
  btnStyle,
  isLoading,
  right,
  ...props
}: ActionBtnProps) => {
  return (
    <TouchableOpacity
      style={[styles.btn, btnStyle, { opacity: props.disabled ? 0.5 : 1 }]}
      activeOpacity={0.6}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.dialPad} />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 4,
          }}
        >
          <MyText poppins="Medium" style={[styles.text, textStyle]}>
            {title}
          </MyText>
          {right !== undefined && (
            <Badge
              label={right?.toString()}
              radius="full"
              size="sm"
              variant="error"
              textStyle={{ color: 'white' }}
              style={styles.right}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.dialPad,
    fontSize: RFPercentage(1.5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.dialPad,
  },
  right: {
    backgroundColor: 'red',
    width: 20,
  },
});
