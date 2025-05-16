import React from 'react';
import { Dimensions, Image, StatusBar, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface ImageTransitionProps {
  smallImageUrl: string;
  largeImageUrl: string;
  initialPosition?: { x: number; y: number };
}

const SPRING_CONFIG = {
  damping: 15,
  mass: 1,
  stiffness: 200,
};

export const ImageTransition: React.FC<ImageTransitionProps> = ({
  smallImageUrl,
  largeImageUrl,
  initialPosition = { x: 0, y: 0 },
}) => {
  const progress = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(initialPosition.x);
  const translateY = useSharedValue(initialPosition.y);

  const animatedStyles = useAnimatedStyle(() => ({
    position: 'absolute',
    width: interpolate(
      progress.value,
      [0, 1],
      [200, SCREEN_WIDTH],
      Extrapolation.CLAMP
    ),
    height: interpolate(
      progress.value,
      [0, 1],
      [200, SCREEN_HEIGHT],
      Extrapolation.CLAMP
    ),
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    borderRadius: interpolate(progress.value, [0, 1], [10, 0]),
    zIndex: 999,
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    backgroundColor: 'rgba(0,0,0,0.8)',
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
  }));

  const toggleExpand = () => {
    const isExpanding = progress.value === 0;
    StatusBar.setHidden(isExpanding);

    progress.value = withSpring(isExpanding ? 1 : 0, SPRING_CONFIG);
    translateX.value = withSpring(
      isExpanding ? 0 : initialPosition.x,
      SPRING_CONFIG
    );
    translateY.value = withSpring(
      isExpanding ? 0 : initialPosition.y,
      SPRING_CONFIG
    );
  };

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(toggleExpand)();
  });

  const pan = Gesture.Pan()
    .onUpdate((event) => {
      if (progress.value === 1) {
        translateY.value = event.translationY;
        scale.value = interpolate(
          Math.abs(event.translationY),
          [0, SCREEN_HEIGHT / 2],
          [1, 0.7],
          Extrapolation.CLAMP
        );
      }
    })
    .onEnd(() => {
      if (Math.abs(translateY.value) > SCREEN_HEIGHT / 3) {
        runOnJS(toggleExpand)();
      } else {
        translateY.value = withSpring(0, SPRING_CONFIG);
        scale.value = withSpring(1, SPRING_CONFIG);
      }
    });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={overlayStyle} pointerEvents="none" />
      <GestureDetector gesture={Gesture.Simultaneous(tap, pan)}>
        <Animated.View style={[styles.imageContainer, animatedStyles]}>
          <Image
            source={{
              uri: progress.value > 0.5 ? largeImageUrl : smallImageUrl,
            }}
            style={styles.image}
            resizeMode={progress.value > 0.5 ? 'contain' : 'cover'}
          />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
