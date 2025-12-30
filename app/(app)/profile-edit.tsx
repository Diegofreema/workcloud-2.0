import { Icon } from '@rneui/themed';
import { StreamVideoRN } from '@stream-io/video-react-native-sdk';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { toast } from 'sonner-native';
import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { LogOutSvg } from '~/components/LockSvg';
import { MiddleCard } from '~/components/LoggedInuser/MiddleCard';
import { TopCard } from '~/components/LoggedInuser/TopCard';
import { CustomScrollView } from '~/components/Ui/CustomScrollView';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { OtherLinks } from '~/components/Ui/OtherLinks';
import { defaultStyle } from '~/constants';
import { api } from '~/convex/_generated/api';
import { useTheme } from '~/hooks/use-theme';
import { authClient } from '~/lib/auth-client';

const ProfileEdit = () => {
  const [loading, setLoading] = useState(false);
  const user = useQuery(api.users.getUserById);
  const connections = useQuery(api.connection.getUserConnections, {});
  const colorScheme = useColorScheme();

  if (user === undefined || connections === undefined) {
    return <LoadingComponent />;
  }

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          StreamVideoRN.onPushLogout();
          toast.success('Logged out successfully');
          setLoading(false);
        },
        onRequest: () => {
          setLoading(true);
        },
        onError: ({ error }) => {
          toast.error('Failed to log out', {
            description: error.message || error.statusText,
          });
          setLoading(false);
        },
      },
    });
  };

  return (
    <CustomScrollView contentContainerStyle={{}}>
      <View style={[styles.container]}>
        <HeaderNav title="Profile" rightComponent={<RightComponent />} />
      </View>
      <TopCard id={user?._id} name={user?.name} image={user?.image!} />
      <View style={{ marginTop: 20, ...defaultStyle }}>
        {/* @ts-ignore */}
        <MiddleCard connections={connections} />
      </View>
      <OtherLinks workerId={user?.workerId} />
      <Pressable
        style={({ pressed }) => ({
          marginTop: 'auto',
          marginHorizontal: 20,
          marginBottom: 50,
          opacity: pressed ? 0.5 : 1,
        })}
        onPress={logout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator style={{ alignSelf: 'center' }} />
        ) : (
          <HStack
            width="100%"
            alignItems="center"
            justifyContent="center"
            bg={colorScheme === 'dark' ? 'white' : '#F2F2F2'}
            p={10}
            rounded={10}
            gap={5}
          >
            <LogOutSvg height={30} width={30} />
            <MyText poppins="Bold" fontSize={16} style={{ color: 'black' }}>
              Log Out
            </MyText>
          </HStack>
        )}
      </Pressable>
    </CustomScrollView>
  );
};

export default ProfileEdit;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
});
const RightComponent = () => {
  const { toggleTheme, theme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
        padding: 5,
        borderRadius: 5555,
        // backgroundColor: darkMode === 'dark' ? 'white' : 'black',
      })}
    >
      <View
        style={{
          backgroundColor: theme === 'dark' ? 'white' : 'black',
          padding: 10,
          borderRadius: 5555,
        }}
      >
        <Icon
          name={theme === 'dark' ? 'sun' : 'moon'}
          size={30}
          color={theme === 'dark' ? 'black' : 'white'}
          type="feather"

          // containerColor={darkMode === 'dark' ? 'white' : 'black'}
        />
      </View>
    </Pressable>
  );
};
