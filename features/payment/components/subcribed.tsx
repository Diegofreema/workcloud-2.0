import { Subscription } from '@polar-sh/sdk/models/components/subscription.js';
import { Alert } from 'react-native';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { Button } from '~/features/common/components/Button';
import { useCancelSubscription } from '../hooks/use-cancel-subcription';

type Props = {
  subscriptionInfo: Subscription;
};
export const SubscribedCard = ({ subscriptionInfo }: Props) => {
  const { mutateAsync: cancelSubscription, isPending: loadingCancel } =
    useCancelSubscription();
  const onCancelSubscription = async () => {};

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
      { cancelable: true },
    );
  };
  return (
    <VStack
      p={20}
      mx={20}
      rounded={10}
      borderWidth={1}
      borderColor={colors.gray}
      gap={5}
    >
      <MyText poppins={'Bold'} fontSize={16} style={{ textAlign: 'center' }}>
        {subscriptionInfo.product.name ?? 'Subscription'}
      </MyText>
      <MyText
        poppins={'Light'}
        fontSize={13}
        style={{ textAlign: 'center', color: colors.gray10 }}
      >
        {subscriptionInfo?.recurringInterval === 'year'
          ? 'Billed Annually'
          : 'Billed Monthly'}
      </MyText>
      <MyText
        poppins={'Light'}
        fontSize={13}
        style={{ textAlign: 'center', color: colors.gray10 }}
      >
        Status: {subscriptionInfo.status ?? 'active'}
      </MyText>

      <Button
        title={'Cancel Subscription'}
        onPress={onAlertCancelSubscription}
        loading={loadingCancel}
        loadingTitle={'Cancelling...'}
        style={{ backgroundColor: colors.lightBlueButton }}
        textStyle={{ color: colors.black }}
      />
    </VStack>
  );
};
