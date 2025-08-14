import { Link } from 'expo-router';
import { Pressable, useColorScheme, View } from 'react-native';

import { MyText } from '~/components/Ui/MyText';

import { JSX } from 'react';
import { Avatar } from '~/components/Ui/Avatar';
import Colors from '~/constants/Colors';

type PartUser = {
  id: string;
  name: string;
  avatar: string;
};
export const ProfileHeader = (user: PartUser): JSX.Element | undefined => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;
  return (
    <Link asChild href={`/profile-edit?id=${user?.id}`}>
      <Pressable
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <Avatar image={user?.avatar} />
        <View>
          <MyText
            poppins="Bold"
            fontSize={17}
            style={{
              fontFamily: 'PoppinsBold',
              fontSize: 17,
              color,
            }}
          >
            Hi {user?.name}
          </MyText>
          <MyText
            poppins="Light"
            fontSize={15}
            style={{
              color: '#666666',
              fontFamily: 'PoppinsLight',
            }}
          >
            Good to have you here
          </MyText>
        </View>
      </Pressable>
    </Link>
  );
};
