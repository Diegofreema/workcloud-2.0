import React, { useCallback, useEffect } from "react";
import { Platform, StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const StaffCardSkeleton = () => {
  const opacity = useSharedValue(0.3);

  const startAnimation = useCallback(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000, easing: Easing.linear }),
      -1, // Infinite repeat
      true, // Reverse animation
    );
  }, [opacity]);

  useEffect(() => {
    startAnimation();
    return () => {
      // Cleanup animation
      opacity.value = withTiming(0.3, { duration: 0 });
    };
  }, [startAnimation, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.cardContainer}>
      <Animated.View style={[styles.imagePlaceholder, animatedStyle]} />
      <Animated.View
        style={[styles.textPlaceholder, { width: "60%" }, animatedStyle]}
      />
      <Animated.View
        style={[styles.textPlaceholder, { width: "80%" }, animatedStyle]}
      />
      <View style={styles.buttonsContainer}>
        <Animated.View style={[styles.buttonPlaceholder, animatedStyle]} />
        <Animated.View style={[styles.buttonPlaceholder, animatedStyle]} />
      </View>
    </View>
  );
};

export default React.memo(StaffCardSkeleton);

const styles = StyleSheet.create({
  cardContainer: {
    width: "95%",
    marginHorizontal: "auto",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
  },
  textPlaceholder: {
    height: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginBottom: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  buttonPlaceholder: {
    width: "45%",
    height: 40,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
});
