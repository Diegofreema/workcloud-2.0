import { AntDesign } from '@expo/vector-icons';
import { SearchBar } from '@rneui/themed';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { useDarkMode } from '~/hooks/useDarkMode';

export const SearchComponent = ({
  value,
  setValue,
  placeholder = 'Search..',
  customStyles,
}: {
  value?: string;
  setValue?: (text: string) => void;
  placeholder?: string;
  customStyles?: StyleProp<ViewStyle>;
}) => {
  const { darkMode } = useDarkMode();
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
        containerStyle={styles.containerStyle}
        inputContainerStyle={styles.inputContainer}
        placeholder={placeholder}
        onChangeText={setValue}
        value={value}
        searchIcon={
          <AntDesign
            name="arrowleft"
            size={25}
            color={darkMode === 'dark' ? 'white' : 'black'}
            onPress={onPress}
          />
        }
        round
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputStyle: { backgroundColor: 'transparent', borderWidth: 0, color: 'black' },
  containerStyle: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  inputContainer: { backgroundColor: 'transparent', borderWidth: 1, borderBottomWidth: 1 },
});
