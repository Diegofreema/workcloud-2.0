import React from "react";
import {StyleSheet, View} from "react-native";

import {RFPercentage} from "react-native-responsive-fontsize";
import {Doc} from "~/convex/_generated/dataModel";
import {Avatar} from "~/features/common/components/avatar";
import {colors} from "~/constants/Colors";
import {MyText} from "~/components/Ui/MyText";

type Props = {
  data: Doc<"conversations">;
  count: number;
};

export const RoomInfoTop = ({ data, count }: Props) => {
  const memberText = count > 1 ? "members" : "member";
  return (
    <View style={{ gap: 10 }}>
      <View style={styles.container}>
        <View style={{ width: 100, height: 100 }}>
          <Avatar url={data.imageUrl!} size={100} />
        </View>
        <MyText
          poppins={"Bold"}
          fontSize={30}
          style={[styles.name, { textAlign: "center" }]}
        >
          {data.name!}
        </MyText>
        <MyText
          poppins={"Medium"}
          fontSize={15}
          style={[styles.count, { textAlign: "center" }]}
        >
          {`${count} ${memberText} `}
        </MyText>
      </View>

      <MyText poppins={"Light"} fontSize={20} style={[styles.name]}>
        Members
      </MyText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    gap: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    color: colors.black,
    fontSize: RFPercentage(1.5),

    flex: 0,
  },
  count: {
    color: colors.black,
    flex: 0,
    textAlign: "center",
  },
});
