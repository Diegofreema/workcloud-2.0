import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';
import Colors from '~/constants/Colors';
import { useTheme } from '~/hooks/use-theme';
type Props = {
  value?: string;
  setValue?: (text: string) => void;
  placeholder?: string;
  customStyles?: StyleProp<ViewStyle>;
  show?: boolean;
  showArrow?: boolean;
};
export const SearchComponent = ({
  value,
  setValue,
  placeholder = 'Search..',
  customStyles,
  show = true,
  showArrow = true,
}: Props) => {
  const { theme: darkMode } = useTheme();
  const color = Colors[darkMode || 'light'].text;
  const router = useRouter();
  const onPress = () => {
    setValue && setValue('');
    router.back();
  };
  const onClear = () => {
    setValue && setValue('');
  };
  return (
    <View style={[styles.containerStyle, { borderColor: color }]}>
      {!value && showArrow && (
        <AntDesign
          name="arrow-left"
          size={24}
          color={color}
          onPress={onPress}
        />
      )}
      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        style={[styles.inputStyle, { color }]}
      />
      {show && value && (
        <AntDesign
          name="close"
          size={24}
          color={color}
          onPress={onClear}
          style={{ position: 'absolute', right: 10 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    fontSize: RFPercentage(2),
    flex: 1,

    padding: 10,
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 10,
    minHeight: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    marginBottom: 10,
    width: '100%',
  },
});
