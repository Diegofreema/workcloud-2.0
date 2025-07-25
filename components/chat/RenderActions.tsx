import { PaperclipIcon } from "lucide-react-native";
import React from "react";
import { Actions, ActionsProps } from "react-native-gifted-chat";

import { CustomPressable } from "~/components/Ui/CustomPressable";

type Props = ActionsProps & {
  onPickDocument: () => void;
};

export const RenderActions = ({ onPickDocument, ...props }: Props) => {
  return (
    <Actions
      {...props}
      icon={() => (
        <CustomPressable onPress={onPickDocument}>
          <PaperclipIcon size={24} color="black" />
        </CustomPressable>
      )}
      containerStyle={{
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15,
      }}
    />
  );
};
