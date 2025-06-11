import { EvilIcons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View } from "react-native";

import { HeaderNav } from "~/components/HeaderNav";
import { call } from "~/components/LoggedInuser/BottomCard";
import { VideoPreview } from "~/components/Ui/VideoPreview";
import { defaultStyle } from "~/constants";

import { HStack } from "~/components/HStack";

const arr = Array.from({ length: 10 }, (_, i) => i + 1);

const Records = () => {
  return (
    <View style={{ flex: 1, ...defaultStyle }}>
      <HeaderNav
        title="All Video Records"
        rightComponent={<EvilIcons name="search" size={24} color="black" />}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
      >
        <HStack
          justifyContent="space-between"
          style={{ flexWrap: "wrap" }}
          gap={10}
        >
          {arr.map((_, i) => (
            <VideoPreview key={i} {...call} />
          ))}
        </HStack>
      </ScrollView>
    </View>
  );
};

export default Records;
