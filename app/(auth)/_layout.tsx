import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    // @ts-ignore
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName="login" />
    </>
  );
};

export default AuthLayout;
