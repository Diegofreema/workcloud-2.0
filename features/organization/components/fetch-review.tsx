import { View } from "react-native";
import { Id } from "~/convex/_generated/dataModel";
import { Review } from "~/components/Review";
import React from "react";

type Props = {
  id: Id<"organizations">;
};

export const FetchReview = ({ id }: Props) => {
  return (
    <View style={{ flex: 1 }}>
      <Review organizationId={id} showComments scroll />
    </View>
  );
};
