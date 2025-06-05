import { useUser } from '@clerk/clerk-expo';
import { convexQuery } from '@convex-dev/react-query';
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { useQuery } from '@tanstack/react-query';
import { useMutation } from 'convex/react';
import { format } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { toast } from 'sonner-native';
// import { useChatContext } from 'stream-chat-expo';

import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';

export const formattedSkills = (text: string) => {
  const arrayOfSkills = text?.split(',');

  return arrayOfSkills?.map((skill, index) => (
    <MyText poppins="Bold" key={index} style={{ color: colors.nine }}>
      {skill}
    </MyText>
  ));
};

const Profile = () => {
  const { profileId } = useLocalSearchParams<{ profileId: Id<'workers'> }>();
  // const { client } = useChatContext();
  const { user } = useUser();
  const { id } = useGetUserId();
  const { darkMode } = useDarkMode();
  const [cancelling, setCancelling] = useState(false);

  const router = useRouter();
  const { data, isPaused, isPending, isError, refetch, isRefetchError } =
    useQuery(convexQuery(api.worker.getSingleWorkerProfile, { id: profileId }));

  const {
    data: pendingData,
    isPending: isPendingData,
    isError: isErrorData,
    isPaused: isPausedData,
    refetch: refetchData,
      error
  } = useQuery(
    convexQuery(api.request.getPendingRequestsAsBoolean, {
      from: id!,
      to: data?.user?._id!,
    })
  );
  const cancelPendingRequest = useMutation(api.request.cancelPendingRequests);
  const handleRefetch = async () => {
    await refetch();
    await refetchData();
  };
  if (isError || isRefetchError || isErrorData || isPaused || isPausedData) {
    return <ErrorComponent text={error?.message!} refetch={handleRefetch} />;
  }

  if (isPending || isPendingData) {
    return <LoadingComponent />;
  }

  const isInPending = !!pendingData;

  const onMessage = async () => {
    router.push(`/chat/${data?.user?._id}`)
  };

  const cancelRequest = async () => {
    setCancelling(true);
    if (!pendingData) return;
    try {
      await cancelPendingRequest({ id: pendingData._id });
    } catch (error) {
      console.log(error);

      toast.error('Something went wrong');
    } finally {
      setCancelling(false);
    }
  };

  const handleRequest = async () => {
    if (!isInPending) {
      router.push(`/completeRequest/${profileId}`);
      return;
    }

    await cancelRequest();
  };
  const showRequestBtn =
    data?.worker.bossId !== user?.id && !pendingData?.accepted;
  return (
    <Container>
      <ScrollView>
        <HeaderNav title="Profile" />
        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <UserPreview
            imageUrl={data?.user?.imageUrl!}
            name={data?.user?.name}
            roleText={data?.worker.role}
            workPlace={data?.organization?.name}
            personal
            profile
          />
        </View>

        <HStack gap={20} mt={20} mb={5}>
          {showRequestBtn && (
            <Button
              onPress={handleRequest}
              loading={cancelling}
              titleStyle={{ fontFamily: 'PoppinsMedium', fontSize: 12 }}
              buttonStyle={{
                backgroundColor: colors.dialPad,
                borderRadius: 5,
                minWidth: 120,
              }}
            >
              {isInPending ? 'Cancel Request' : 'Send Request'}
            </Button>
          )}

          <Button
            onPress={onMessage}
            loading={cancelling}
            titleStyle={{
              fontFamily: 'PoppinsMedium',
              color: 'blue',
              fontSize: 12,
            }}
            buttonStyle={{
              backgroundColor: colors.lightBlueButton,
              borderRadius: 5,
              minWidth: 120,
            }}
          >
            Send Message
          </Button>
        </HStack>

        <VStack mt={20} gap={15}>
          <HStack gap={5} alignItems="center">
            <AntDesign name="calendar" size={24} color={colors.grayText} />
            <MyText
              fontSize={12}
              poppins="Medium"
              style={{ color: colors.grayText }}
            >
              Joined since{' '}
              {format(data?.worker?._creationTime!, 'do MMMM yyyy')}
            </MyText>
          </HStack>
          <HStack gap={5} alignItems="center">
            <EvilIcons name="location" size={24} color={colors.grayText} />
            <MyText
              fontSize={12}
              poppins="Medium"
              style={{ color: colors.grayText }}
            >
              {data?.worker?.location}
            </MyText>
          </HStack>
        </VStack>

        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Qualifications
          </MyText>

          <HStack
            gap={10}
            alignItems="center"
            pb={40}
            style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
          >
            <SimpleLineIcons
              name="graduation"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <MyText poppins="Medium" fontSize={12}>
              {data?.worker?.qualifications}
            </MyText>
          </HStack>
        </VStack>
        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Experience and Specialization
          </MyText>

          <HStack
            gap={10}
            alignItems="center"
            pb={40}
            style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
          >
            <SimpleLineIcons
              name="graduation"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <MyText poppins="Medium" fontSize={12}>
              {data?.worker?.experience}
            </MyText>
          </HStack>
        </VStack>

        <VStack mt={20}>
          <MyText poppins="Bold" style={{ marginBottom: 10 }} fontSize={16}>
            Skills
          </MyText>

          <HStack
            gap={10}
            pb={40}
            style={{ borderBottomColor: colors.gray, borderBottomWidth: 1 }}
          >
            <MaterialCommunityIcons
              name="clipboard-list-outline"
              size={24}
              color={darkMode === 'dark' ? 'white' : 'black'}
            />
            <VStack gap={5}>
              {formattedSkills(data?.worker?.skills || '')}
            </VStack>
          </HStack>
        </VStack>
      </ScrollView>
    </Container>
  );
};

export default Profile;
