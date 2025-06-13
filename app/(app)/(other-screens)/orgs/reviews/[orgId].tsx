import { Container } from "~/components/Ui/Container";
import { HeaderNav } from "~/components/HeaderNav";
import { FetchReview } from "~/features/organization/components/fetch-review";
import React, { useState } from "react";
import { ReviewModal } from "~/components/Dialogs/ReviewModal";
import { useLocalSearchParams } from "expo-router";
import { Id } from "~/convex/_generated/dataModel";
import { useGetUserId } from "~/hooks/useGetUserId";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { Plus } from "lucide-react-native";

type Props = {};
const Review = (props: Props) => {
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
      <ReviewModal
        visible={visible}
        onClose={onClose}
        organizationId={orgId}
        userId={userId!}
      />
      <FetchReview id={orgId} />
    </Container>
  );
};
export default Review;
