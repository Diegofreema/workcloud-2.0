import {View} from "react-native";
import {Button} from "~/features/common/components/Button";
import {colors} from "~/constants/Colors";
import Animated, {FadeIn, FadeOut} from "react-native-reanimated";
import {InputComponent} from "~/components/InputComponent";
import {HStack} from "~/components/HStack";
import {useState} from "react";
import {Id} from "~/convex/_generated/dataModel";
import {useMutation, useQuery} from "convex/react";
import {api} from "~/convex/_generated/api";
import {useGetUserId} from "~/hooks/useGetUserId";
import {toast} from "sonner-native";
import Card from "~/features/common/components/card";
import {formatDateToNowHelper,} from "~/lib/helper";

type Props = {
  isOwner: boolean;
  reviewId: Id<"reviews">;
};

export const Reply = ({ isOwner, reviewId }: Props) => {
  const addReply = useMutation(api.reviews.addReply);
  const { id } = useGetUserId();
  const reply = useQuery(api.reviews.getReply, { reviewId });
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [value, setValue] = useState("");
  const [replying, setReplying] = useState(false);
  const onCancel = () => {
    setShowReplyInput(false);
    setValue("");
  };
  const onReply = async () => {
    if (!value.trim()) return;
    try {
      setReplying(true);
      await addReply({
        reply: value,
        reviewId,
        from: id!,
      });
      toast.success("Reply sent successfully.");
      setShowReplyInput(false);
    } catch (e) {
      toast.error("Failed to send reply");
    } finally {
      setReplying(false);
    }
  };
  const disable = value.trim() === "" || replying;
  if (reply === undefined) return null;
  return (
    <View>
      {isOwner && !showReplyInput && !reply && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <Button
            title={"Reply"}
            onPress={() => setShowReplyInput(true)}
            style={{ backgroundColor: "transparent" }}
            textStyle={{ color: colors.dialPad }}
          />
        </Animated.View>
      )}
      {showReplyInput && (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <InputComponent
            label={"Reply"}
            placeholder={"Reply this comment"}
            value={value}
            onChangeText={setValue}
          />
          <HStack gap={10} style={{ marginHorizontal: 20 }}>
            <Button
              title={"Cancel"}
              onPress={onCancel}
              style={{ backgroundColor: colors.closeTextColor, flex: 1 }}
            />
            <Button
              title={"Reply"}
              onPress={onReply}
              disabled={disable}
              loading={replying}
              loadingTitle={"Replying..."}
              style={{ backgroundColor: colors.dialPad, flex: 1 }}
            />
          </HStack>
        </Animated.View>
      )}

      {reply && (
        <Card style={{ boxShadow: "", marginHorizontal: 5, alignSelf: "flex-end" }}>
          <Card.Header>
            <Card.Title>{reply.organizationName}</Card.Title>
            <Card.Description>
              {formatDateToNowHelper(new Date(reply.creationTime))} ago
            </Card.Description>
            <Card.Description>{reply.reply}</Card.Description>
          </Card.Header>
        </Card>
      )}
    </View>
  );
};
