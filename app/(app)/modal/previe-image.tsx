import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { DownloadBlurView } from '~/components/DownloadBlurView';
import { HeaderNav } from '~/components/HeaderNav';

const PreviewImage = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  console.log(url);

  return (
    // <Container style={{ justifyContent: 'center', alignItems: 'center' }} noPadding>
    <View style={{ flex: 1 }}>
      <HeaderNav title="" style={{ paddingHorizontal: 15 }} />
      <ImageZoom
        uri={url}
        style={{ width: '100%', height: '100%', flex: 1 }}
        minScale={0.5}
        maxPanPointers={1}
        maxScale={5}
        doubleTapScale={2}
        defaultSource={require('~/assets/images/pl.png')}
        isDoubleTapEnabled
        isSingleTapEnabled
        resizeMode="cover"
      />
      <DownloadBlurView url={url} />
    </View>
    // </Container>
  );
};

export default PreviewImage;
