import { useAction } from 'convex/react';
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { FreeCard } from '~/features/payment/components/free';
import { SubscribedCard } from '~/features/payment/components/subcribed';
import { useGetCustomer } from '~/features/payment/hooks/use-get-customer';

const ManageSubscriptionScreen = () => {
  const {
    data: subscriptionData,
    isPending,
    isError,
    error,
  } = useGetCustomer();

  if (isPending) {
    return (
      <Container>
        <HeaderNav title={'Manage Subscription'} />
        <LoadingComponent />
      </Container>
    );
  }
  if (isError) {
    throw new Error(error?.message || 'Something went wrong');
  }

  const {
    customer: { activeSubscriptions },
    subscription: subscriptionInfo,
  } = subscriptionData;
  const isFree = activeSubscriptions.length === 0;

  return (
    <Container>
      <HeaderNav title={'Manage Subscription'} />
      {isFree ? (
        <FreeCard />
      ) : (
        <SubscribedCard subscriptionInfo={subscriptionInfo} />
      )}
    </Container>
  );
};

export default ManageSubscriptionScreen;
