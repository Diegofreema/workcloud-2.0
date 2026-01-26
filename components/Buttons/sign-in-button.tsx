import { useState } from 'react';
import { Platform, View } from 'react-native';
import { toast } from 'sonner-native';
import { Button } from '~/features/common/components/Button';
import { authClient } from '~/lib/auth-client';

export function SignIn() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: 'google' | 'apple') => {
    const data = await authClient.signIn.social({
      provider,
      callbackURL: '/',
      fetchOptions: {
        onRequest: () => setLoading(true),
        onSuccess: async () => {
          setLoading(false);
        },
        onError: ({ error }) => {
          toast.error(error.message || error.statusText);
          setLoading(false);
        },
        onResponse: () => {
          setLoading(false);
        },
      },
    });
    console.log({ data });
  };
  return (
    <View style={{ gap: 15 }}>
      {/* {Platform.OS === 'android' && ( */}
      <Button
        title={'Sign in with Google'}
        loadingTitle={'Signing in...'}
        onPress={() => handleSignIn('google')}
        loading={loading}
        disabled={loading}
      />
      {/* )} */}

      {Platform.OS === 'ios' && (
        <Button
          title={'Continue'}
          loadingTitle={'Signing in...'}
          onPress={() => handleSignIn('apple')}
          loading={loading}
          disabled={loading}
        />
      )}
    </View>
  );
}
