import { Image } from "expo-image";
import { router } from "expo-router";
import { TouchableOpacity } from "react-native";
import { IMessage, MessageImageProps } from "react-native-gifted-chat";
import * as ContextMenu from "zeego/context-menu";

import { downloadAndSaveFile } from "~/lib/helper";

export const RenderMessageImage = ({
  ...props
}: MessageImageProps<IMessage>) => {
  // const [visible, setVisible] = useState(false);

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <TouchableOpacity
          style={{ padding: 5 }}
          onPress={() =>
            router.push(`/preview-image?url=${props.currentMessage?.image}`)
          }
        >
          <Image
            placeholder={require("~/assets/images/pl.png")}
            source={{ uri: props.currentMessage?.image }}
            style={[{ borderRadius: 5, width: 200, height: 300 }]}
            contentFit="cover"
          />
        </TouchableOpacity>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          key="Save"
          onSelect={() =>
            downloadAndSaveFile(props.currentMessage.image!, "image")
          }
          title="Save"
        >
          <ContextMenu.ItemTitle>Save</ContextMenu.ItemTitle>
          <ContextMenu.ItemIcon
            ios={{
              pointSize: 18,
              name: "arrow.down.to.line",
            }}
            androidIconName="arrow_down_float"
          />
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
};

// const styles = StyleSheet.create({
//   cancel: { position: 'absolute', left: 20, top: HEIGHT * 0.05, zIndex: 5 },
//   download: { position: 'absolute', right: 20, bottom: 50, zIndex: 5 },
// });
