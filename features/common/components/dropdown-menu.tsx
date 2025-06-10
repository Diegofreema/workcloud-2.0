import * as DropdownMenu from "zeego/dropdown-menu";
import React, {CSSProperties} from "react";
import {EllipsisVertical} from "lucide-react-native";

export type Props = {
  menuOptions: {
    text: string;
    onSelect: () => void;
  }[];
  styles?: CSSProperties;
  trigger?: React.ReactNode;
  disable?: boolean;
};

export const Menu = ({ menuOptions, styles, trigger, disable }: Props) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <EllipsisVertical size={30} color="black" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content style={styles}>
        {menuOptions.map((option, index) => (
          <DropdownMenu.Item
            key={option.text}
            onSelect={option.onSelect}
            disabled={disable}
          >
            <DropdownMenu.ItemTitle>{option.text}</DropdownMenu.ItemTitle>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
