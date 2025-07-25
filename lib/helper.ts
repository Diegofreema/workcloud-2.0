import axios from "axios";
import {
  format,
  formatDistanceToNow,
  isToday,
  isWithinInterval,
  isYesterday,
  parse,
  parseISO,
} from "date-fns";
import { DocumentPickerResult } from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

import { ChatDateGroup, DataType } from "~/constants/types";
import { Id } from "~/convex/_generated/dataModel";

import { ConvexError } from "convex/values";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

export const generateErrorMessage = (
  error: unknown,
  message: string,
): string => {
  return error instanceof ConvexError ? (error.data as string) : message;
};
// export async function download(imgUrl: string) {
//   const filename = 'image.png';
//   const result = await FileSystem.downloadAsync(imgUrl, FileSystem.documentDirectory + filename);

//   // Log the download result
//   console.log({ result });

//   // Save the downloaded file
//   await saveFile(result.uri, filename, result.headers['Content-Type']);
// }
// export const saveImageToGallery = async (imageUri: string): Promise<boolean> => {
//   let isDownloaded = false;
//   try {
//     // Request permissions
//     const { status } = await MediaLibrary.requestPermissionsAsync();
//     if (status !== 'granted') {
//       throw new Error('Permission not granted');
//     }
//     const downloadResult = await FileSystem.downloadAsync(
//       imageUri,
//       FileSystem.cacheDirectory + 'temp_image.jpg'
//     );
//     const localUri = downloadResult.uri;

//     // Read the file and convert to base64
//     const base64 = await FileSystem.readAsStringAsync(localUri, {
//       encoding: FileSystem.EncodingType.Base64,
//     });
//     // Clean up temporary file if we downloaded it

//     await FileSystem.deleteAsync(localUri);

//     // Generate unique filename
//     const filename = `${Date.now()}.jpg`;

//     // Define save path based on platform
//     const destinationUri = Platform.select({
//       ios: `${FileSystem.documentDirectory}${filename}`,
//       android: `${FileSystem.cacheDirectory}${filename}`,
//     });

//     if (!destinationUri) {
//       throw new Error('Could not determine file path');
//     }

//     // Download or copy the image
//     await FileSystem.copyAsync({
//       from: base64,
//       to: destinationUri,
//     });

//     // Save to device gallery
//     const asset = await MediaLibrary.createAssetAsync(destinationUri);
//     await MediaLibrary.createAlbumAsync('workcloud', asset, false);

//     // Clean up temporary file
//     await FileSystem.deleteAsync(destinationUri);
//     isDownloaded = true;
//     return isDownloaded;
//   } catch (error) {
//     console.error('Error saving image:', error);
//     throw error;
//   }
// };

export const createToken = async (userId: string) => {
  try {
    const { data: axiosData } = await axios.post(
      "https://workcloud-server-1.onrender.com/create-token",
      {
        id: userId,
      },
    );

    return axiosData.streamToken;
  } catch (error) {
    console.log(JSON.stringify(error, null, 1));
  }
};

export const checkLength = (value: string) => {
  if (!value) return "";
  if (value.length > 25) {
    return value.substring(0, 25) + "...";
  } else {
    return value;
  }
};

export const trimText = (text: string, maxLength: number = 20) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }

  return text;
};

export const uploadProfilePicture = async (
  generateUploadUrl: any,
  selectedImage?: string,
): Promise<{ storageId: Id<"_storage">; uploadUrl: string } | undefined> => {
  if (!selectedImage) return;
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(selectedImage);
  const blob = await response.blob();

  const result = await fetch(uploadUrl, {
    method: "POST",
    body: blob,
    headers: { "Content-Type": "image/jpeg" },
  });
  const { storageId } = await result.json();

  return { storageId, uploadUrl };
};
export const uploadDoc = async (
  selectedDoc: DocumentPickerResult | null,
  generateUploadUrl: any,
): Promise<{ storageId: Id<"_storage">; uploadUrl: string }> => {
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(selectedDoc?.assets?.[0]?.uri!);
  const blob = await response.blob();
  const result = await fetch(uploadUrl, {
    method: "POST",
    body: blob,
    headers: { "Content-Type": selectedDoc?.assets?.[0]?.mimeType! },
  });
  const { storageId } = await result.json();

  return { storageId, uploadUrl };
};

