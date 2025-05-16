import { router } from 'expo-router';
import { ArrowLeft, SearchIcon, X } from 'lucide-react-native';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { colors } from '~/constants/Colors';
import { useDarkMode } from '~/hooks/useDarkMode';

type Props = {
  placeholder: string;
  search?: boolean;
  query?: string;
  handleChange?: (value: string) => void;
  onPress?: () => void;
  onClear?: () => void;
  back?: boolean;
};
export const SearchHeader = ({
  placeholder,
  query,
  handleChange,
  search = true,
  onPress,
  onClear,
  back = false,
}: Props) => {
  const { darkMode } = useDarkMode();
  const color = darkMode === 'dark' ? colors.white : colors.black;
  return search ? (
    <View style={[styles.textInputContainer, { height: 50 }]}>
      {back && !query && (
        <TouchableOpacity onPress={() => router.back()} hitSlop={10}>
          <ArrowLeft size={30} color={color} strokeWidth={1.5} onPress={onClear} />
        </TouchableOpacity>
      )}
      <TextInput
        style={styles.textInput}
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
      />
      {query && <X size={30} color={color} strokeWidth={1.5} onPress={onClear} />}
    </View>
  ) : (
    <TouchableOpacity style={styles.textInputContainer} onPress={onPress}>
      <Text style={styles.textInput}>{placeholder}</Text>
      <SearchIcon size={30} color={color} strokeWidth={1.5} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textInput: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  textInputContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
});
