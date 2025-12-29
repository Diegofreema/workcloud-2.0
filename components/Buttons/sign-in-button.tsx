import { useAuthActions } from '@convex-dev/auth/react';
import { useMutation } from 'convex/react';
import { makeRedirectUri } from 'expo-auth-session';
import { openAuthSessionAsync } from 'expo-web-browser';
import { Platform, View } from 'react-native';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Button } from '~/features/common/components/Button';

const redirectTo = makeRedirectUri();

export function SignIn() {
  const { signIn } = useAuthActions();
  const { user } = useAuth();
  const updateStreamToken = useMutation(api.users.updateStreamToken);
  //  const tokenProvider = async () => {
  //     const values = JSON.stringify({
  //       ...person,
  //       email: user?.email,
  //     });
  //     await AsyncStorage.setItem('person', JSON.stringify(person));
  //     await AsyncStorage.setItem('body', values);
  //     try {
  //       const { data } = await axios.post(
  //         `https://workcloud-web.vercel.app/token`,
  //         {
  //           name: user?.name,
  //           email: user?.email,
  //           image: user?.image,
  //           id: user?._id,
  //         }
  //       );

  //       await updateStreamToken({ streamToken: data.token });
  //       return data.token;
  //     } catch (error) {
  //       console.error('error', error);
  //       throw new Error('Failed to fetch user data');
  //     }
  //   };
  const loading = user === undefined;
  const handleSignIn = async (provider: 'google' | 'apple') => {
    const { redirect } = await signIn(provider, { redirectTo });
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
    <View style={{ gap: 15 }}>
      <Button
        title={'Sign in with Google'}
        loadingTitle={'Signing in...'}
        onPress={() => handleSignIn('google')}
        loading={loading}
        disabled={loading}
      />

      {/* {Platform.OS === 'ios' && (
        <Button
          title={'Continue'}
          loadingTitle={'Signing in...'}
          onPress={() => handleSignIn('apple')}
          loading={loading}
          disabled={loading}
        />
      )} */}
    </View>
  );
}