export function convertTimeToDateTime(timeString: string) {
  // Use current date as base, then parse the time
  const currentDate = new Date();
  return parse(
    `${currentDate.toISOString().split("T")[0]} ${timeString}`,
    "yyyy-MM-dd HH:mm",
    currentDate,
  );
}
export const convertStringToDate = (dateString: string): string => {
  const date = parse(dateString, "dd/MM/yyyy, HH:mm:ss", new Date());
  return formatDateToNowHelper(date);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function transformChatData(
  messages: DataType[],
  currentUserId: Id<"users">,
): ChatDateGroup[] {
  // Sort messages by creation time in descending order
  const groupedMessages: Record<string, ChatDateGroup> = {};

  messages.forEach((message) => {
    // Convert creation time to Date object
    const messageDate = new Date(message._creationTime);
    const formattedDate = messageDate.toISOString().split("T")[0];

    // Determine if the message is from the current user
    const isCurrentUser = message.senderId === currentUserId;

    // Create message object
    const transformedMessage = {
      id: message._id,
      text: message.content,
      isCurrentUser,
      timestamp: messageDate.toISOString(),
      _creationTime: message._creationTime, // Keep original creation time for sorting
    };

    // Add to grouped messages
    if (!groupedMessages[formattedDate]) {
      groupedMessages[formattedDate] = {
        title: formattedDate,
        data: [],
      };
    }

    groupedMessages[formattedDate].data.push(transformedMessage);
  });

  // Convert grouped messages to array, sort by date, and order messages chronologically
  return Object.values(groupedMessages)
    .sort((a, b) => new Date(b.title).getTime() - new Date(a.title).getTime())
    .map((group) => ({
      ...group,
      // @ts-expect-error
      data: group.data.sort((a, b) => a._creationTime - b._creationTime),
    }));
}

export const formatDateToNowHelper = (date: Date): string => {
  const formattedDistance = formatDistanceToNow(date);

  const replacements: Record<string, string> = {
    "less than a minute": "1 min",
    "1 minute": "1 min",
    minutes: "mins",
    "1 hour": "1 hr",
    hours: "hrs",
  };

  return Object.entries(replacements).reduce(
    (result, [search, replace]) => result.replace(search, replace),
    formattedDistance,
  );
};
export const now = format(Date.now(), "dd/MM/yyyy, HH:mm:ss");

export const checkIfOpen = (open: string, end: string): boolean => {
  const now = new Date();

  const openTime = parse(open, "HH:mm", now);

  const closeTime = parse(end, "HH:mm", now);

  return isWithinInterval(now, {
    start: openTime,
    end: closeTime,
  });
};

export const calculateRatingStats = (
  reviews: { stars: number; count: number }[],
) => {
  // Calculate total ratings
  const totalRatings = reviews.reduce((acc, curr) => acc + curr.count, 0);

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, curr) => {
      return acc + curr.stars * curr.count;
    }, 0) / totalRatings;

  // Calculate percentages for each star rating
  const ratingPercentages = reviews.map((review) => ({
    ...review,
    percentage: Math.round((review.count / totalRatings) * 100),
  }));

  return {
    averageRating: Number(averageRating.toFixed(1)),
    totalRatings,
    ratingPercentages,
  };
};

export const filterChannels = async (channels: any[], query: string) => {
  if (!query) return []; // Return all channels if no query is provided

  // Use Promise.all to handle async operations
  const filteredChannels = await Promise.all(
    channels.map(async (channel) => {
      // Query members for the channel
      const memberResponse = await channel.queryMembers({});

      // Check if the channel name or member name matches the query
      const isNameMatch = channel.data?.name?.includes(query);
      const isMemberMatch = memberResponse.members.some(
        (member: { user: { name: string | string[] } }) =>
          member.user?.name?.includes(query),
      );

      // Return the channel if it matches the query
      return isNameMatch || isMemberMatch ? channel : null;
    }),
  );

  // Filter out null values (channels that didn't match the query)
  return filteredChannels.filter((channel: null) => channel !== null) as any[];
};

export const sliceArray = <T>(array: T[], length = 10): T[] => {
  return array?.slice(0, length);
};

