import { Stack } from 'expo-router';

const AuthLayout = () => {
  return (
    // @ts-ignore
    <>
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
};

export default AuthLayout;
