import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Pdf from "react-native-pdf";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { EditType, IMessage } from "~/constants/types";
import { useGetUserId } from "~/hooks/useGetUserId";
import { colors } from "~/constants/Colors";

type ReplyMessageBarProps = {
  clearReply: () => void;
  message: IMessage | null;
  editText: EditType | null;
  clearEdit: () => void;
};

const ReplyMessageBar = ({
  clearReply,
  message,
  clearEdit,
  editText,
}: ReplyMessageBarProps) => {
  console.log({ message });
  const { id: loggedInUser } = useGetUserId();
  const renderContent = () => {
    if (message?.fileType === "image" && message.fileUrl) {
      return (
        <Image
          source={{ uri: message.fileUrl }}
          style={{ width: 40, height: 40, marginLeft: 10 }}
          placeholder={require("../../../assets/images.png")}
          placeholderContentFit="cover"
          contentFit="cover"
        />
      );
    } else if (message?.fileType === "pdf" && message.fileUrl) {
      return (
        <Pdf source={{ uri: message.fileUrl }} style={styles.pdf} singlePage />
      );
    } else {
      return (
        <Text style={{ color: colors.black, paddingLeft: 10, paddingTop: 5 }}>
          {message!.text.length > 40
            ? message?.text.substring(0, 40) + "..."
            : message?.text}
        </Text>
      );
    }
  };

  // Determine which content to display (prioritize message over editText)
  const displayMessage = message !== null;
  const displayEditText = !displayMessage && editText !== null;

  // Calculate height based on the content being displayed
  const height =
    displayMessage &&
    (message?.fileType === "image" || message?.fileType === "pdf")
      ? 70
      : 50;

  return (
    <>
      {displayMessage && (
        <Animated.View
          style={{
            height: height,
            flexDirection: "row",
            backgroundColor: "#E4E9EB",
          }}
          entering={FadeInDown}
          exiting={FadeOutDown}
        >
          <View
            style={{ height: height, width: 6, backgroundColor: "#89BC0C" }}
          ></View>
          <View style={{ flexDirection: "column" }}>
            <Text
              style={{
                color: colors.cod,
                paddingLeft: 10,
                paddingTop: 5,
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              {message?.user.name}
            </Text>

            {renderContent()}
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: 10,
            }}
          >
            <TouchableOpacity onPress={clearReply}>
              <Ionicons
                name="close-circle-outline"
                color={colors.dialPad}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {displayEditText && (
        <Animated.View
          style={{
            height: height,
            flexDirection: "row",
            backgroundColor: "#E4E9EB",
          }}
          entering={FadeInDown}
          exiting={FadeOutDown}
        >
          <View
            style={{ height: height, width: 6, backgroundColor: "#89BC0C" }}
          ></View>
          <View>
            <Text
              style={{
                color: "#89BC0C",
                paddingLeft: 10,
                paddingTop: 5,
                fontWeight: "600",
                fontSize: 15,
              }}
            >
              {editText.senderId === loggedInUser ? "You" : editText.senderName}
            </Text>
            <Text
              style={{ color: colors.gray, paddingLeft: 10, paddingTop: 5 }}
            >
              {editText!.text.length > 40
                ? editText?.text.substring(0, 40) + "..."
                : editText.text}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-end",
              paddingRight: 10,
            }}
          >
            <TouchableOpacity onPress={clearEdit}>
              <Ionicons
                name="close-circle-outline"
                color={colors.dialPad}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </>
  );
};

export default ReplyMessageBar;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
  sentText: {
    color: colors.white,
  },
  receivedText: {
    color: "#000",
  },
  sentTextContainer: {
    backgroundColor: colors.dialPad,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  receivedTextContainer: {
    backgroundColor: colors.dialPad,
    padding: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    overflow: "hidden",
  },
  sentImage: {
    borderBottomRightRadius: 2,
  },
  receivedImage: {
    borderBottomLeftRadius: 2,
  },
  pdfContainer: {
    width: 200,
    height: 200,
  },
  pdf: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginLeft: 10,
  },
});
