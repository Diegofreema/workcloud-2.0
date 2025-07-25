import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface ReviewStarProps {
  readOnly?: boolean;
  rating?: number;
  onRatingChange?: (rating: number) => void;
}

const Star = ({
  index,
  selected,
  onPress,
  readOnly,
}: {
  index: number;
  selected: boolean;
  onPress: () => void;
  readOnly?: boolean;
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handlePress = () => {
    if (readOnly) return;
    scale.value = withSpring(1.2, { damping: 10, stiffness: 100 });
    opacity.value = withTiming(0.7, { duration: 100 });
    onPress();
    scale.value = withTiming(1, { duration: 200 });
    opacity.value = withTiming(1, { duration: 200 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: readOnly ? 1 : scale.value }],
    opacity: readOnly ? 1 : opacity.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={handlePress} disabled={readOnly}>
      <Animated.View style={[styles.starContainer, animatedStyle]}>
        <Text
          style={[
            styles.star,
            selected ? styles.selectedStar : styles.unselectedStar,
          ]}
        >
          ★
        </Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const ReviewStar = ({
  readOnly = false,
  rating = 0,
  onRatingChange,
}: ReviewStarProps) => {
  const [internalRating, setInternalRating] = useState(rating);

  useEffect(() => {
    if (readOnly) {
      // Ensure the displayed rating matches the prop when readOnly
      setInternalRating(rating);
    } else if (rating !== internalRating) {
      // Sync initial rating when not readOnly, but allow user changes
      setInternalRating(rating);
    }
  }, [readOnly, rating, internalRating]);

  const handleStarPress = (index: number) => {
    if (readOnly) return;
    const newRating = index + 1;
    setInternalRating(newRating);
    if (onRatingChange) onRatingChange(newRating);
  };

  const displayedRating = readOnly ? rating : internalRating;

  return (
    <View style={styles.container}>
      {[0, 1, 2, 3, 4].map((index) => (
        <Star
          key={index}
          index={index}
          selected={index < displayedRating}
          onPress={() => handleStarPress(index)}
          readOnly={readOnly}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  starContainer: {
    marginHorizontal: 5,
  },
  star: {
    fontSize: 30,
    textAlign: "center",
  },
  selectedStar: {
    color: "#FFD700", // Golden
  },
  unselectedStar: {
    color: "#D3D3D3", // Gray
  },
});

export default ReviewStar;
