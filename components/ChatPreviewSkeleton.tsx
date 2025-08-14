import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { ThemedView } from './Ui/themed-view';

const { width } = Dimensions.get('window');

export const ChatPreviewSkeleton = ({ length = 1 }: { length?: number }) => {
  // Shared value for shimmer animation
  const shimmerProgress = useSharedValue(0);

  useEffect(() => {
    // Create an infinite shimmer animation
    shimmerProgress.value = withRepeat(
      withTiming(1, { duration: 1500 }),
      -1,
      true
    );
  }, [shimmerProgress]);

  // Animated style for shimmer effect
  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerProgress.value,
      [0, 1],
      [-width, width]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <ThemedView style={styles.container}>
      {[...Array(length).keys()].map((i) => (
        <View style={styles.itemContainer} key={i}>
          {/* Avatar Placeholder */}
          <Animated.View style={styles.avatarPlaceholder} />

          <View style={styles.textContainer}>
            {/* Username Placeholder */}
            <Animated.View style={styles.usernamePlaceholder} />

            {/* Message Preview Placeholder */}
            <Animated.View style={styles.messagePreviewPlaceholder} />
          </View>

          {/* Shimmer Effect */}
          <Animated.View style={[styles.shimmerOverlay, shimmerStyle]} />
        </View>
      ))}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E5E5',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  usernamePlaceholder: {
    height: 16,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    marginBottom: 8,
    width: '75%',
  },
  messagePreviewPlaceholder: {
    height: 12,
    backgroundColor: '#E5E5E5',
    borderRadius: 8,
    width: '100%',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 10,
  },
});
