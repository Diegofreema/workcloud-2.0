import {View} from "react-native";
import React from "react";
import {constantStyles} from "~/constants/styles";

type Props = {
  leftContent: React.ReactNode;
  rightContent?: React.ReactNode;
};
export const TabsHeader = ({ leftContent, rightContent }: Props) => {
  return (
    <View style={constantStyles.flex}>
      {leftContent}
      {rightContent}
    </View>
  );
};


