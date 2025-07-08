import { Feather } from '@expo/vector-icons';
import { Control, Controller, FieldErrors } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { MyText } from './Ui/MyText';
import { colors } from '~/constants/Colors';

type Props = TextInputProps & {
  label: string;
  placeholder: string;
  password?: boolean;
  toggleSecure?: () => void;
  secureTextEntry?: boolean;
  name: string;
  errors: FieldErrors<any>;
  control: Control<any>;
  type?: KeyboardTypeOptions;
  onEditFinish?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  leftIcon?: React.ReactNode;
  textarea?: boolean;
};
export const CustomInput = ({
  label,
  placeholder,
  password,
  toggleSecure,
  secureTextEntry,
  errors,
  name,
  control,
  type = 'default',
  onEditFinish,
  containerStyle,
  leftIcon,
  textarea,
  ...rest
}: Props) => {
  const onPress = () => {
    if (toggleSecure) {
      toggleSecure();
    }
  };
  const onEndEditing = () => {
    onEditFinish && onEditFinish();
  };
  return (
    <View style={{ gap: 10 }}>
      <MyText poppins="Bold" style={{ fontFamily: 'NunitoBold' }}>
        {label}
      </MyText>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={[styles.inputContainer, containerStyle]}>
          {leftIcon && <View style={{ marginRight: 5 }}>{leftIcon}</View>}
          <Controller
            control={control}
            render={({ field: { onBlur, value, onChange } }) => (
              <TextInput
                placeholder={placeholder}
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
                onBlur={onBlur}
                value={value}
                onChangeText={onChange}
                keyboardType={type}
                autoCapitalize="none"
                onEndEditing={onEndEditing}
                {...rest}
              />
            )}
            name={name}
          />
          {password && (
            <TouchableOpacity onPress={onPress} style={{ marginRight: 10 }}>
              <Feather
                name={secureTextEntry ? 'eye' : 'eye-off'}
                size={25}
                color={'grey'}
              />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
      {errors[name] && (
        // @ts-ignore
        <Text style={styles.error}>{errors?.[name]?.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 8,
    padding: 5,
    height: 55,
  },
  error: {
    fontSize: 15,
    fontFamily: 'NunitoBold',
    color: 'red',
  },
});
