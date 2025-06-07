import { Pressable } from "react-native";

import { HStack } from "../HStack";
import { MyText } from "./MyText";
import VStack from "./VStack";

import { formattedSkills } from "~/app/(app)/workerProfile/[profileId]";
import { trimText } from "~/lib/helper";
import React from "react";
import { Avatar } from "~/features/common/components/avatar";
import { colors } from "~/constants/Colors";
import { Id } from "~/convex/_generated/dataModel";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useWorkerActions } from "~/features/staff/hooks/use-worker-actions";
import { useGetUserId } from "~/hooks/useGetUserId";
import StaffCardSkeleton from "~/features/staff/components/skeletons/user-preview-skeleton";

type Props = {
  name: string;
  imageUrl: string;
  bio: string;
  skills: string;
  onPress: () => void;
  id: Id<"users">;
  workerId: Id<"workers">;
};

export const UserPreviewWithBio = ({
  bio,
  imageUrl,
  name,
  skills,
  onPress,

  workerId,
}: Props) => {
  const { id: loggedInUser } = useGetUserId();
  const { cancelling, isInPending, isPending, handleRequest, onMessage } =
    useWorkerActions({ id: loggedInUser!, profileId: workerId });

  if (isPending) {
    return <StaffCardSkeleton />;
  }
  return (
    <VStack
      style={{
        padding: 15,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
      }}
      gap={10}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => ({
          gap: 10,
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <HStack alignItems="center" gap={10}>
          <Avatar url={imageUrl} />
          <MyText poppins="Bold" fontSize={18}>
            {name}
          </MyText>
        </HStack>
        <VStack>
          <MyText poppins="Medium" fontSize={14}>
            {formattedSkills(skills)}
          </MyText>
          <MyText poppins="Medium" fontSize={15}>
            {trimText(bio, 70)}
          </MyText>
        </VStack>
      </Pressable>
      <HStack gap={20} mt={20} mb={5} width={"100%"}>
        <CustomPressable
          onPress={handleRequest}
          disable={cancelling}
          style={{
            backgroundColor: colors.dialPad,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: 40,
          }}
        >
          <MyText poppins={"Medium"} style={{ color: "white", fontSize: 12 }}>
            {isInPending ? "Cancel Request" : "Send Request"}
          </MyText>
        </CustomPressable>

        <CustomPressable
          onPress={onMessage}
          style={{
            backgroundColor: colors.lightBlueButton,
            borderRadius: 5,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            height: 40,
          }}
        >
          <MyText
            poppins={"Medium"}
            style={{ color: "blue", fontSize: 12 }}
            fontSize={RFPercentage(1.5)}
          >
            Send Message
          </MyText>
        </CustomPressable>
      </HStack>
    </VStack>
  );
};
