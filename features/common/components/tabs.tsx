import { FlatList, View } from 'react-native';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { MyText } from '~/components/Ui/MyText';
import Colors, { colors } from '~/constants/Colors';
import { useColorScheme } from '~/hooks/useColorScheme';

type Props = {
  data: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};
export const TabsSelector = ({ data, onSelectIndex, selectedIndex }: Props) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <CustomPressable
            onPress={() => onSelectIndex(index)}
            style={{
              backgroundColor:
                selectedIndex === index ? colors.dialPad : 'transparent',
              borderRadius: 4,
            }}
          >
            <MyText
              poppins={'Medium'}
              fontSize={15}
              style={{
                color: selectedIndex === index ? colors.white : color,
              }}
            >
              {item}
            </MyText>
          </CustomPressable>
        )}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};
