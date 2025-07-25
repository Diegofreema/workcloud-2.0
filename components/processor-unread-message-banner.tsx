import { useQuery } from 'convex/react';
import { Href, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '~/constants/Colors';
import { api } from '~/convex/_generated/api';

interface Props {
  unreadCount: number;
}
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);
export const UnreadProcessorMessage = ({ unreadCount }: Props) => {
  const height = useSharedValue(0);
  const getWorker = useQuery(api.worker.getWorkerRole, {});

  const router = useRouter();
  useEffect(() => {
    // Animate height to 50 when there are pending members, 0 when none
    height.value = withSpring(unreadCount > 0 ? 50 : 0, {
      damping: 10,
      stiffness: 100,
    });
  }, [unreadCount, height]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    overflow: 'hidden',
  }));

  const path: Href =
    getWorker?.role === 'processor'
      ? `/processors/workspace/${getWorker.id}`
      : '/processors/chat';
  const onPress = () => {
    router.push(path);
  };
  if (!getWorker) {
    return null;
  }
  return (
    <AnimatedTouchableOpacity style={animatedStyle} onPress={onPress}>
      <View style={{ padding: 10, backgroundColor: '#f0f0f0' }}>
        <Text style={{ color: colors.black }}>
          {unreadCount} unread processor{' '}
          {unreadCount === 1 ? 'message' : 'messages'}
        </Text>
      </View>
    </AnimatedTouchableOpacity>
  );
};
