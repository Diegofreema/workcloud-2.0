import { FlatList, View } from "react-native";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { MyText } from "~/components/Ui/MyText";
import { colors } from "~/constants/Colors";

type Props = {
  data: string[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
};
export const TabsSelector = ({ data, onSelectIndex, selectedIndex }: Props) => {
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <CustomPressable
            onPress={() => onSelectIndex(index)}
            style={{
              backgroundColor:
                selectedIndex === index ? colors.dialPad : "transparent",
              borderRadius: 4,
            }}
          >
            <MyText
              poppins={"Medium"}
              fontSize={15}
              style={{
                color: selectedIndex === index ? colors.white : colors.black,
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
