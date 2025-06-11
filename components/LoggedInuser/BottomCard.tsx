import { FontAwesome } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { colors } from "~/constants/Colors";
import { HStack } from "../HStack";
import { MyText } from "../Ui/MyText";
import VStack from "../Ui/VStack";
import { useAuth } from "~/context/auth";

type Props = {
  workId?: any;
};
export const call = {
  time: "20 min ago",
  from: "Called on fidelity WS",
  name: "Roland Gracias",
};

export const BottomCard = ({ workId }: Props): JSX.Element => {
  const { signOut } = useAuth();

  const logout = async () => {
    signOut();
  };
  const onPress = () => {
    if (workId) {
      router.push(`/myWorkerProfile/${workId}`);
    } else {
      router.push("/create-worker-profile");
    }
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <VStack mt={20}>
        {/* <Pressable onPress={handleNavigate}>
          <HStack space="sm">
            <Image
              source={require('../../assets/images/settings.png')}
              style={{ width: 18, height: 18 }}
            />
            <VStack>
              <MyText poppins="Medium" fontSize={12}>
                Settings
              </MyText>
              <MyText poppins="Light" fontSize={9}>
                Change password, Email address
              </MyText>
            </VStack>
          </HStack>
        </Pressable> */}

        <Pressable
          onPress={logout}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <HStack gap={10} mt={20} alignItems="center">
            <Image
              source={require("../../assets/images/exit.png")}
              style={{ width: 25, height: 25 }}
            />
            <MyText poppins="Medium" fontSize={13}>
              Logout
            </MyText>
          </HStack>
        </Pressable>
        <View style={{ marginTop: "auto" }}>
          <Pressable
            style={({ pressed }) => ({
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              opacity: pressed ? 0.5 : 1,
            })}
            onPress={onPress}
          >
            <FontAwesome name="user" size={24} color={colors.lightBlue} />
            <MyText poppins="Medium" fontSize={13}>
              {`${workId ? "Worker's" : "Create Worker's"} Profile`}
            </MyText>
          </Pressable>
        </View>
      </VStack>
    </ScrollView>
  );
};
