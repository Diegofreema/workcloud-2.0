import React from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { emojis } from '~/constants';
import { colors } from '~/constants/Colors';
import { MessageReactionsType } from '~/constants/types';

export type EmojiType = 'LIKE' | 'SAD' | 'LOVE' | 'WOW' | 'ANGRY' | 'LAUGH';

interface EmojiPickerModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (emoji: EmojiType) => void;
  position?: { top: number; left: number }; // Position above the bubble
  findEmojiISelected: MessageReactionsType | undefined;
}

export const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  visible,
  onClose,
  onSelect,
  findEmojiISelected,
  position = { top: 0, left: 0 },
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={() => {
        console.log('Pressed outside');
        onClose();
      }}
      accessible
      accessibilityLabel="Emoji reaction picker"
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={[
            styles.pickerContainer,
            { top: position.top, left: position.left },
          ]}
        >
          {emojis.map((emoji) => {
            const isSelected = findEmojiISelected?.emoji === emoji.value;
            return (
              <TouchableOpacity
                key={emoji.value}
                style={[styles.emojiButton, isSelected && styles.selected]}
                onPress={() => {
                  onSelect(emoji.value);
                  onClose();
                }}
                accessibilityLabel={`React with ${emoji.emoji}`}
              >
                <Text style={styles.emoji}>{emoji.emoji}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  // 4. Style for the overlay. It fills the screen.
  // A background color (even a transparent one) is crucial for Pressable to detect taps.
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pickerContainer: {
    position: 'absolute', // The picker is positioned absolutely within the overlay
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxWidth: width - 32,
    // No zIndex needed anymore
  },
  emojiButton: {
    padding: 8,
  },
  emoji: {
    fontSize: 24,
  },
  selected: {
    backgroundColor: colors.dialPad,
    borderRadius: 10,
  },
});
