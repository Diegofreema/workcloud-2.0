import { Checkout } from '@polar-sh/sdk/models/components/checkout.js';
import axios from 'axios';
import { FunctionReturnType } from 'convex/server';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { toast } from 'sonner-native';
import { app_url } from '~/api';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import Colors, { colors } from '~/constants/Colors';
import { useAuth } from '~/context/auth';
import { api } from '~/convex/_generated/api';
import { Button } from '~/features/common/components/Button';
import Card from '~/features/common/components/card';

type OfferingCardProps = {
  product: FunctionReturnType<typeof api.polar.listAllProducts>[number];
  disabled?: boolean;
  isMonthly: boolean;
};
type ReturnType = {
  checkout: Checkout;
};

export const OfferingCard = ({
  product,
  disabled,
  isMonthly,
}: OfferingCardProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const billingInterval = isMonthly ? 'month' : 'year';
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;
  const price = getPrice(product, billingInterval);
  const isFree = !price || (price.priceAmount ?? 0) === 0;
  const onCheckOut = async () => {
    setLoading(true);
    try {
      const {
        data: { checkout },
      } = await axios.post<ReturnType>(
        `https://www.workcloud-backend.xyz/api/checkout`,
        {
          id: product.id,
          userId: user?.id,
        }
      );

      //
      await WebBrowser.openBrowserAsync(checkout.url);
      console.log('Status', checkout.status);
    } catch (e) {
      console.log(JSON.stringify(e, null, 2));
      toast.error('Error', {
        description: 'Failed to subscribe',
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Card
      style={{
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: isFree ? colors.gray : color,
        borderRadius: 8,
      }}
    >
      <VStack>
        <MyText
          poppins={'Medium'}
          fontSize={15}
          style={{ textAlign: 'center' }}
        >
          {product.name}
        </MyText>
        <MyText
          poppins={'Medium'}
          fontSize={16}
          style={{ textAlign: 'center' }}
        >
          {isFree
            ? 'Free'
            : `${formatAmount(price!.priceAmount ?? 0, price!.priceCurrency ?? 'USD')} ${billingInterval === 'month' ? 'Monthly' : 'Annually'}`}
        </MyText>
        <MyText
          poppins={'Light'}
          fontSize={12}
          style={{ textAlign: 'center', color: colors.gray10 }}
        >
          {product.description}
        </MyText>
        <Button
          title={'Activate'}
          onPress={onCheckOut}
          style={{
            marginTop: 12,
            backgroundColor: colors.dialPad,
          }}
          disabled={disabled || loading}
          loading={loading}
          loadingTitle={'Processing...'}
        />
      </VStack>
    </Card>
  );
};

function formatAmount(amount: number, currency: string) {
  const upper = (currency || 'USD').toUpperCase();
  const value = amount >= 100 ? amount / 100 : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: upper,
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0,
  }).format(value);
}
type Interval = 'month' | 'year';
function getPrice(
  product: FunctionReturnType<typeof api.polar.listAllProducts>[number],
  interval: Interval
) {
  return product.prices?.find((p) => p.recurringInterval === interval);
}
