import { AntDesign } from '@expo/vector-icons';
import { Divider } from '@rneui/themed';
import { Href, router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable } from 'react-native';
import { HStack } from '../HStack';
import { HelpSvg, LockSvg, UserSvg } from '../LockSvg';
import { MyText } from './MyText';
import VStack from './VStack';

import { Check, Trash } from 'lucide-react-native';
import { View } from 'react-native';
import { colors } from '~/constants/Colors';
import { useTheme } from '~/hooks/use-theme';
import { useGetUserId } from '~/hooks/useGetUserId';

export const OtherLinks = ({
  workerId,
}: {
  workerId?: string;
}): JSX.Element => {
  const { theme: darkMode } = useTheme();
  const { organizationId } = useGetUserId();
  const link: string = workerId
    ? `/myWorkerProfile/${workerId}`
    : '/create-worker-profile';
  const title = workerId ? "Worker's Profile" : 'Create Worker Profile';
  return (
    <VStack
      mt={20}
      p={20}
      mx={20}
      mb={20}
      rounded={10}
      borderWidth={1}
      borderColor={colors.gray}
      gap={15}
    >
      <Item
        rightIcon={<HelpSvg height={50} width={50} />}
        title="Help Center"
        link="/help"
      />
      <Divider
        style={{
          backgroundColor: darkMode === 'dark' ? 'transparent' : '#ccc',
        }}
      />
      <Item
        rightIcon={<LockSvg height={50} width={50} />}
        title="Privacy Policy"
        link="https://workcloud-web.vercel.app/privacy-policy"
        external
      />

      <Item
        rightIcon={<UserSvg height={50} width={50} />}
        title={title}
        link={link as Href}
      />
      <Item
        rightIcon={
          <View
            style={{
              backgroundColor: '#E7EDFF',
              borderRadius: 5555,

              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Trash size={30} color={'#0047FF'} />
          </View>
        }
        title={'Delete account'}
        link={'/delete-account'}
      />
      {organizationId && (
        <Item
          rightIcon={
            <View
              style={{
                backgroundColor: '#E7EDFF',
                borderRadius: 5555,

                width: 50,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AntDesign name="setting" size={30} color="#0047FF" />
            </View>
          }
          title={'Manage Subscription'}
          link={'/manage-subscription'}
        />
      )}
    </VStack>
  );
};

const Item = ({
  rightIcon,
  title,
  link,
  external,
}: {
  rightIcon: JSX.Element;
  title: string;
  link: Href;
  external?: boolean;
}) => {
  const onPress = async () => {
    if (external) {
      await WebBrowser.openBrowserAsync(link as string);
    } else {
      router.push(link);
    }
  };
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <HStack gap={10} alignItems="center">
          {rightIcon}
          <MyText poppins="Bold" fontSize={16}>
            {title}
          </MyText>
        </HStack>
        <AntDesign name="right" size={24} color="#0047FF" />
      </HStack>
    </Pressable>
  );
};
