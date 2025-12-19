/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Icon } from '@rneui/themed';
import { StreamVideoRN } from '@stream-io/video-react-native-sdk';
import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';

import { useAuthActions } from '@convex-dev/auth/react';
import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { LogOutSvg } from '~/components/LockSvg';
import { MiddleCard } from '~/components/LoggedInuser/MiddleCard';
import { TopCard } from '~/components/LoggedInuser/TopCard';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { OtherLinks } from '~/components/Ui/OtherLinks';
import { defaultStyle } from '~/constants';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useTheme } from '~/hooks/use-theme';
import { CustomScrollView } from '~/components/Ui/CustomScrollView';

const ProfileEdit = () => {
  const { signOut } = useAuthActions();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const user = useQuery(api.users.getUserById, { id: id as Id<'users'> });
  const connections = useQuery(api.connection.getUserConnections, {});
  const colorScheme = useColorScheme();

  if (user === undefined || connections === undefined) {
    return <LoadingComponent />;
  }

  const logout = async () => {
    setLoading(true);
    try {
      await signOut();
      await StreamVideoRN.onPushLogout();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomScrollView contentContainerStyle={{}}>
      <View style={[styles.container]}>
        <HeaderNav title="Profile" rightComponent={<RightComponent />} />
      </View>
      <TopCard
        id={user?._id as Id<'users'>}
        name={user?.name as string}
        image={user?.image as string}
      />
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
