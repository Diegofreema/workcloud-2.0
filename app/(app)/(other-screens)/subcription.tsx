import React from 'react';
import { HeaderNav } from '~/components/HeaderNav';
import { Plans } from '~/components/plans';
import { Container } from '~/components/Ui/Container';

const SubscriptionScreen = () => {
  return (
    <Container>
      <HeaderNav title={'Chose your plan'} />
      <Plans />
    </Container>
  );
};

export default SubscriptionScreen;
