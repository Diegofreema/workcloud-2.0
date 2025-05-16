import { Link } from 'expo-router';
import { Pressable, View } from 'react-native';

import { MyText } from './Ui/MyText';

import { Avatar } from '~/components/Ui/Avatar';
import { useDarkMode } from '~/hooks/useDarkMode';

type PartUser = {
  id: string;
  name: string;
  avatar: string;
};
export const ProfileHeader = (user: PartUser): JSX.Element | undefined => {
  const { darkMode } = useDarkMode();
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
              color: darkMode === 'dark' ? 'white' : 'black',
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
