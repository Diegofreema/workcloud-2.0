import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useDarkMode } from "~/hooks/useDarkMode";
import { useAuth } from "~/context/auth";

const AuthLayout = () => {
  const { darkMode } = useDarkMode();
  const { user } = useAuth();

  if (user) {
    return <Redirect href={"/(app)/(tabs)"} />;
  }
  return (
    // @ts-ignore
    <>
      <StatusBar
        style={darkMode === "dark" ? "light" : "dark"}
        backgroundColor={darkMode === "dark" ? "black" : "white"}
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;
