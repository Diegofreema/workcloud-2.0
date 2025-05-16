import React from 'react';
import { View, Image, Text, StyleSheet, ViewStyle } from 'react-native';

interface AvatarPileProps {
  avatars: string[];
  maxAvatars?: number;
  size?: number;
  spacing?: number;
  style?: ViewStyle;
}

export const AvatarPile: React.FC<AvatarPileProps> = ({
  avatars,
  maxAvatars = 4,
  size = 50,
  spacing = 0.7,
  style,
}) => {
  // Calculate how many avatars to show and if we need a +N label
  const visibleAvatars = avatars.slice(0, maxAvatars);
  const remainingCount = Math.max(0, avatars.length - maxAvatars);

  // Calculate overlap spacing (negative margin)
  const overlapSpacing = size * spacing;

  return (
    <View style={[styles.container, style]}>
      {visibleAvatars.map((avatar, index) => (
        <View
          key={index}
          style={[
            styles.avatarContainer,
            {
              width: size,
              height: size,
              marginLeft: index === 0 ? 0 : -overlapSpacing,
              zIndex: visibleAvatars.length - index, // Stack earlier avatars on top
            },
          ]}>
          <Image
            source={{ uri: avatar }}
            style={[
              styles.avatar,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
              },
            ]}
          />
        </View>
      ))}

      {remainingCount > 0 && (
        <View
          style={[
            styles.remainingCount,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -overlapSpacing,
            },
          ]}>
          <Text style={styles.remainingText}>+{remainingCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 999,
    overflow: 'hidden',
  },
  avatar: {
    backgroundColor: '#E1E1E1', // Placeholder color
  },
  remainingCount: {
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  remainingText: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
  },
});
