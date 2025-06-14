import { Divider } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

import { AuthTitle } from "~/components/AuthTitle";
import { Subtitle } from "~/components/Subtitle";
import { Container } from "~/components/Ui/Container";
import { useDarkMode } from "~/hooks/useDarkMode";
import { useWarmUpBrowser } from "~/hooks/warmUpBrowser";
import { useAuth } from "~/context/auth";
import { Button } from "~/features/common/components/Button";

export default function SignInScreen() {
  useWarmUpBrowser();
  const { height } = useWindowDimensions();
  const { signIn, isLoading } = useAuth();
  const { darkMode } = useDarkMode();

  // const { signIn } = useSignIn();
  const { width } = useWindowDimensions();
  // const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  // const onSelectAuth = async () => {
  //   if (!signIn || !signUp) return;
  //
  //   const userExistsButNeedsToSignIn =
  //     signUp.verifications.externalAccount.status === "transferable" &&
  //     signUp.verifications.externalAccount.error?.code ===
  //       "external_account_exists";
  //
  //   if (userExistsButNeedsToSignIn) {
  //     const res = await signIn.create({ transfer: true });
  //
  //     if (res.status === "complete") {
  //       await setActive({
  //         session: res.createdSessionId,
  //       });
  //     }
  //   }
  //
  //   const userNeedsToBeCreated =
  //     signIn.firstFactorVerification.status === "transferable";
  //
  //   if (userNeedsToBeCreated) {
  //     const res = await signUp.create({
  //       transfer: true,
  //     });
  //
  //     if (res.status === "complete") {
  //       await setActive({
  //         session: res.createdSessionId,
  //       });
  //     }
  //   } else {
  //     // If the user has an account in your application
  //     // and has an OAuth account connected to it, you can sign them in.
  //     try {
  //       const { createdSessionId, setActive } = await startOAuthFlow();
  //       if (createdSessionId) {
  //         await setActive!({ session: createdSessionId });
  //       }
  //     } catch (error) {
  //       console.log(JSON.stringify(error, null, 1));
  //     }
  //   }
  // };

  const color =
    darkMode === "dark"
      ? ["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.9)", "#000"]
      : ["rgba(255, 255, 255, 0.7)", "rgba(255, 255, 255, 0.9)", "#fff"];
  return (
    <Container>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <View style={{ marginTop: 40, marginHorizontal: 20 }}>
            <AuthTitle>Get an organized way to solve problems</AuthTitle>
            <Subtitle style={{ textAlign: "center" }}>
              Own a workspace, connect to clients and get issue solved
            </Subtitle>
          </View>
          <Divider />
          <View
            style={{
              width: "100%",

              alignItems: "center",
              flex: 1,
            }}
          >
            <Image
              source={require("~/assets/images/d.png")}
              style={{
                height: "100%",
                width: width * 0.9,
                resizeMode: "contain",
                marginTop: 20,
              }}
            />
          </View>
        </View>

        <LinearGradient
          //  @ts-ignore
          colors={color}
          locations={[0, 0.2, 1]}
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: height * 0.25,
          }}
        >
          <View style={{ marginTop: "auto", marginBottom: 20 }}>
            <Button
              title={"Sign in with Google"}
              loading={isLoading}
              loadingTitle={"Signing in..."}
              onPress={signIn}
            />
          </View>
        </LinearGradient>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 10,
  },
});

// 09063181894
