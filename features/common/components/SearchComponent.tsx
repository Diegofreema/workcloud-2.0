import { AntDesign } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { RFPercentage } from 'react-native-responsive-fontsize';
import { useTheme } from '~/hooks/use-theme';
type Props = {
  value?: string;
  setValue?: (text: string) => void;
  placeholder?: string;
  customStyles?: StyleProp<ViewStyle>;
  show?: boolean;
};
export const SearchComponent = ({
  value,
  setValue,
  placeholder = 'Search..',
  customStyles,
  show = true,
}: Props) => {
  const { theme: darkMode } = useTheme();
  const router = useRouter();
  const onPress = () => {
    setValue && setValue('');
    router.back();
  };

  return (
    <View style={customStyles}>
      <SearchBar
        placeholderTextColor="#ccc"
        inputStyle={styles.inputStyle}
        containerStyle={[styles.containerStyle]}
        inputContainerStyle={styles.inputContainer}
        placeholder={placeholder}
        onChangeText={setValue}
        value={value}
        searchIcon={
          show && (
            <AntDesign
              name="arrowleft"
              size={25}
              color={darkMode === 'dark' ? 'white' : 'black'}
              onPress={onPress}
            />
          )
        }
        round
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: {
    color: 'black',
    fontSize: RFPercentage(2),
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  inputContainer: {
    backgroundColor: 'transparent',
  },
});
