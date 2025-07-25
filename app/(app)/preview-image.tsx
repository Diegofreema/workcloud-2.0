import { ImageZoom } from "@likashefqet/react-native-image-zoom";
import { useRouter } from "expo-router";
import React from "react";
import { View } from "react-native";
import { DownloadBlurView } from "~/features/chat/components/download-blur-view";

type Props = {
  url: string;
};

const PreviewChatImage = ({ url }: Props) => {
  const router = useRouter();
  const onPress = () => {
    router.back();
  };
  return (
    <View style={{ flex: 1 }}>
      <ImageZoom
        uri={url}
        style={{ width: "100%", height: "100%", flex: 1 }}
        minScale={0.5}
        maxPanPointers={1}
        maxScale={5}
        doubleTapScale={2}
        defaultSource={require("~/assets/images.png")}
        isDoubleTapEnabled
        isSingleTapEnabled
        // resizeMode="cover"
      />
      <DownloadBlurView url={url} onClose={onPress} type="image" />
    </View>
  );
};

export default PreviewChatImage;
