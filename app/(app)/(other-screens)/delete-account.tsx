import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { DeleteForm } from '~/components/Forms/delete-form';
import { HeaderNav } from '~/components/HeaderNav';
import { Container } from '~/components/Ui/Container';

const DeleteAccountScreen = () => {
  return (
    <Container>
      <HeaderNav title="Delete Account" />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <DeleteForm />
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default DeleteAccountScreen;
