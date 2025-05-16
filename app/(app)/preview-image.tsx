import * as FileSystem from 'expo-file-system';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { Download, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { toast } from 'sonner-native';

const { height, width } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);
const PreviewImage = () => {
  const { uri } = useLocalSearchParams<{ uri: string }>();

  const [downloading, setDownloading] = useState(false);
  const [, setDownloadProgress] = useState(0);
  const callback = (p: any) => {
    const progress = p.totalBytesWritten / p.totalBytesExpectedToWrite;
    setDownloadProgress(progress);
  };
  const fileExt = new Date() + '.png';
  const downloadResumable = FileSystem.createDownloadResumable(
    uri,
    FileSystem.documentDirectory + fileExt,
    {},
    callback
  );
  const onDownload = async () => {
    try {
      const result = await downloadResumable.downloadAsync();
      console.log('Finished downloading to ', result);
    } catch (e) {
      console.error(e);
    }
  };
  const onSave = async () => {
    setDownloading(true);
    try {
      await onDownload();

      toast.success('Image has been saved successfully');
    } catch (e) {
      console.log(e);
    } finally {
      setDownloading(false);
    }
  };
  const onPress = () => {
    router.back();
    router.setParams({ uri: '' });
  };
  const closeBtn = () => {
    return (
      <TouchableOpacity onPress={onPress} style={[styles.cancel, { top: 40 }]}>
        <X color="white" size={30} />
      </TouchableOpacity>
    );
  };
  const save = () => {
    return (
      <TouchableOpacity
        onPress={onSave}
        style={styles.download}
        disabled={downloading}
      >
        {downloading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Download color="white" size={30} />
        )}
      </TouchableOpacity>
    );
  };
  return (
    <View style={{ height, width }}>
      {closeBtn()}
      <AnimatedImage
        sharedTransitionTag="shareTag"
        placeholder={require('~/assets/images/pl.png')}
        source={{ uri }}
        style={{ width: '100%', height: '100%' }}
        contentFit="cover"
      />
      {save()}
    </View>
  );
};
export default PreviewImage;

const styles = StyleSheet.create({
  cancel: { position: 'absolute', left: 20, top: height * 0.05, zIndex: 5 },
  download: { position: 'absolute', right: 20, bottom: 50, zIndex: 5 },
});
