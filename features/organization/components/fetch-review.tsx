import {View} from "react-native";
import {Id} from "~/convex/_generated/dataModel";
import {Review} from "~/components/Review";
import React from "react";
import {ReviewModal} from "~/components/Dialogs/ReviewModal";

type Props = {
  id: Id<"organizations">;
  visible: boolean;
  onClose: () => void;
  userId: Id<"users">;
};
export const FetchReview = ({ id,onClose,userId,visible }: Props) => {
  return (
    <View style={{ flex: 1 }}>
        <ReviewModal
            visible={visible}
            onClose={onClose}
            organizationId={id}
            userId={userId!}
        />
      <Review organizationId={id} showComments scroll />
    </View>
  );
};
