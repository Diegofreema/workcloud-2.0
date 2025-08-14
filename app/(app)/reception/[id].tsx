import { FontAwesome6 } from '@expo/vector-icons';
import { Avatar } from '@rneui/themed';
import { useConvex, useMutation, useQuery } from 'convex/react';
import { format } from 'date-fns';
import { Image } from 'expo-image';
import {
  ErrorBoundaryProps,
  router,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { toast } from 'sonner-native';

import { EmptyText } from '~/components/EmptyText';
import { HStack } from '~/components/HStack';
import { HeaderNav } from '~/components/HeaderNav';
import { Review } from '~/components/Review';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { WorkerWithWorkspace } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useWaitlistId } from '~/hooks/useWaitlistId';
import { convexPushNotificationsHelper } from '~/lib/utils';

export function ErrorBoundary({ retry, error }: ErrorBoundaryProps) {
  return <ErrorComponent refetch={retry} text={error.message} />;
}

const Reception = () => {
  const { id } = useLocalSearchParams<{ id: Id<'organizations'> }>();
  const { id: from } = useGetUserId();
  const data = useQuery(api.organisation.getOrganisationsWithPostAndWorkers, {
    id,
  });

  const handleConnection = useMutation(api.connection.handleConnection);

  const { width } = useWindowDimensions();
  const isWorker = useMemo(() => {
    if (!data) return false;
    const index = data.workers.findIndex((w) => w?.user?._id === from);
    return index > -1;
  }, [data, from]);
  const isBoss = useMemo(() => {
    if (!data) return true;
    return data?.ownerId === from;
  }, [data, from]);
  // ? useEffect for creating connections
  useEffect(() => {
    if (!id || !from || isBoss || isWorker) return;

    const onConnect = async () => {
      try {
        await handleConnection({
          connectedAt: format(Date.now(), 'dd/MM/yyyy, HH:mm:ss'),
          from,
          to: id,
        });
      } catch (e) {
        console.error('Connection error:', e);
      }
    };

    onConnect().catch(console.log);
  }, [id, isBoss, isWorker, from, handleConnection]);

  if (!data) {
    return <LoadingComponent />;
  }

  const day1 = data?.workDays?.split('-')[0] || '';
  const day2 = data?.workDays?.split('-')[1] || '';
  const finalDay1 = day1.charAt(0).toUpperCase() + day1.slice(1);
  const finalDay2 = day2.charAt(0).toUpperCase() + day2.slice(1);

  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        style={{ flex: 1 }}
      >
        <HeaderNav
          title={data?.name}
          subTitle={data?.category}
          rightComponent={<ReceptionRightHeader />}
        />
        <HStack gap={10} alignItems="center" my={10}>
          <Avatar rounded source={{ uri: data?.avatar! }} size={50} />
          <VStack>
            <MyText poppins="Medium" style={{ color: colors.nine }}>
              Opening hours:
            </MyText>

            <HStack gap={20} mb={10} alignItems="center">
              <MyText poppins="Medium">
                {finalDay1} - {finalDay2}
              </MyText>
              <HStack alignItems="center">
                <View style={styles.subCon}>
                  <MyText
                    poppins="Bold"
                    style={{
                      color: colors.openBackgroundColor,
                    }}
                  >
                    {data?.start}
                  </MyText>
                </View>
                <Text style={{ marginBottom: 5 }}> - </Text>
                <View
                  style={[
                    styles.subCon,
                    { backgroundColor: colors.closeBackgroundColor },
                  ]}
                >
                  <MyText
                    poppins="Bold"
                    style={{
                      color: colors.closeTextColor,
                    }}
                  >
                    {data?.end}
                  </MyText>
                </View>
              </HStack>
            </HStack>
          </VStack>
        </HStack>

        <View>
          {data?.posts?.length > 0 && (
            <Carousel
              loop
              width={width - 20}
              height={200}
              autoPlay
              data={data?.posts}
              scrollAnimationDuration={1500}
              renderItem={({ item }) => (
                <View
                  style={{
                    width: width * 0.98,
                    height: 200,
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    contentFit="cover"
                    placeholder={require('~/assets/images/pl.png')}
                    placeholderContentFit="cover"
                  />
                </View>
              )}
              vertical={false}
            />
          )}
        </View>
        <MyText
          poppins="Bold"
          style={{
            fontSize: 12,
            marginVertical: 20,
          }}
        >
          Representatives
        </MyText>
        <Representatives data={data?.workers} />
        <Review organizationId={id} showComments scroll hide />
      </ScrollView>
    </Container>
  );
};

export default Reception;
const styles = StyleSheet.create({
  subCon: {
    paddingHorizontal: 7,
    borderRadius: 3,
    backgroundColor: colors.openTextColor,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
});

const Representatives = ({ data }: { data: WorkerWithWorkspace[] }) => {
  return (
    <FlatList
      scrollEnabled={false}
      data={data}
      contentContainerStyle={{
        paddingBottom: 30,
        gap: 15,
        flexGrow: 1,
      }}
      renderItem={({ item }) => <RepresentativeItem item={item} />}
      ListEmptyComponent={() => (
        <VStack style={{ minHeight: 200, justifyContent: 'center' }}>
          <EmptyText text="No representatives yet" />
        </VStack>
      )}
      columnWrapperStyle={{ gap: 5 }}
      numColumns={3}
    />
  );
};

const RepresentativeItem = ({ item }: { item: WorkerWithWorkspace }) => {
  const router = useRouter();
  const convex = useConvex();
  const [notifId, setNotifId] = useState<string | null>(null);
  const notificationState = useQuery(
    api.pushNotification.getNotificationStatus,
    notifId ? { id: notifId } : 'skip'
  );
  // const { user: storedUser } = useAuth();
  // const { client } = useChatContext();
  const { id: customerId } = useGetUserId();
  const handleWaitlist = useMutation(api.workspace.handleWaitlist);
  const { setId } = useWaitlistId();
  const { workspace, user } = item;

  const handlePress = async () => {
    if (!customerId || customerId === item?.user?._id || !item.user?._id)
      return;
    if (!workspace?.active || workspace?.leisure) {
      toast.info('This workspace is currently inactive or on leisure', {
        description: 'Please try joining another workspace',
      });
      return;
    }
    if (notificationState) {
      toast.info('Notification state', {
        description: notificationState,
      });
    }
    try {
      const waitlistId = await handleWaitlist({
        customerId: customerId!,
        workspaceId: workspace._id,
        joinedAt: format(Date.now(), 'dd/MM/yyyy, HH:mm:ss'),
      });
      const notification = await convexPushNotificationsHelper(convex, {
        title: user?.name!,
        body: 'Joined your workspace',
        to: item.user?._id,
        data: { workkspaceId: item?.workspace?._id!, type: 'workspace' },
      });
      setNotifId(notification as string);
      if (waitlistId) {
        setId(waitlistId, false);
      }
      toast.success('Welcome', {
        description: 'Please be in a quite environment',
      });
      router.push(`/wk/${item?.workspace?._id}`);
    } catch (error) {
      console.log(error);
      toast.error('An Error occurred', {
        description: 'Failed to join workspace, please try again later',
      });
    }
  };

  const onMessage = async () => {
    router.push(`/chat/${item.user?._id}?type=single`);
  };

  return (
    <Pressable
      style={({ pressed }) => [
        {
          opacity: pressed ? 0.5 : 1,
          marginBottom: 10,

          width: '33%',
        },
      ]}
      onPress={handlePress}
    >
      <VStack alignItems="center" justifyContent="center" gap={2}>
        <Avatar rounded source={{ uri: item?.user?.image! }} size={50} />
        <MyText poppins="Medium" fontSize={11} style={{ textAlign: 'center' }}>
          {item?.role}
        </MyText>

        {item?.workspace &&
          item?.workspace?.active &&
          !item?.workspace?.leisure && (
            <View
              style={{
                backgroundColor: colors.openTextColor,
                borderRadius: 20,
                alignItems: 'center',
                justifyContent: 'center',
                padding: 3,
              }}
            >
              <MyText
                poppins="Bold"
                style={{ color: colors.openBackgroundColor }}
              >
                Active
              </MyText>
            </View>
          )}
        {item?.workspace &&
          (!item?.workspace?.active || item?.workspace?.leisure) && (
            <>
              <View
                style={{
                  backgroundColor: colors.closeBackgroundColor,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 3,
                }}
              >
                <MyText poppins="Bold" style={{ color: colors.closeTextColor }}>
                  {!item?.workspace?.active ? 'Inactive' : 'Leisure'}
                </MyText>
              </View>

              {item?.user?._id !== customerId && (
                <Pressable
                  onPress={onMessage}
                  style={{
                    backgroundColor: '#C0D1FE',
                    padding: 7,
                    marginTop: 5,
                    borderRadius: 5,
                  }}
                >
                  <MyText poppins="Medium" style={{ color: colors.dialPad }}>
                    Message
                  </MyText>
                </Pressable>
              )}
            </>
          )}
      </VStack>
    </Pressable>
  );
};

const ReceptionRightHeader = () => {
  const { darkMode } = useDarkMode();
  const { id } = useLocalSearchParams<{ id: string }>();
  return (
    <Pressable
      style={({ pressed }) => ({ padding: 5, opacity: pressed ? 0.5 : 1 })}
      onPress={() => router.push(`/overview/${id}`)}
    >
      <FontAwesome6
        name="building-columns"
        size={24}
        color={darkMode === 'dark' ? colors.white : colors.black}
      />
    </Pressable>
  );
};
