import { useState } from 'react';
import { FlatList, View } from 'react-native';

import { colors } from '~/constants/Colors';
import { LoadingComponent } from './Ui/LoadingComponent';

import { useQuery } from 'convex/react';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { api } from '~/convex/_generated/api';
import { OfferingCard } from '~/features/payment/components/offer-card';
import { HStack } from './HStack';
import AnimatedSwitch from './switch/AnimatedSwitch';

export const Plans = () => {
  const product = useQuery(api.polar.getConfiguredProducts);
  const [isMonthly, setIsMonthly] = useState(true);
  if (product === undefined) {
    return <LoadingComponent />;
  }

  const arrangedProducts = [
    product.businessPlan,
    product.businessPlanPro,
    product.enterprisePlan,
    product.businessPlanYearly,
    product.businessPlanProYearly,
    product.enterprisePlanYearly,
  ].filter((item) => item !== null && item !== undefined);
  const yearlyProducts = arrangedProducts.filter(
    (item) => item?.recurringInterval === 'year',
  );
  const monthlyProducts = arrangedProducts.filter(
    (item) => item?.recurringInterval === 'month',
  );
  const productsToShow = isMonthly ? monthlyProducts : yearlyProducts;

  return (
    <View>
      <FlatList
        ListHeaderComponent={() => (
          <ListHeader isMonthly={isMonthly} onChangeInterval={setIsMonthly} />
        )}
        showsVerticalScrollIndicator={false}
        data={productsToShow}
        keyExtractor={(item) => item?.createdAt}
        renderItem={({ item }) => (
          <OfferingCard product={item} isMonthly={isMonthly} />
        )}
        contentContainerStyle={{
          gap: 12,
          marginHorizontal: 12,
          paddingBottom: 50,
        }}
      />
    </View>
  );
};

const ListHeader = ({
  isMonthly,
  onChangeInterval,
}: {
  isMonthly: boolean;
  onChangeInterval: (i: boolean) => void;
}) => {
  return (
    <VStack>
      <HStack justifyContent="center" alignItems="center" gap={10}>
        <MyText
          poppins="Light"
          fontSize={15}
          style={{ color: isMonthly ? colors.gray10 : colors.dialPad }}
        >
          Billed Annually
        </MyText>
        <AnimatedSwitch
          value={isMonthly}
          onValueChange={onChangeInterval}
          thumbColor={colors.dialPad}
          onColor={'#DEE7FF'}
          thumbSize={21}
          height={25}
          width={50}
          animateIcons
          iconAnimationType="bounce"
          springConfig={{
            damping: 8,
            stiffness: 200,
            mass: 1.2,
          }}
        />
        <MyText
          poppins="Light"
          fontSize={15}
          style={{ color: isMonthly ? colors.dialPad : colors.gray10 }}
        >
          Billed Monthly
        </MyText>
      </HStack>
    </VStack>
  );
};
