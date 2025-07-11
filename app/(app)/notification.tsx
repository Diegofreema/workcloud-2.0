import React from 'react';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';
import { FetchNotifications } from '~/features/notification/components/fetch-notifications';

const NotificationScreen = () => {
  return (
    <Container>
      <HeaderNav title="Notifications" />
      <FetchNotifications />
    </Container>
  );
};

export default NotificationScreen;
