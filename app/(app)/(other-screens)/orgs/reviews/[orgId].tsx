import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { FetchReview } from "~/features/organization/components/fetch-review";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Id } from "~/convex/_generated/dataModel";
import { useGetUserId } from "~/hooks/useGetUserId";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { Plus } from "lucide-react-native";

const Review = () => {
  const { orgId, owner } = useLocalSearchParams<{
    orgId: Id<"organizations">;
    owner: string;
  }>();
  const { id: userId } = useGetUserId();
  const [visible, setVisible] = useState(false);
  const onClose = () => setVisible(false);
  const isOwner = !!owner;
  return (
    <Container>
      <HeaderNav
        title={"Reviews"}
        rightComponent={
          !isOwner && (
            <CustomPressable onPress={() => setVisible(true)}>
              <Plus color={"black"} size={25} />
            </CustomPressable>
          )
        }
      />

      <FetchReview
        id={orgId}
        onClose={onClose}
        userId={userId!}
        visible={visible}
      />
    </Container>
  );
};
export default Review;
