import { ActivityIndicator, View } from "react-native";

export const SmallLoader = () => {
  return (
    <View
      style={{
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="small" />
    </View>
  );
};
