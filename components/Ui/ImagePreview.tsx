import {useMutation} from "convex/react";
import {Image} from "expo-image";
import {useLocalSearchParams} from "expo-router";
import {useState} from "react";
import {StyleSheet, View} from "react-native";
import Modal from "react-native-modal";
import {toast} from "sonner-native";

import {HStack} from "~/components/HStack";
import {api} from "~/convex/_generated/api";
import {Id} from "~/convex/_generated/dataModel";
import {useDarkMode} from "~/hooks/useDarkMode";
import {useImagePreview} from "~/hooks/useImagePreview";
import {uploadProfilePicture} from "~/lib/helper";
import {Button} from "~/features/common/components/Button";
import {colors} from "~/constants/Colors";

export const ImagePreview = () => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams<{ id: Id<"organizations"> }>();
  const createPosts = useMutation(api.organisation.createPosts);
  const isOpen = useImagePreview((state) => state.isOpen);
  const onClose = useImagePreview((state) => state.onClose);
  const img = useImagePreview((state) => state.url);
  const removeUrl = useImagePreview((state) => state.removeUrl);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const handleClose = () => {
    removeUrl();
    onClose();
  };
  const onSubmitImage = async () => {
    setLoading(true);
    if (!id) return;
    try {
      const res = await uploadProfilePicture(generateUploadUrl, img);
      // console.log({ uri: selectedImage?.uri });
      if (!res?.storageId) {
        toast.error("No image storage id");
        return;
      }
      await createPosts({ organizationId: id, storageId: res?.storageId });
      toast.success("Uploaded image");
      removeUrl();
      onClose();
    } catch (e) {
      console.log(e);
      toast.error("Error uploading image");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Modal
      hasBackdrop
      onDismiss={handleClose}
      animationIn="slideInDown"
      isVisible={isOpen}
      onBackButtonPress={handleClose}
      onBackdropPress={handleClose}
      backdropColor={darkMode === "dark" ? "white" : "black"}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkMode === "dark" ? "black" : "white",
          },
        ]}
      >
        <Image
          style={{ width: "100%", height: 300, borderRadius: 8 }}
          source={img}
          contentFit="cover"
        />

        <HStack gap={10}>
          <Button
            title={"Cancel"}
            onPress={handleClose}
            style={{ backgroundColor: colors.closeTextColor, flex: 1 }}
          />

          <Button
            disabled={loading}
            loadingTitle={"Uploading..."}
            loading={loading}
            title={"Upload"}
            onPress={onSubmitImage}
            style={{ backgroundColor: colors.dialPad, flex: 1 }}
          />
        </HStack>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    height: 400,
  },
  text: {
    fontFamily: "PoppinsMedium",
    fontSize: 16,
  },
  close: {
    padding: 5,
  },
});
