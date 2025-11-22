import { useAction, useQuery } from 'convex/react';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';
import { Button } from '~/features/common/components/Button';

const ManageSubscriptionScreen = () => {
  const data = useQuery(api.users.getSubscriptions);
  const [loadingPortal, setLoadingPortal] = useState(false);
  const [loadingCancel, setLoadingCancel] = useState(false);

  const cancelSubscription = useAction(api.polar.cancelCurrentSubscription);

  if (data === undefined) {
    return (
      <Container>
        <HeaderNav title={'Manage Subscription'} />
        <LoadingComponent />
      </Container>
    );
  }

  const onCancelSubscription = async () => {
    setLoadingCancel(true);
    try {
      await cancelSubscription({ revokeImmediately: true });
    } finally {
      setLoadingCancel(false);
    }
  };

  const onAlertCancelSubscription = () => {
    Alert.alert(
      'Cancel Subscription',
      'Are you sure you want to cancel your subscription?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: onCancelSubscription,
        },
      ],
      { cancelable: true }
    );
  };
  const { subscription, isFree } = data;

  const onOpenPortal = async () => {
    setLoadingPortal(true);
    try {
    } finally {
      setLoadingPortal(false);
    }
  };

  return (
    <Container>
      <HeaderNav title={'Manage Subscription'} />
      {isFree || !subscription ? (
        <VStack
          p={20}
          mx={20}
          rounded={10}
          borderWidth={1}
          borderColor={colors.gray}
          gap={10}
        >
          <MyText
            poppins={'Bold'}
            fontSize={16}
            style={{ textAlign: 'center' }}
          >
            No active subscription
          </MyText>
          <MyText
            poppins={'Light'}
            fontSize={13}
            style={{ textAlign: 'center', color: colors.gray10 }}
          >
            Subscribe to a plan to unlock premium features.
          </MyText>
          <Button
            title={'Choose a plan'}
            onPress={() => router.push('/subcription')}
            style={{ marginTop: 8, backgroundColor: colors.dialPad }}
          />
        </VStack>
      ) : (
        <VStack
          p={20}
          mx={20}
          rounded={10}
          borderWidth={1}
          borderColor={colors.gray}
          gap={12}
        >
          <MyText
            poppins={'Bold'}
            fontSize={16}
            style={{ textAlign: 'center' }}
          >
            {subscription.product.name ?? 'Subscription'}
          </MyText>
          <MyText
            poppins={'Light'}
            fontSize={13}
            style={{ textAlign: 'center', color: colors.gray10 }}
          >
            {subscription?.recurringInterval === 'year'
              ? 'Billed Annually'
              : 'Billed Monthly'}
          </MyText>
          <MyText
            poppins={'Light'}
            fontSize={13}
            style={{ textAlign: 'center', color: colors.gray10 }}
          >
            Status: {subscription.status ?? 'active'}
          </MyText>
          <Button
            title={'Manage in Portal'}
            onPress={onOpenPortal}
            loading={loadingPortal}
            loadingTitle={'Opening...'}
            style={{ backgroundColor: colors.dialPad }}
          />
          <Button
            title={'Cancel Subscription'}
            onPress={onAlertCancelSubscription}
            loading={loadingCancel}
            loadingTitle={'Cancelling...'}
            style={{ backgroundColor: colors.lightBlueButton }}
            textStyle={{ color: colors.black }}
          />
        </VStack>
      )}
    </Container>
  );
};

export default ManageSubscriptionScreen;
