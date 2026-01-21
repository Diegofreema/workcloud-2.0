import { useQuery } from 'convex/react';
import { useLocalSearchParams } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { FlatList, useColorScheme, View } from 'react-native';
import Colors from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { Avatar } from '~/features/common/components/avatar';
import { useMessage } from '~/hooks/use-message';
import { EmptyText } from './EmptyText';
import { HStack } from './HStack';
import { CustomPressable } from './Ui/CustomPressable';
import { MyText } from './Ui/MyText';
import VStack from './Ui/VStack';
import { changeFirstLetterToUpperCase } from '~/lib/utils';

export const FetchTeamMembers = (): JSX.Element => {
  const { workspaceId } = useLocalSearchParams<{
    workspaceId: Id<'workspaces'>;
  }>();
  const teams = useQuery(api.organisation.getTeamMembers, { workspaceId });

  if (!workspaceId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <EmptyText text="You are not a member of any organization" />
      </View>
    );
  }

  const members = teams?.workers.filter(
    (member) => member.userId !== teams?.boss?._id,
  );

  return (
    <View>
      <FlatList
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <Member
            user={{
              name: teams?.boss?.name || 'No Boss',
              image: teams?.boss?.image || null,
              id: teams?.boss?.userId || '',
            }}
            isAdmin
          />
        )}
        ListEmptyComponent={<EmptyText text="No team members yet" />}
        contentContainerStyle={{ paddingBottom: 100, gap: 20, marginTop: 10 }}
        keyExtractor={(item, i) => item?.user?._id || i.toString()}
        data={members}
        renderItem={({ item }) => (
          <Member
            user={{
              name: item?.user?.name || 'No Name',
              image: item?.user?.image || null,
              id: item?.user?.userId || '',
              role: item?.role || 'N/A',
            }}
          />
        )}
      />
    </View>
  );
};

type Props = {
  user: {
    name: string | null;
    image: string | null;
    id: string;
    role?: string;
  };
  isAdmin?: boolean;
};

const Member = ({ user, isAdmin }: Props) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;
  const { user: loggedInUser } = useAuth();
  const { onMessage } = useMessage();
  const type = user.role === 'processor' ? 'processor' : 'single';
  const onChat = () => {
    onMessage(user.id, type);
  };

  const isLoggedInUser = loggedInUser?.id === user.id;

  return (
    <HStack justifyContent={'space-between'} alignItems={'center'}>
      <HStack alignItems={'center'} gap={4}>
        <Avatar url={user.image!} size={50} />
        <VStack>
          <MyText poppins={'Medium'} fontSize={14}>
            {user.name}
          </MyText>

          <MyText
            poppins={'Medium'}
            fontSize={14}
            style={{ color: isAdmin ? 'green' : color }}
          >
            {changeFirstLetterToUpperCase(user.role || 'Admin')}
          </MyText>
        </VStack>
      </HStack>
      {!isLoggedInUser && (
        <HStack alignItems={'center'} gap={2}>
          <CustomPressable onPress={onChat}>
            <Mail size={24} color={color} />
          </CustomPressable>
        </HStack>
      )}
    </HStack>
  );
};
