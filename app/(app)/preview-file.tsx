import React from "react";
import { View } from "react-native";
import { useFileUrlStore } from "~/features/chat/hook/use-file-url";
import { PreviewChatImage } from "~/features/chat/components/preview-image";
import { PreviewDoc } from "~/features/chat/components/preview-doc";
import { HeaderNav } from "~/components/HeaderNav";

const PreviewFile = () => {
  const file = useFileUrlStore((state) => state.file);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <HeaderNav title={"Preview"} />
      {file?.type === "image" ? (
        <PreviewChatImage url={file.url} />
      ) : (
        <PreviewDoc uri={file?.url!} />
      )}
    </View>
  );
};

export default PreviewFile;
