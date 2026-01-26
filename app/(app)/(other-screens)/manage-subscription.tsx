import React from 'react';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { FreeCard } from '~/features/payment/components/free';
import { SubscribedCard } from '~/features/payment/components/subcribed';
import { useGetCustomer } from '~/features/payment/hooks/use-get-customer';

const ManageSubscriptionScreen = () => {
  const { data: subscriptionData, isPending, isError } = useGetCustomer();

  if (isPending) {
    return (
      <Container>
        <HeaderNav title={'Manage Subscription'} />
        <LoadingComponent />
      </Container>
    );
  }

  if (isError || !subscriptionData?.customer?.activeSubscriptions?.length) {
    return (
      <Container>
        <HeaderNav title={'Manage Subscription'} />
        <FreeCard />
      </Container>
    );
  }

  const {
    customer: { activeSubscriptions },
    subscription: subscriptionInfo,
  } = subscriptionData;
  const isFree = activeSubscriptions?.length === 0;

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
