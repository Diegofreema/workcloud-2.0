import { router, useRouter } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { HStack } from '../HStack';
import { MyText } from '../Ui/MyText';
import { UserPreview } from '../Ui/UserPreview';

import { colors } from '~/constants/Colors';
import { ThemedView } from '../Ui/themed-view';
import { useTheme } from '~/hooks/use-theme';
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';
import { CustomPressable } from '~/components/Ui/CustomPressable';
import { useGetUserId } from '~/hooks/useGetUserId';
import { useGetCustomer } from '~/features/payment/hooks/use-get-customer';
import { format } from 'date-fns';

type Props = {
  id?: string;
  image?: string;
  name?: string | null;
};

export const TopCard = ({ image, name, id }: Props): JSX.Element => {
  const router = useRouter();
  const { organizationId } = useGetUserId();
  const { theme: darkMode } = useTheme();
  const onEditProfile = () => {
    router.push(`/edit-new?id=${id}`);
  };
  return (
    <ThemedView
      style={{
        marginBottom: 20,
      }}
    >
      <ThemedView style={[styles.absolute]} />
      <ThemedView
        style={[
          styles.topCard,
          {
            shadowColor: darkMode === 'dark' ? '#fff' : '#000',
          },
        ]}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <UserPreview imageUrl={image} name={name!} id={id} />
          <Pressable
            style={{
              backgroundColor: colors.dialPad,
              padding: 10,
              borderRadius: 5,
            }}
            onPress={onEditProfile}
          >
            <MyText poppins="Medium" fontSize={15} style={{ color: 'white' }}>
              Edit Profile
            </MyText>
          </Pressable>
        </HStack>
        {organizationId && <ProCard />}
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  topCard: {
    paddingHorizontal: 20,
    paddingTop: 10,

    paddingBottom: 20,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
  },
  absolute: {
    position: 'absolute',
    top: -5,
    right: 0,
    left: 0,
    width: '100%',
    height: 10,
    zIndex: 1,
  },
});

const ProCard = () => {
  const { data: subscriptionData, isPending, isError } = useGetCustomer();
  if (isPending) {
    return <></>;
  }
  const onPress = () => {
    router.push('/subcription');
  };
  if (isError) {
    return (
      <CustomPressable onPress={onPress}>
        <MyText
          poppins="Bold"
          fontSize={15}
          style={{ marginTop: 10, textAlign: 'center' }}
        >
          Upgrade to Pro for more features
        </MyText>
      </CustomPressable>
    );
  }

  const { customer, subscription: subscriptionInfo } = subscriptionData;
  const isPro = customer?.activeSubscriptions?.length > 0;

  const subscription = customer?.activeSubscriptions?.[0];

  if (!isPro || !subscription) {
    return (
      <CustomPressable onPress={onPress}>
        <MyText
          poppins="Bold"
          fontSize={15}
          style={{ marginTop: 10, textAlign: 'center' }}
        >
          Upgrade to Pro for more features
        </MyText>
      </CustomPressable>
    );
  }

  const planName = subscriptionInfo?.product?.name || 'Free trial';
  const expiresAt = subscriptionInfo?.endsAt;
  const subscribedAt = subscriptionInfo?.createdAt;

  return (
    <View style={{ marginTop: 10, alignItems: 'center', gap: 5 }}>
      <MyText
        poppins="Medium"
        fontSize={13}
        style={{ marginTop: 10, textAlign: 'center' }}
      >
        Plan: {planName}
      </MyText>
      {subscribedAt && (
        <MyText poppins="LightItalic" fontSize={13}>
          Subscribed At: {format(subscribedAt, 'PP')}
        </MyText>
      )}
      {expiresAt && (
        <MyText poppins="LightItalic" fontSize={13}>
          Expires At: {format(expiresAt, 'PP')}
        </MyText>
      )}
    </View>
  );
};
