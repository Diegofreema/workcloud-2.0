import { Download } from 'lucide-react-native';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { downloadAndSaveImage } from '~/lib/helper';

type Props = {
  url: string;
};

export const DownloadBlurView = ({ url }: Props): JSX.Element => {
  const [downloading, setDownloading] = useState(false);
  const onDownload = async () => {
    setDownloading(true);
    try {
      await downloadAndSaveImage(url);
    } catch (e) {
      console.log(e);
    } finally {
      setDownloading(false);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onDownload} disabled={downloading}>
        {downloading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Download size={30} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: 50,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});
