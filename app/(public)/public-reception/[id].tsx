import { FontAwesome6 } from '@expo/vector-icons';
import { Avatar } from '@rneui/themed';
import { useQuery } from 'convex/react';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
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
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { WorkerWithWorkspace } from '~/constants/types';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useTheme } from '~/hooks/use-theme';

/** Redirect unauthenticated users to login, preserving the return destination. */
const redirectToLogin = (orgId: string, page: 'reception' | 'overview') => {
  router.push(`/login?redirect=${page}&orgId=${orgId}`);
};

const PublicReception = () => {
  const { id } = useLocalSearchParams<{ id: Id<'organizations'> }>();
  const { theme: darkMode } = useTheme();
  const { width } = useWindowDimensions();

  const data = useQuery(api.organisation.getOrganisationsWithPostAndWorkers, {
    id,
  });

  if (data === undefined) return <LoadingComponent />;

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
          rightComponent={
            <Pressable
              style={({ pressed }) => ({
                padding: 5,
                opacity: pressed ? 0.5 : 1,
              })}
              onPress={() => router.push(`/public-overview/${id}`)}
            >
              <FontAwesome6
                name="building-columns"
                size={24}
                color={darkMode === 'dark' ? colors.white : colors.black}
              />
            </Pressable>
          }
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
                    style={{ color: colors.openBackgroundColor }}
                  >
                    {data?.start}
                  </MyText>
                </View>
                <Text
                  style={{
                    marginBottom: 5,
                    color: darkMode === 'dark' ? colors.white : colors.black,
                  }}
                >
                  {' '}
                  -{' '}
                </Text>
                <View
                  style={[
                    styles.subCon,
                    { backgroundColor: colors.closeBackgroundColor },
                  ]}
                >
                  <MyText
                    poppins="Bold"
                    style={{ color: colors.closeTextColor }}
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

        <MyText poppins="Bold" style={{ fontSize: 12, marginVertical: 20 }}>
          Representatives
        </MyText>

        <PublicRepresentatives data={data?.workers} orgId={id} />

        <Review organizationId={id} showComments scroll hide />
      </ScrollView>
    </Container>
  );
};

export default PublicReception;

// ─── Sub-components ──────────────────────────────────────────────────────────

type RepresentativesProps = {
  data: WorkerWithWorkspace[];
  orgId: string;
};

const PublicRepresentatives = ({ data, orgId }: RepresentativesProps) => (
  <FlatList
    scrollEnabled={false}
    data={data}
    contentContainerStyle={{ paddingBottom: 30, gap: 15, flexGrow: 1 }}
    renderItem={({ item }) => (
      <PublicRepresentativeItem item={item} orgId={orgId} />
    )}
    ListEmptyComponent={() => (
      <VStack style={{ minHeight: 200, justifyContent: 'center' }}>
        <EmptyText text="No representatives yet" />
      </VStack>
    )}
    columnWrapperStyle={{ gap: 5 }}
    numColumns={3}
  />
);

type RepItemProps = {
  item: WorkerWithWorkspace;
  orgId: string;
};

const PublicRepresentativeItem = ({ item, orgId }: RepItemProps) => {
  const isActive = item?.workspace?.active && !item?.workspace?.leisure;
  const isInactive = !item?.workspace?.active || item?.workspace?.leisure;

  const handleJoinPress = () => {
    if (!item?.workspace?.active || item?.workspace?.leisure) {
      toast.info('This workspace is currently inactive or on leisure', {
        description: 'Please try joining another workspace',
      });
      return;
    }
    redirectToLogin(orgId, 'reception');
  };

  const handleMessagePress = () => {
    redirectToLogin(orgId, 'reception');
  };

  return (
    <Pressable
      style={({ pressed }) => [
        { opacity: pressed ? 0.5 : 1, marginBottom: 10, width: '33%' },
      ]}
      onPress={handleJoinPress}
    >
      <VStack alignItems="center" justifyContent="center" gap={2}>
        <Avatar rounded source={{ uri: item?.user?.image! }} size={50} />
        <MyText poppins="Medium" fontSize={11} style={{ textAlign: 'center' }}>
          {item?.role}
        </MyText>

        {item?.workspace && isActive && (
          <View style={styles.activeBadge}>
            <MyText
              poppins="Bold"
              style={{ color: colors.openBackgroundColor }}
            >
              Active
            </MyText>
          </View>
        )}

        {item?.workspace && isInactive && (
          <>
            <View style={styles.inactiveBadge}>
              <MyText poppins="Bold" style={{ color: colors.closeTextColor }}>
                {!item?.workspace?.active ? 'Inactive' : 'Leisure'}
              </MyText>
            </View>
            <Pressable onPress={handleMessagePress} style={styles.messageBtn}>
              <MyText poppins="Medium" style={{ color: colors.dialPad }}>
                Message
              </MyText>
            </Pressable>
          </>
        )}
      </VStack>
    </Pressable>
  );
};

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
  activeBadge: {
    backgroundColor: colors.openTextColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  inactiveBadge: {
    backgroundColor: colors.closeBackgroundColor,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  messageBtn: {
    backgroundColor: '#C0D1FE',
    padding: 7,
    marginTop: 5,
    borderRadius: 5,
  },
});