export const downloadPdf = async (fileUrl: string) => {
  const filename = `${new Date().getTime()}.pdf`;
  const fileType = "pdf";
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      new Error(
        status === "denied"
          ? "Please allow permissions to save files"
          : "Permission request failed",
      );
    }
    const result = await FileSystem.downloadAsync(
      fileUrl,
      FileSystem.documentDirectory + filename,
    );
    if (result.status !== 200) {
      new Error(
        `Download failed with status ${result.status}: ${
          result.headers["Status-Message"] || "Unknown error"
        }`,
      );
    }
    await save(result.uri, filename, "application/pdf");
    return "saved";
  } catch (error) {
    console.error(`Download Error (${fileType}):`, error);
    throw new Error(
      `Failed to download ${fileType}: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }
};

export const downloadAndSaveFile = async (
  fileUrl: string,
  fileType: "image" | "pdf",
): Promise<string> => {
  const extension = fileType === "image" ? "jpg" : "pdf";
  const mimeType = fileType === "image" ? "image/jpeg" : "application/pdf";
  const fileName = `${new Date().getTime()}.${extension}`;
  const fileUri = `${FileSystem.cacheDirectory}${fileName}`; // Use cache for temporary storage

  // Remove mode=admin from URL
  const cleanUrl = fileUrl.replace(/&mode=admin/, "");

  try {
    // Request permissions for both image and PDF
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") {
      new Error(
        status === "denied"
          ? "Please allow permissions to save files"
          : "Permission request failed",
      );
    }

    // Download the file
    const res = await FileSystem.downloadAsync(cleanUrl, fileUri, {
      headers: {
        // Add headers if needed for Appwrite authentication
        // 'Authorization': 'Bearer YOUR_TOKEN',
      },
    });

    console.log("Download Response:", {
      status: res.status,
      headers: res.headers,
      uri: fileUri,
    });

    if (res.status !== 200) {
      new Error(
        `Download failed with status ${res.status}: ${
          res.headers["Status-Message"] || "Unknown error"
        }`,
      );
    }

    // Verify file exists and has content
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    console.log("File Info:", fileInfo);
    if (!fileInfo.exists || fileInfo.size === 0) {
      new Error(`Downloaded file is empty or missing: ${fileUri}`);
    }

    // Verify MIME type
    if (
      fileType === "pdf" &&
      res.headers["Content-Type"] &&
      !res.headers["Content-Type"].includes("application/pdf")
    ) {
      new Error(
        `Downloaded file is not a PDF: Content-Type=${res.headers["Content-Type"]}`,
      );
    } else if (
      fileType === "image" &&
      res.headers["Content-Type"] &&
      !res.headers["Content-Type"].includes("image/jpeg")
    ) {
      new Error(
        `Downloaded file is not an image: Content-Type=${res.headers["Content-Type"]}`,
      );
    }

    // Save the file to the device
    const result = await saveFile(fileUri, mimeType, fileType, fileName);

    // Optionally open the file
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(fileUri, {
        mimeType,
        dialogTitle: `Open ${fileType}`,
        UTI: fileType === "pdf" ? "com.adobe.pdf" : "public.jpeg", // iOS-specific UTI
      });
    }

    return result;
  } catch (err) {
    console.error(`Download Error (${fileType}):`, err);
    throw new Error(
      `Failed to download ${fileType}: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    );
  }
};

const saveFile = async (
  tempUri: string,
  mimeType: string,
  fileType: "image" | "pdf",
  fileName: string,
): Promise<string> => {
  try {
    if (fileType === "image") {
      // Save images to MediaLibrary
      const assetUri = tempUri.startsWith("file://")
        ? tempUri
        : `file://${tempUri}`;
      const asset = await MediaLibrary.createAssetAsync(assetUri);
      console.log("Asset Created:", asset);

      const albumName = "MyAppImages";
      let album = await MediaLibrary.getAlbumAsync(albumName);

      if (album == null) {
        await MediaLibrary.createAlbumAsync(albumName, asset, false);
        console.log("Album Created:", albumName);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        console.log("Asset Added to Album:", albumName);
      }

      console.log(`Image saved to ${albumName}: ${fileName}`);
      return "saved";
    } else {
      // Save PDFs to documentDirectory (Downloads folder)
      const downloadsDir = `${FileSystem.documentDirectory}Downloads/`;

      // Create Downloads folder if it doesn't exist
      await FileSystem.makeDirectoryAsync(downloadsDir, {
        intermediates: true,
      });

      const targetUri = `${downloadsDir}${fileName}`;
      await FileSystem.moveAsync({
        from: tempUri,
        to: targetUri,
      });

      // Verify the file was moved
      const targetInfo = await FileSystem.getInfoAsync(targetUri);
      console.log("Target File Info:", targetInfo);
      if (!targetInfo.exists || targetInfo.size === 0) {
        new Error(`Failed to move PDF to ${targetUri}`);
      }

      console.log(`PDF saved to ${downloadsDir}: ${fileName}`);
      return "saved";
    }
  } catch (err) {
    console.error(`Save Error (${fileType}):`, err);
    throw new Error(
      `Failed to save ${fileType}: ${
        err instanceof Error ? err.message : "Unknown error"
      }`,
    );
  }
};

const save = async (uri: string, filename: string, mimeType: string) => {
  if (Platform.OS === "android") {
    try {
      const permissions =
        await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (permissions.granted) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const newFileUri =
          await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            mimeType,
          );

        // Write the base64 content to the NEW file URI, not the original URI
        await FileSystem.writeAsStringAsync(newFileUri, base64, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  } else {
    await Sharing.shareAsync(uri);
  }
};

export const capitaliseFirstLetter = (string?: string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : "";
};

export const formatMessageTime = (timestamp: string | Date): string => {
  try {
    // Parse timestamp if it's a string
    const date =
      typeof timestamp === "string" ? parseISO(timestamp) : timestamp;

    if (isToday(date)) {
      // Today: Show time like "12:34 PM"
      return format(date, "h:mm a");
    } else if (isYesterday(date)) {
      // Yesterday: Show "Yesterday"
      return "Yesterday";
    } else {
      // Older: Show date like "MM/DD/YY"
      return format(date, "MM/dd/yy");
    }
  } catch (error) {
    console.error("Error formatting timestamp:", error);
    return "Invalid date";
  }
};
