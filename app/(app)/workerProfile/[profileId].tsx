import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from '@expo/vector-icons';
import { Button } from '@rneui/themed';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
// import { useChatContext } from 'stream-chat-expo';
import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import { UserPreview } from '~/components/Ui/UserPreview';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { Id } from '~/convex/_generated/dataModel';
import { useWorkerActions } from '~/features/staff/hooks/use-worker-actions';
import { useTheme } from '~/hooks/use-theme';
import { useGetUserId } from '~/hooks/useGetUserId';

const Profile = () => {
  const { profileId } = useLocalSearchParams<{ profileId: Id<'workers'> }>();

  // const { user } = useAuth();
  const { user } = useGetUserId();
  const { theme: darkMode } = useTheme();

  const {
    isPending,
    pendingData,
    data,
    isInPending,
    cancelling,
    handleRequest,
    onMessage,
  } = useWorkerActions({ profileId });

  if (isPending) {
    return <LoadingComponent />;
  }

  const showRequestBtn =
    data?.worker.bossId !== user?.id && pendingData?.status !== 'pending';

  return (
    <Container>
      <ScrollView>
        <HeaderNav title="Profile" />
        <View style={{ marginTop: 10, marginBottom: 20 }}>
          <UserPreview
            imageUrl={data?.user?.image!}
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

export const formattedSkills = (text: string) => {
  const arrayOfSkills = text?.split(',');

  return arrayOfSkills?.map((skill, index) => (
    <MyText poppins="Bold" key={index} style={{ color: colors.nine }}>
      {skill}
    </MyText>
  ));
};
