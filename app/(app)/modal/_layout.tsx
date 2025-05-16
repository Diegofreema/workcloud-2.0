import { Stack } from 'expo-router';

const ModalLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="previe-image"
        options={{ headerShown: false, presentation: 'fullScreenModal' }}
      />
    </Stack>
  );
};

export default ModalLayout;
