import React from 'react';
import { View } from 'react-native';
import { Container } from '~/components/Ui/Container';
import { MyText } from '~/components/Ui/MyText';

export const MessageEmpty = () => {
  return (
    <Container>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <MyText poppins="Bold" fontSize={24}>
          No messages yet
        </MyText>
        <MyText poppins="Light" fontSize={16}>
          Your messages will be found here!!
        </MyText>
      </View>
    </Container>
  );
};
