import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { StyleSheet } from 'react-native';

import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';
import { SuggestionTypes } from '~/constants/types';
import { useTheme } from '~/hooks/use-theme';

type Props = {
  suggestion: SuggestionTypes;
};
export const Suggestion = ({ suggestion }: Props) => {
  const { theme: darkMode } = useTheme();
  const color = darkMode === 'dark' ? colors.white : colors.black;
  const onPress = () => {
    router.setParams({ query: suggestion.text });
  };
  return (
    <CustomPressable onPress={onPress} style={styles.pressable}>
      <Search size={20} color={color} />
      <MyText poppins="Medium" fontSize={15}>
        {suggestion.text}
      </MyText>
    </CustomPressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    gap: 10,
    alignItems: 'center',
  },
});
