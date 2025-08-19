import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { HStack } from '~/components/HStack';
import { MyText } from '~/components/Ui/MyText';
import VStack from '~/components/Ui/VStack';
import { colors } from '~/constants/Colors';
import { RatingPercentageType } from '~/constants/types';

type RatingPercentageProps = {
  data: RatingPercentageType[];
};
export const RatingPercentage = ({ data }: RatingPercentageProps) => {
  return (
    <VStack gap={5}>
      {data?.map((d, i) => <Percentage key={i} {...d} />)}
    </VStack>
  );
};

const Percentage = ({ percentage, stars }: RatingPercentageType) => {
  const width = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    width: withSpring(`${width.value}%`),
  }));
  useEffect(() => {
    const handleAnimation = () => {
      width.value = percentage;
    };
    handleAnimation();
  }, [width.value, percentage, width]);
  return (
    <HStack alignItems="center" gap={10}>
      <MyText poppins="Medium" fontSize={15}>
        {stars} star
      </MyText>
      <View
        style={{
          flex: 1,

          height: 10,
          borderRadius: 9,
        }}
      >
        <Animated.View
          style={[
            {
              backgroundColor: colors.dialPad,
              height: '100%',
              borderRadius: 9,
            },
            animatedStyle,
          ]}
        />
      </View>
      <MyText poppins="Medium" fontSize={15}>
        {percentage}%
      </MyText>
    </HStack>
  );
};
