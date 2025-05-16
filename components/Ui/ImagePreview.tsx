import { useMutation } from 'convex/react';
import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';
import { toast } from 'sonner-native';

import { HStack } from '~/components/HStack';
import { MyButton } from '~/components/Ui/MyButton';
import { MyText } from '~/components/Ui/MyText';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useImagePreview } from '~/hooks/useImagePreview';
import { uploadProfilePicture } from '~/lib/helper';

export const ImagePreview = () => {
  const { darkMode } = useDarkMode();
  const [loading, setLoading] = useState(false);
  const { id } = useLocalSearchParams<{ id: Id<'organizations'> }>();
  const createPosts = useMutation(api.organisation.createPosts);
  const isOpen = useImagePreview((state) => state.isOpen);
  const onClose = useImagePreview((state) => state.onClose);
  const selectedImage = useImagePreview((state) => state.selectedImage);
  const img = useImagePreview((state) => state.url);
  const removeUrl = useImagePreview((state) => state.removeUrl);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  console.log(img);
  const handleClose = () => {
    removeUrl();
    onClose();
  };
  const onSubmitImage = async () => {
    setLoading(true);
    if (!id) return;
    try {
      const { storageId } = await uploadProfilePicture(selectedImage, generateUploadUrl);
      await createPosts({ organizationId: id, storageId });
      toast.success('Uploaded image');
      removeUrl();
      onClose();
    } catch (e) {
      console.log(e);
      toast.error('Error uploading image');
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
      backdropColor={darkMode === 'dark' ? 'white' : 'black'}>
      <View
        style={[
          styles.container,
          {
            backgroundColor: darkMode === 'dark' ? 'black' : 'white',
          },
        ]}>
        <Image
          style={{ width: '100%', height: 300, borderRadius: 8 }}
          source={img}
          contentFit="cover"
        />

        <HStack gap={10}>
          <View style={{ flex: 1 }}>
            <MyButton onPress={handleClose} buttonStyle={{ width: '100%', backgroundColor: 'red' }}>
              <MyText poppins="Medium" fontSize={13} style={{ color: 'white' }}>
                Cancel
              </MyText>
            </MyButton>
          </View>
          <View style={{ flex: 1 }}>
            <MyButton disabled={loading} onPress={onSubmitImage} buttonStyle={{ width: '100%' }}>
              <MyText poppins="Medium" fontSize={13} style={{ color: 'white' }}>
                Upload
              </MyText>
            </MyButton>
          </View>
        </HStack>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 400,
  },
  text: {
    fontFamily: 'PoppinsMedium',
    fontSize: 16,
  },
  close: {
    padding: 5,
  },
});
