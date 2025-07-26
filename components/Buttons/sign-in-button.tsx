import { useAuthActions } from '@convex-dev/auth/react';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Platform } from 'react-native';
import { useAuth } from '~/context/auth';
import { Button } from '~/features/common/components/Button';

const redirectTo = makeRedirectUri();

export function SignIn() {
  const { signIn } = useAuthActions();
  const { user } = useAuth();
  const loading = user === undefined;
  const handleSignIn = async () => {
    const { redirect } = await signIn('google', { redirectTo });
    if (Platform.OS === 'web') {
      return;
    }
    const result = await openAuthSessionAsync(redirect!.toString(), redirectTo);
    if (result.type === 'success') {
      const { url } = result;
      const code = new URL(url).searchParams.get('code')!;
      await signIn('google', { code });
    }
  };
  return (
    <Button
      title={'Sign in with Google'}
      loadingTitle={'Signing in...'}
      onPress={handleSignIn}
      loading={loading}
      disabled={loading}
    />
  );
}
