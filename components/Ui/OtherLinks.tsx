import { AntDesign } from '@expo/vector-icons';
import { Divider } from '@rneui/themed';
import { Href, router } from 'expo-router';
import { Pressable } from 'react-native';

import { HStack } from '../HStack';
import { HelpSvg, LockSvg, UserSvg } from '../LockSvg';
import { MyText } from './MyText';
import VStack from './VStack';

import { colors } from '~/constants/Colors';
import { useDarkMode } from '~/hooks/useDarkMode';

export const OtherLinks = ({
  workerId,
}: {
  workerId?: string;
}): JSX.Element => {
  const { darkMode } = useDarkMode();
  const link: string = workerId
    ? `/myWorkerProfile/${workerId}`
    : '/create-worker-profile';
  const title = workerId ? "Worker's Profile" : 'Create Worker Profile';
  return (
    <VStack
      mt={20}
      p={20}
      mx={20}
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
        link="/privacy"
      />

      <Item
        rightIcon={<UserSvg height={50} width={50} />}
        title={title}
        link={link as Href}
      />
    </VStack>
  );
};

const Item = ({
  rightIcon,
  title,
  link,
}: {
  rightIcon: JSX.Element;
  title: string;
  link: Href;
}) => {
  return (
    <Pressable
      onPress={() => router.push(link)}
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
