import { Subscription } from '@polar-sh/sdk/models/components/subscription.js';
import { format } from 'date-fns';
import { View } from 'react-native';
import { MyText } from '~/components/Ui/MyText';
import { colors } from '~/constants/Colors';

type Props = {
  subscriptionInfo: Subscription;
};

export const CurrentMode = ({ subscriptionInfo }: Props): JSX.Element => {
  const isOnTrial = subscriptionInfo?.status === 'trialing';

  return (
    <View>
      <MyText
        poppins={'Light'}
        fontSize={13}
        style={{ textAlign: 'center', color: colors.gray10 }}
      >
        {subscriptionInfo?.recurringInterval === 'year'
          ? 'Billed Annually'
          : 'Billed Monthly'}
      </MyText>
      {isOnTrial && (
        <View>
          {subscriptionInfo?.trialStart && (
            <MyText
              poppins={'Light'}
              fontSize={13}
              style={{ textAlign: 'center', color: colors.gray10 }}
            >
              Free trial started on:{' '}
              {format(subscriptionInfo?.trialStart, 'PP')}
            </MyText>
          )}
          {subscriptionInfo?.trialEnd && (
            <MyText
              poppins={'Light'}
              fontSize={13}
              style={{ textAlign: 'center', color: colors.gray10 }}
            >
              Free trial ends on: {format(subscriptionInfo?.trialEnd, 'PP')}
            </MyText>
          )}
        </View>
      )}
      {!isOnTrial && (
        <View>
          {subscriptionInfo?.currentPeriodStart && (
            <MyText
              poppins={'Light'}
              fontSize={13}
              style={{ textAlign: 'center', color: colors.gray10 }}
            >
              Current period started on:{' '}
              {format(subscriptionInfo?.currentPeriodStart, 'PP')}
            </MyText>
          )}
          {subscriptionInfo?.currentPeriodEnd && (
            <MyText
              poppins={'Light'}
              fontSize={13}
              style={{ textAlign: 'center', color: colors.gray10 }}
            >
              Current period ends on:{' '}
              {format(subscriptionInfo?.currentPeriodEnd, 'PP')}
            </MyText>
          )}
        </View>
      )}
    </View>
  );
};
