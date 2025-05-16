import { convexQuery } from '@convex-dev/react-query';
import { AntDesign } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { Pressable } from 'react-native';

import { DeletePostModal } from '~/components/Dialogs/DeletePost';
import { HeaderNav } from '~/components/HeaderNav';
import { PostComponent } from '~/components/PostComponent';
import { Container } from '~/components/Ui/Container';
import { ErrorComponent } from '~/components/Ui/ErrorComponent';
import { ImagePreview } from '~/components/Ui/ImagePreview';
import { LoadingComponent } from '~/components/Ui/LoadingComponent';
import { api } from '~/convex/_generated/api';
import { Id } from '~/convex/_generated/dataModel';
import { useDarkMode } from '~/hooks/useDarkMode';
import { useImagePreview } from '~/hooks/useImagePreview';

const Posts = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isPending, isRefetching, refetch, isPaused, isError, isRefetchError } = useQuery(
    convexQuery(api.organisation.getPostsByOrganizationId, {
      organizationId: id as Id<'organizations'>,
    })
  );
  if (isError || isPaused || isRefetchError) {
    return <ErrorComponent refetch={refetch} />;
  }
  if (isPending) {
    return <LoadingComponent />;
  }

  return (
    <>
      <ImagePreview />
      <Container>
        <HeaderNav title="Posts" RightComponent={RightComponent} />
        <DeletePostModal />
        <PostComponent isRefetching={isRefetching} refetch={refetch} imgUrls={data} />
      </Container>
    </>
  );
};

export default Posts;

const RightComponent = () => {
  const { darkMode } = useDarkMode();

  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const getUrl = useImagePreview((state) => state.getUrl);
  const onOpen = useImagePreview((state) => state.onOpen);
  const pickImageAsync = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled) {
      const res = result.assets[0];
      setSelectedImage(res);
      getUrl(res?.uri, selectedImage!);
      onOpen();
    }
  };

  console.log(selectedImage);

  return (
    <Pressable onPress={pickImageAsync} style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}>
      <AntDesign name="pluscircleo" size={24} color={darkMode === 'dark' ? 'white' : 'black'} />
    </Pressable>
  );
};
