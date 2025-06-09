import { useAuth } from "@clerk/clerk-expo";
import { convexQuery } from "@convex-dev/react-query";
import { Button } from "@rneui/themed";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { toast } from "sonner-native";

import { HStack } from "../HStack";
import { MyText } from "./MyText";
import VStack from "./VStack";

import { CustomModal } from "~/components/Dialogs/CustomModal";
import { Avatar } from "~/components/Ui/Avatar";
import { colors } from "~/constants/Colors";
import { PendingRequests } from "~/constants/types";
import { api } from "~/convex/_generated/api";
import { useDecline } from "~/hooks/useDecline";
import { useOpen } from "~/hooks/useOpen";

type PreviewWorker = {
  name: any;
  imageUrl?: string;

  subText?: string | boolean;
  id?: any;
  navigate?: boolean;
  roleText?: string;
  workspaceId?: string | null;
  personal?: boolean;
  hide?: boolean;
  workPlace?: string;
  profile?: boolean;
  active?: boolean;
  workspace?: boolean;
  onPress?: () => void;
  size?: number;
};
export const UserPreview = ({
  id,
  imageUrl,
  subText,
  navigate,
  name,
  roleText,
  size,
  workPlace,
  profile,
  active,
  workspace,
  onPress = () => {
    if (!navigate) return;
    router.push(`/workerProfile/${id}`);
  },
}: PreviewWorker) => {
  return (
    <Pressable
      onPress={() => onPress && onPress()}
      style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
    >
      <HStack gap={10} alignItems="center">
        {imageUrl ? (
          <Avatar image={imageUrl} width={size} height={size} />
        ) : (
          <Image
            source={require("~/assets/images/boy.png")}
            style={{ width: 60, height: 60, borderRadius: 9999 }}
            contentFit="cover"
          />
        )}
        <VStack>
          <MyText poppins="Bold" fontSize={16}>
            {name}
          </MyText>
          {subText && (
            <MyText poppins="Medium" fontSize={14}>
              {subText === true ? "pending" : subText}
            </MyText>
          )}
          {roleText && (
            <MyText poppins="Medium" fontSize={14}>
              {roleText} {workPlace && `at ${workPlace}`}
            </MyText>
          )}

          {!roleText && profile && (
            <MyText poppins="Medium" fontSize={14}>
              Currently not with an organization
            </MyText>
          )}
          {active && workspace && (
            <View
              style={{
                backgroundColor: colors.openTextColor,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MyText
                poppins="Medium"
                fontSize={14}
                style={{ color: colors.openBackgroundColor }}
              >
                Active
              </MyText>
            </View>
          )}

          {!active && workspace && (
            <View
              style={{
                backgroundColor: colors.closeTextColor,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MyText
                style={{ color: colors.closeBackgroundColor }}
                poppins="Medium"
                fontSize={14}
              >
                Inactive
              </MyText>
            </View>
          )}
        </VStack>
      </HStack>
    </Pressable>
  );
};

export const WorkPreview = ({ item }: { item: PendingRequests }) => {
  const { userId } = useAuth();
  const { onOpen } = useOpen();

  const { isOpen, onClose, onOpen: openDecline } = useDecline();
  const [cancelling, setCancelling] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const cancelRequest = useMutation(api.request.cancelPendingRequests);
  const acceptOffer = useMutation(api.worker.acceptOffer);
  const {
    data: isEmployed,
    isPending,
    isError,
  } = useQuery(
    convexQuery(api.worker.checkIfWorkerIsEmployed, { id: item.request.to }),
  );
  const {
    request: {
      qualities,
      role,
      salary,
      responsibility,
      to,
      _id,
      from,
      pending,
      accepted,
    },
    organisation,
  } = item;

  const acceptRequest = async () => {
    if (!userId || isPending || isError || !organisation?._id) return;
    setAccepting(true);
    try {
      if (isEmployed) {
        onOpen();
        return;
      }
      await acceptOffer({
        to,
        from,
        _id,
        organizationId: organisation?._id,
        role,
      });
      // logic to accept organisation if not employed;

      toast.success("You have accepted the offer", {
        description: `From ${organisation.name} as an ${role}`,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setAccepting(false);
    }
  };

  const rejectRequest = async () => {
    setCancelling(true);
    try {
      await cancelRequest({ id: _id });
      toast.success("Request has been declined");
      onClose();
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setCancelling(false);
    }
  };

  return (
    <>
      <CustomModal
        onPress={rejectRequest}
        title="This action is irreversible"
        isLoading={cancelling}
        onClose={onClose}
        isOpen={isOpen}
      />
      <HStack pr={20} py={10} gap={6}>
        <Image
          source={{
            uri: organisation?.avatar || "https://placehold.co/100x100",
          }}
          placeholder={require("~/assets/images/pl.png")}
          style={{ width: 60, height: 60, borderRadius: 9999 }}
          contentFit="cover"
        />
        <VStack mr={10} width="90%" justifyContent="space-between" gap={10}>
          <MyText
            style={{ width: "100%", paddingRight: 5 }}
            poppins="Medium"
            fontSize={14}
          >
            {organisation?.name} wants you to be a representative on their
            workspace
          </MyText>
          <MyText style={{}} poppins="Medium" fontSize={12}>
            Role : {role}
          </MyText>
          <MyText style={{}} poppins="Medium" fontSize={12}>
            Responsibility : {responsibility}
          </MyText>
          <MyText style={{}} poppins="Medium" fontSize={12}>
            Qualities : {qualities}
          </MyText>
          <MyText style={{}} poppins="Medium" fontSize={12}>
            Payment: {salary} naira
          </MyText>
          {accepted && (
            <MyText style={{ color: "green" }} poppins="Medium" fontSize={15}>
              Accepted
            </MyText>
          )}
          {!accepted && !pending && (
            <MyText style={{ color: "red" }} poppins="Medium" fontSize={15}>
              Declined
            </MyText>
          )}
          {!accepted && pending && (
            <HStack gap={10} mt={20}>
              <Button
                buttonStyle={{
                  backgroundColor: "#C0D1FE",
                  borderRadius: 5,
                  minWidth: 100,
                }}
                style={{ borderRadius: 5 }}
                loading={cancelling}
                onPress={openDecline}
                titleStyle={{ color: "#0047FF", fontFamily: "PoppinsMedium" }}
              >
                Decline
              </Button>
              <Button
                buttonStyle={{ backgroundColor: "#0047FF", borderRadius: 5 }}
                style={{ borderRadius: 5 }}
                loading={accepting}
                onPress={acceptRequest}
                titleStyle={{ color: "white", fontFamily: "PoppinsMedium" }}
              >
                Accept
              </Button>
            </HStack>
          )}
        </VStack>
      </HStack>
    </>
  );
};
