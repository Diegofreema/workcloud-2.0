import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export const CallComponent = () => {
  const { callId } = useLocalSearchParams<{ callId: string }>();
  return (
    <View>
      <Text></Text>
    </View>
  );
};
