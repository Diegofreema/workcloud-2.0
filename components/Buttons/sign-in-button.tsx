import { useState } from 'react';
import { View } from 'react-native';
import { toast } from 'sonner-native';
import { useAuth } from '~/context/auth';
import { Button } from '~/features/common/components/Button';
import { authClient } from '~/lib/auth-client';

export function SignIn() {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: 'google' | 'apple') => {
    await authClient.signIn.social({
      provider,
      callbackURL: '/',
      fetchOptions: {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          toast.success('Success', {
            description: 'You have successfully signed in',
          });
          setLoading(false);
        },
        onError: ({ error }) => {
          toast.error('Error', {
            description: error.message,
          });
          setLoading(false);
        },
      },
    });
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
