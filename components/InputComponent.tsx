import { IconNode } from '@rneui/base';
import { Input } from '@rneui/themed';
import { KeyboardTypeOptions, TextInputProps, View } from 'react-native';

import { useDarkMode } from '~/hooks/useDarkMode';

type Props = TextInputProps & {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  label?: string;
  setToggle?: () => void;
  password?: boolean;
  id?: string;
  numberOfLines?: number;
  rightIcon?: IconNode;
  textarea?: boolean;
};

export const InputComponent = ({
  onChangeText,
  placeholder,
  value,
  keyboardType,
  secureTextEntry,
  setToggle,
  id,
  password,
  label,
  numberOfLines,
  textarea,
  ...props
}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  return (
    <View style={{ height: 'auto', backgroundColor: darkMode === 'dark' ? 'black' : 'white' }}>
      <Input
        {...props}
        placeholder={placeholder}
        label={label}
        inputContainerStyle={{
          borderBottomColor: 'transparent',
          backgroundColor: '#E5E5E5',
          borderBottomWidth: 0,
          paddingHorizontal: 8,
          borderRadius: 5,
          height: textarea ? 100 : 60,
        }}
        placeholderTextColor="grey"
        inputStyle={{
          fontFamily: 'PoppinsLight',
          fontSize: 13,
          textAlignVertical: textarea ? 'top' : 'center',
          height: textarea ? 100 : 60,
          paddingVertical: textarea ? 10 : 0,
        }}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        labelStyle={{
          color: darkMode === 'dark' ? 'white' : 'black',
          marginBottom: 5,
        }}
        numberOfLines={numberOfLines}
        multiline={textarea}
      />
    </View>
  );
};
