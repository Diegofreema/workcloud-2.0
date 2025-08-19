import { Icon } from '@rneui/themed';
import { Pressable } from 'react-native';
import { Menu, MenuDivider, MenuItem } from 'react-native-material-menu';

import { MyText } from './Ui/MyText';

import { useTheme } from '~/hooks/use-theme';
type Props = {
  visible: boolean;
  onClose: () => void;
  onOpen: () => void;
  handleDelete: () => void;
  handleEdit: () => void;
};

export const ServicePointAction = ({
  visible,
  onClose,
  onOpen,
  handleDelete,
  handleEdit,
}: Props) => {
  const { theme: darkMode } = useTheme();
  return (
    <Menu
      visible={visible}
      onRequestClose={onClose}
      anchor={
        <Pressable onPress={onOpen}>
          <Icon
            name="dots-three-horizontal"
            type="entypo"
            size={25}
            color={darkMode === 'dark' ? 'white' : 'black'}
          />
        </Pressable>
      }
    >
      <MenuItem onPress={handleDelete}>
        <MyText poppins="Medium" fontSize={14}>
          Delete
        </MyText>
      </MenuItem>
      <MenuDivider />
      <MenuItem onPress={handleEdit}>
        <MyText poppins="Medium" fontSize={14}>
          Edit
        </MyText>
      </MenuItem>
      <MenuDivider />
    </Menu>
  );
};
