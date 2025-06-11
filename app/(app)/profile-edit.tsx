import { Icon } from "@rneui/themed";
import { useQuery } from "convex/react";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

import { HStack } from "~/components/HStack";
import { HeaderNav } from "~/components/HeaderNav";
import { LogOutSvg } from "~/components/LockSvg";
import { MiddleCard } from "~/components/LoggedInuser/MiddleCard";
import { TopCard } from "~/components/LoggedInuser/TopCard";
import { LoadingComponent } from "~/components/Ui/LoadingComponent";
import { MyText } from "~/components/Ui/MyText";
import { OtherLinks } from "~/components/Ui/OtherLinks";
import { defaultStyle } from "~/constants";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { useDarkMode } from "~/hooks/useDarkMode";
import { useAuth } from "~/context/auth";

const ProfileEdit = () => {
  const { signOut } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const user = useQuery(api.users.getUserById, { id: id as Id<"users"> });
  const connections = useQuery(api.connection.getUserConnections, {
    ownerId: id as Id<"users">,
  });
  const { darkMode } = useDarkMode();

  if (user === undefined || connections === undefined) {
    return <LoadingComponent />;
  }

  const logout = async () => {
    setLoading(true);
    try {
      signOut();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const isDarkMode = darkMode === "dark";
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: isDarkMode ? "black" : "white",
      }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDarkMode ? "black" : "white" },
        ]}
      >
        <HeaderNav title="Profile" rightComponent={<RightComponent />} />
      </View>
      <TopCard id={user?._id} name={user?.name} image={user?.imageUrl!} />
      <View style={{ marginTop: 20, ...defaultStyle }}>
        {/* @ts-ignore */}
        <MiddleCard connections={connections} />
      </View>
      <OtherLinks workerId={user?.workerId} />
      <Pressable
        style={({ pressed }) => ({
          marginTop: "auto",
          marginHorizontal: 20,
          marginBottom: 50,
          opacity: pressed ? 0.5 : 1,
        })}
        onPress={logout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator style={{ alignSelf: "center" }} />
        ) : (
          <HStack
            width="100%"
            alignItems="center"
            justifyContent="center"
            bg={isDarkMode ? "white" : "#F2F2F2"}
            p={10}
            rounded={10}
            gap={5}
          >
            <LogOutSvg height={30} width={30} />
            <MyText poppins="Bold" fontSize={16} style={{ color: "black" }}>
              Log Out
            </MyText>
          </HStack>
        )}
      </Pressable>
    </View>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
const RightComponent = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();
  return (
    <Pressable
      onPress={toggleDarkMode}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        padding: 5,
        borderRadius: 5555,
        // backgroundColor: darkMode === 'dark' ? 'white' : 'black',
      })}
    >
      <View
        style={{
          backgroundColor: darkMode === "dark" ? "white" : "black",
          padding: 10,
          borderRadius: 5555,
        }}
      >
        <Icon
          name={darkMode === "dark" ? "sun" : "moon"}
          size={30}
          color={darkMode === "dark" ? "black" : "white"}
          type="feather"

          // containerColor={darkMode === 'dark' ? 'white' : 'black'}
        />
      </View>
    </Pressable>
  );
};
