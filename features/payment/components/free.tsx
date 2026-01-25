/* eslint-disable prettier/prettier */

import { router } from 'expo-router';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { Button } from '~/features/common/components/Button';

type Props = {};

export const FreeCard = ({}: Props): JSX.Element => {
  return (
    <VStack
      p={20}
      mx={20}
      rounded={10}
      borderWidth={1}
      borderColor={colors.gray}
      gap={10}
    >
      <MyText poppins={'Bold'} fontSize={16} style={{ textAlign: 'center' }}>
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
  );
};
