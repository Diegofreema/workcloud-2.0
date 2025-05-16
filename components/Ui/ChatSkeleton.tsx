import React, { useCallback } from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Memoized skeleton message component for better performance
const SkeletonMessage = React.memo(
  ({ isLeft, index }: { isLeft: boolean; index: number }) => {
    const opacity = useSharedValue(0.3);

    React.useEffect(() => {
      opacity.value = withDelay(
        index * 50,
        withRepeat(
          withSequence(
            withTiming(0.7, { duration: 500 }),
            withTiming(0.3, { duration: 500 })
          ),
          -1,
          true
        )
      );

      return () => {
        cancelAnimation(opacity);
      };
    }, [index, opacity]);

    const animatedStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
    }));

    return (
      <View
        style={[
          styles.messageContainer,
          isLeft ? styles.leftMessage : styles.rightMessage,
        ]}
      >
        {isLeft && <View style={styles.avatar} />}
        <Animated.View
          style={[
            styles.message,
            isLeft ? styles.leftBubble : styles.rightBubble,
            animatedStyle,
          ]}
        >
          {/* Add lines inside the bubble for more realistic appearance */}
          <View style={[styles.messageLine, { width: '90%' }]} />
          <View style={[styles.messageLine, { width: '75%' }]} />
        </Animated.View>
      </View>
    );
  }
);

SkeletonMessage.displayName = 'SkeletonMessage';

const InputSkeleton = React.memo(() => {
  const opacity = useSharedValue(0.3);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 500 }),
        withTiming(0.3, { duration: 500 })
      ),
      -1,
      true
    );

    return () => {
      cancelAnimation(opacity);
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.inputContainer, animatedStyle]}>
      <View style={styles.attachButton} />
      <View style={styles.inputField} />
      <View style={styles.sendButton} />
    </Animated.View>
  );
});

InputSkeleton.displayName = 'InputSkeleton';

const ChatSkeleton = () => {
  const renderSkeletonMessages = useCallback(() => {
    const messages = [];
    for (let i = 0; i < 8; i++) {
      messages.push(<SkeletonMessage key={i} isLeft={i % 2 === 0} index={i} />);
    }
    return messages;
  }, []);

  return (
    <View style={styles.container}>
      {/* Messages container */}
      <View style={styles.messagesContainer}>
        <View style={styles.dateSeparator} />
        {renderSkeletonMessages()}
      </View>

      {/* Input skeleton */}
      <InputSkeleton />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 8,
    alignItems: 'flex-start',
  },
  leftMessage: {
    justifyContent: 'flex-start',
  },
  rightMessage: {
    justifyContent: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  message: {
    padding: 12,
    borderRadius: 20,
    marginVertical: 4,
  },
  leftBubble: {
    backgroundColor: '#e0e0e0',
    width: SCREEN_WIDTH * 0.65,
    borderTopLeftRadius: 4,
    height: 80, // Increased height
  },
  rightBubble: {
    backgroundColor: '#e0e0e0',
    width: SCREEN_WIDTH * 0.5,
    borderTopRightRadius: 4,
    height: 80, // Increased height
  },
  messageLine: {
    height: 8,
    backgroundColor: '#d0d0d0',
    borderRadius: 4,
    marginVertical: 4,
  },
  dateSeparator: {
    height: 24,
    width: 100,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 16,
  },
  // Input skeleton styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: Platform.OS === 'ios' ? 30 : 12, // Account for iOS home indicator
  },
  attachButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    marginRight: 8,
  },
  inputField: {
    flex: 1,
    height: 36,
    backgroundColor: '#e0e0e0',
    borderRadius: 18,
    marginRight: 8,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
  },
});

export default React.memo(ChatSkeleton);
