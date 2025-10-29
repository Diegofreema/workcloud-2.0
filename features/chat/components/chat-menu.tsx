import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  DimensionValue,
  FlexAlignType,
  StyleSheet,
  useColorScheme,
} from 'react-native';

import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import Colors from '~/constants/Colors';

interface MenuItem {
  text: string;
  onSelect: () => void;
}

interface PopupMenuProps {
  menuItems: MenuItem[];
  disable?: boolean;
  trigger?: React.ReactNode;
  width?: DimensionValue | undefined;
  alignSelf?: 'auto' | FlexAlignType | undefined;
}

export const ChatMenu: React.FC<PopupMenuProps> = ({
  menuItems,
  disable,
  trigger,
  width,
  alignSelf,
}) => {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? 'light'].text;
  const backgroundColor = Colors[colorScheme ?? 'light'].background;
  return (
    <Menu renderer={renderers.ContextMenu}>
      <MenuTrigger
        customStyles={{
          triggerTouchable: styles.trigger,
          triggerOuterWrapper: {
            width,
            alignSelf,
            borderRadius: 30,
          },
        }}
        disabled={disable}
      >
        {trigger ? (
          trigger
        ) : (
          <Ionicons name="ellipsis-vertical" size={24} color={color} />
        )}
      </MenuTrigger>
      <MenuOptions
        customStyles={{
          optionsContainer: {
            ...menuOptionsStyles.optionsContainer,
            backgroundColor,
            shadowColor: color,
          },
        }}
      >
        {menuItems.map((item, index) => (
          <MenuOption
            key={index}
            onSelect={item.onSelect}
            text={item.text}
            customStyles={menuOptionStyles}
          />
        ))}
      </MenuOptions>
    </Menu>
  );
};

const styles = StyleSheet.create({
  trigger: {
    padding: 8,
    width: 30,
  },
});

const menuOptionsStyles = {
  optionsContainer: {
    borderRadius: 8,

    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: 150,
    marginTop: 5,
    zIndex: 1000,
  },
};

const menuOptionStyles = {
  optionWrapper: {
    padding: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
};
