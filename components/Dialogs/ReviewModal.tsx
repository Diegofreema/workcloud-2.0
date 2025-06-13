import { useMutation } from "convex/react";
import { XCircle } from "lucide-react-native";
import { useState } from "react";
import { Modal, StyleSheet, TextInput, View } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { toast } from "sonner-native";

import { HStack } from "~/components/HStack";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { MyButton } from "~/components/Ui/MyButton";
import { MyText } from "~/components/Ui/MyText";
import VStack from "~/components/Ui/VStack";
import { colors } from "~/constants/Colors";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { useDarkMode } from "~/hooks/useDarkMode";
import ReviewStar from "~/features/common/components/ReviewStars";

const maxLength = 150;
type ReviewModalProps = {
  visible: boolean;
  onClose: () => void;
  userId: Id<"users">;
  organizationId: Id<"organizations">;
};
export const ReviewModal = ({
  visible,
  onClose,
  userId,
  organizationId,
}: ReviewModalProps) => {
  const { darkMode } = useDarkMode();
  const [value, setValue] = useState("");
  const [rating, setRating] = useState(3);
  const [sending, setSending] = useState(false);
  const addReview = useMutation(api.reviews.addReview);
  const iconColor = darkMode === "dark" ? "white" : "black";
  const valueLength = value.length;
  console.log(rating);
  const handleClose = () => {
    setValue("");
    onClose();
  };
  const onSubmit = async () => {
    setSending(true);
    try {
      await addReview({ rating, text: value, userId, organizationId });
      handleClose();
      toast.success("Success", {
        description: "Review submitted",
      });
    } catch (error) {
      console.log(error);
      handleClose();
      toast.error("Failed to add review", {
        description: "Please try again later",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType="slide"
      transparent
      statusBarTranslucent
    >
      <View style={styles.centeredView}>
        <View style={styles.modal}>
          <HStack justifyContent="space-between">
            <VStack>
              <MyText poppins="Medium" fontSize={RFPercentage(2.3)}>
                Share Review
              </MyText>
              <MyText poppins="Medium" fontSize={RFPercentage(1.3)} style={{}}>
                Share a public review about this Organization
              </MyText>
            </VStack>
            <CustomPressable onPress={handleClose}>
              <XCircle color={iconColor} />
            </CustomPressable>
          </HStack>

          <ReviewStar onRatingChange={setRating} />
          <VStack gap={4}>
            <MyText poppins="Medium" fontSize={RFPercentage(1.5)}>
              Feedback
            </MyText>
            <TextInput
              placeholder="Write a comment"
              value={value}
              onChangeText={setValue}
              style={styles.input}
              numberOfLines={5}
              multiline
              autoCapitalize="sentences"
              maxLength={maxLength}
              textAlignVertical="top"
            />
            <MyText poppins="Bold" fontSize={RFPercentage(1.8)}>
              {valueLength} / {maxLength}
            </MyText>
          </VStack>
          <MyButton
            onPress={onSubmit}
            buttonStyle={{ width: "100%" }}
            loading={sending}
          >
            Submit Review
          </MyButton>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    width: "90%",
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    gap: 10,
  },
  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.grayText,
    borderRadius: 5,
    padding: 10,
    height: 100,
  },
});
