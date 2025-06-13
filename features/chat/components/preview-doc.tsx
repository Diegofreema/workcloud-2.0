import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";
import { DownloadBlurView } from "~/features/chat/components/download-blur-view";
import PDFViewer from "~/features/chat/components/pdf-viewer";

type Props = {
  uri: string;
};

export const PreviewDoc = ({ uri }: Props) => {
  const router = useRouter();

  const url = uri.replace("view", "download");

  // const getFileUrl = async () => {
  //   const result = storage.getFileDownload(BUCKET_ID, fileId);

  //   console.log(result);
  // };
  const onPress = () => {
    router.back();
  };
  return (
    <>
      <PDFViewer pdfUrl={uri} style={styles.pdf} />
      <DownloadBlurView url={url} onClose={onPress} type="pdf" />
    </>
  );
};

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
  },
});
