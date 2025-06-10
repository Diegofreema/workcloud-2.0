import {FlatList, View} from "react-native";
import {CustomPressable} from "~/components/Ui/CustomPressable";
import {MyText} from "~/components/Ui/MyText";
import {colors} from "~/constants/Colors";

type Props = {
  data: string[];
  selected: string;
  onSelect: (item: string) => void;
};
export const TabsSelector = ({ onSelect, selected, data }: Props) => {
  return (
    <View>
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <CustomPressable
            onPress={() => onSelect(item)}
            style={{
              backgroundColor:
                selected === item ? colors.dialPad : "transparent",
              borderRadius: 4,
            }}
          >
            <MyText
              poppins={"Medium"}
              fontSize={15}
              style={{
                color: selected === item ? colors.white : colors.black,
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
