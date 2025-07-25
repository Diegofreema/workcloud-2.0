import { FlatList, View } from "react-native";
import { useStaffStore } from "~/features/staff/store/staff-store";
import { UserPreview } from "~/components/Ui/UserPreview";
import { X } from "lucide-react-native";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { colors } from "~/constants/Colors";

export const DisplayStaffList = () => {
  const staffs = useStaffStore((state) => state.staffs);
  const removeStaff = useStaffStore((state) => state.removeStaff);
  return (
    <FlatList
      data={staffs}
      renderItem={({ item }) => (
        <View>
          <UserPreview imageUrl={item.image} />
          <CustomPressable
            onPress={() => removeStaff(item.id)}
            style={{
              position: "absolute",
              top: -5,
              right: -3,
              backgroundColor: colors.closeTextColor,
              borderRadius: 50,
            }}
          >
            <X color={colors.white} />
          </CustomPressable>
        </View>
      )}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingVertical: 10 }}
    />
  );
};
