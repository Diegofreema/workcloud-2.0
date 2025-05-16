import React from 'react';

import { AuthTitle } from '~/components/AuthTitle';
import { Container } from '~/components/Ui/Container';
import { MyButton } from '~/components/Ui/MyButton';

export const ConvexError = ({ retry }: { retry: () => void }) => {
  return (
    <Container style={{ gap: 5, justifyContent: 'center', alignItems: 'center' }}>
      <AuthTitle>Something went wrong</AuthTitle>
      <MyButton onPress={retry} buttonStyle={{ width: 200 }}>
        Retry
      </MyButton>
    </Container>
  );
};
