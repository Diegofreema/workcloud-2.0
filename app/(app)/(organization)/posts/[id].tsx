import { AntDesign } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable } from 'react-native';

import { DeletePostModal } from '~/components/Dialogs/DeletePost';
import { HeaderNav } from '~/components/HeaderNav';
import { PostComponent } from '~/components/PostComponent';
import { Container } from '~/components/Ui/Container';
import { ImagePreview } from '~/components/Ui/ImagePreview';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useTheme } from '~/hooks/use-theme';
import { useImagePreview } from '~/hooks/useImagePreview';

const Posts = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const data = useQuery(api.organisation.getPostsByOrganizationId, {
    organizationId: id as Id<'organizations'>,
  });

  if (data === undefined) {
    return <LoadingComponent />;
  }

  return (
    <>
      <ImagePreview />
      <Container>
        <HeaderNav title="Posts" rightComponent={<RightComponent />} />
        <DeletePostModal />
        <PostComponent imgUrls={data} />
      </Container>
    </>
  );
};

export default Posts;

const RightComponent = () => {
  const { theme: darkMode } = useTheme();

  const [selectedImage, setSelectedImage] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const getUrl = useImagePreview((state) => state.getUrl);
  const onOpen = useImagePreview((state) => state.onOpen);
  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.4,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      const res = result.assets[0];
      setSelectedImage(res);
      getUrl(res?.uri, selectedImage!);
      onOpen();
    }
  };

  return (
    <Pressable
      onPress={pickImageAsync}
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
    >
      <AntDesign
        name="pluscircleo"
        size={24}
        color={darkMode === 'dark' ? 'white' : 'black'}
      />
    </Pressable>
  );
};
