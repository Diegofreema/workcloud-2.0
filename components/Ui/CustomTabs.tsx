import { Tab, TabView } from "@rneui/themed";
import { ReactNode, useState } from "react";

import { CustomScrollView } from "./CustomScrollView";

import { colors } from "~/constants/Colors";
import { useDarkMode } from "~/hooks/useDarkMode";

type Props = {
  title1?: string;
  title2?: string;
  content1?: ReactNode;
  content2?: ReactNode;
};

export const CustomTabs = ({
  title1 = "FAQ",
  title2 = "Contact Us",
  content1,
  content2,
}: Props): JSX.Element => {
  const { darkMode } = useDarkMode();
  const [index, setIndex] = useState(0);

  const isDarkMode = darkMode === "dark";
  const tabTittle = isDarkMode ? "white" : colors.dialPad;
  return (
    <>
      <Tab
        style={{ marginHorizontal: 20 }}
        value={index}
        onChange={setIndex}
        dense
        disableIndicator
      >
        <Tab.Item
          title={title1}
          titleStyle={{ color: tabTittle }}
          containerStyle={{
            borderBottomColor: index === 0 ? tabTittle : "transparent",
            borderBottomWidth: 2,
          }}
        />
        <Tab.Item
          title={title2}
          titleStyle={{ color: tabTittle }}
          containerStyle={{
            borderBottomColor: index === 1 ? tabTittle : "transparent",
            borderBottomWidth: 2,
          }}
        />
      </Tab>
      <TabView
        value={index}
        onChange={setIndex}
        animationType="spring"
        containerStyle={{ marginTop: 30 }}
      >
        <TabView.Item
          style={{
            width: "100%",
            paddingHorizontal: 20,
            backgroundColor: darkMode === "dark" ? "black" : "white",
          }}
        >
          <CustomScrollView>{content1}</CustomScrollView>
        </TabView.Item>
        <TabView.Item
          style={{
            width: "100%",
            paddingHorizontal: 20,
            backgroundColor: darkMode === "dark" ? "black" : "white",
          }}
        >
          <CustomScrollView>{content2}</CustomScrollView>
        </TabView.Item>
      </TabView>
    </>
  );
};
