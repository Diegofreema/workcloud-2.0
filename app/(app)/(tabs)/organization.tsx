import { convexQuery } from '@convex-dev/react-query';
import { EvilIcons, FontAwesome } from '@expo/vector-icons';
import { Avatar } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { toast } from 'sonner-native';

import { EmptyText } from '~/components/EmptyText';
import { HStack } from '~/components/HStack';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { WorkCloudHeader } from '~/components/WorkCloudHeader';
import { WorkspaceItem } from '~/components/WorkspaceItem';
import { colors } from '~/constants/Colors';
import { WorkSpace } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';

const Organization = () => {
  const { id, worker } = useGetUserId();
  const { data, isPending, isError, refetch, error } = useQuery(
    convexQuery(api.organisation.getOrganisationsOrNull, { ownerId: id! })
  );
  const { darkMode } = useDarkMode();
  const {
    data: workspace,
    isPending: isPendingWorkspace,
    isError: isErrorWorkspace,
    refetch: refetchWorkspace,
    error: errorWorkspace,
  } = useQuery(
    convexQuery(api.workspace.getUserWorkspaceOrNull, { workerId: worker! })
  );

  const handleRefetch = async () => {
    await refetch();
    await refetchWorkspace();
  };

  console.log({ error, errorWorkspace });
  if (isError || isErrorWorkspace) {
    return <ErrorComponent refetch={handleRefetch} />;
  }
  if (isPending || isPendingWorkspace) {
    return <LoadingComponent />;
  }

  return (
    <Container>
      <View style={[{ flexDirection: 'row', justifyContent: 'space-between' }]}>
        <MyText style={{ fontSize: 15 }} poppins="Medium">
          Organization
        </MyText>
        <Pressable
          onPress={() => router.push('/search')}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          <EvilIcons
            name="search"
            size={30}
            color={darkMode === 'dark' ? colors.white : colors.black}
          />
        </Pressable>
      </View>
      <View style={{ marginVertical: 14 }}>
        {!data?._id ? (
          <WorkCloudHeader />
        ) : (
          <View style={{ gap: 15 }}>
            <WorkspaceItem item={data} onPress={() => router.push(`/my-org`)} />
          </View>
        )}
      </View>

      <View style={{ marginTop: !data ? 20 : 0 }}>
        <MyText
          style={{
            fontSize: 13,
          }}
          poppins="Medium"
        >
          Assigned workspace
        </MyText>

        {workspace?._id ? (
          // @ts-ignore
          <Workspace item={workspace} />
        ) : (
          <EmptyText text="No assigned workspace yet" />
        )}
      </View>
    </Container>
  );
};

export default Organization;

const Workspace = ({ item }: { item: WorkSpace }) => {
  const handlePress = () => {
    if (item?.locked) {
      toast('This workspace is locked', {
        description: 'Please wait till the admin unlocks it',
      });
      return;
    }
    router.push(`/wk/${item?._id}`);
  };

  // const imgUrl = item?.personal ? item?.ownerId?.avatar : item?.organizationId?.avatar;

  return (
    <Pressable
      onPress={handlePress}
      style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}
    >
      <HStack gap={10} alignItems="center">
        <Avatar
          rounded
          source={{ uri: item.organization?.avatar! }}
          size={50}
        />
        <VStack>
          <MyText poppins="Bold" style={{ fontSize: 13 }}>
            {item?.role}
          </MyText>
          <View
            style={{
              backgroundColor: item?.active
                ? colors.openTextColor
                : colors.closeBackgroundColor,
              paddingHorizontal: 2,
              borderRadius: 3,
              alignItems: 'center',
            }}
          >
            <MyText
              poppins="Light"
              style={{
                color: item?.active
                  ? colors.openBackgroundColor
                  : colors.closeTextColor,
              }}
            >
              {item?.active ? 'Active' : 'Not active'}
            </MyText>
          </View>
        </VStack>
      </HStack>

      {item?.locked && (
        <HStack
          gap={5}
          alignItems="center"
          bg={colors.closeBackgroundColor}
          px={5}
          rounded={6}
        >
          <FontAwesome name="lock" size={20} color={colors.closeTextColor} />
          <MyText poppins="Bold" style={{ color: colors.closeTextColor }}>
            Locked
          </MyText>
        </HStack>
      )}
    </Pressable>
  );
};
