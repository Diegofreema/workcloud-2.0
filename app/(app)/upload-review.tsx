import { StyleSheet, TextInput, View } from "react-native";
import { Container } from "~/components/Ui/Container";
import { HStack } from "~/components/HStack";
import VStack from "~/components/Ui/VStack";
import { MyText } from "~/components/Ui/MyText";
import { RFPercentage } from "react-native-responsive-fontsize";
import ReviewStar from "~/features/common/components/ReviewStars";
import React, { useState } from "react";
import { useDarkMode } from "~/hooks/useDarkMode";
import { useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { toast } from "sonner-native";
import { useGetUserId } from "~/hooks/useGetUserId";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "~/constants/Colors";
import { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/features/common/components/Button";
import { CustomPressable } from "~/components/Ui/CustomPressable";
import { X } from "lucide-react-native";

const UploadReview = () => {
  const { darkMode } = useDarkMode();
  const { id: userId } = useGetUserId();
  const { id } = useLocalSearchParams<{ id: Id<"organizations"> }>();
  const [value, setValue] = useState("");
  const [rating, setRating] = useState(3);
  const [sending, setSending] = useState(false);
  const addReview = useMutation(api.reviews.addReview);
  const iconColor = darkMode === "dark" ? "white" : "black";
  const valueLength = value.length;

  const handleClose = () => {
    setValue("");
    router.dismiss();
  };
  const onSubmit = async () => {
    setSending(true);
    try {
      await addReview({
        rating,
        text: value,
        userId: userId!,
        organizationId: id,
      });
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
    <Container>
      <CustomPressable onPress={handleClose} style={styles.abs}>
        <X color={iconColor} size={30} />
      </CustomPressable>
      <View style={{ marginHorizontal: 15, marginTop: 100 }}>
        <HStack justifyContent="space-between">
          <VStack width={"100%"}>
            <MyText
              poppins="Bold"
              fontSize={20}
              style={{ textAlign: "center" }}
            >
              Send a review
            </MyText>
            <MyText
              poppins="Medium"
              fontSize={RFPercentage(1.3)}
              style={{ textAlign: "center" }}
            >
              Share a public review about this Organization
            </MyText>
          </VStack>
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
        <Button
          onPress={onSubmit}
          style={{ marginTop: 30 }}
          disabled={sending}
          loading={sending}
          loadingTitle={"Submitting..."}
          title={"Submit Review"}
        />
      </View>
    </Container>
  );
};
export default UploadReview;

const maxLength = 150;
const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.grayText,
    borderRadius: 5,
    padding: 10,
    height: 100,
  },
  abs: {
    backgroundColor: "transparent",
    position: "absolute",
    top: 10,
    right: 5,
  },
});
