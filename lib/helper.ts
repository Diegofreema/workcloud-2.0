import axios from 'axios';
import { format, formatDistanceToNow, isWithinInterval, parse } from 'date-fns';
import { DocumentPickerResult } from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { ImagePickerAsset } from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { toast } from 'sonner-native';

import { ChatDateGroup, DataType } from '~/constants/types';
import {Doc, Id} from '~/convex/_generated/dataModel';
import { Channel } from 'stream-chat';
import {ConvexError} from "convex/values";

export const downloadAndSaveImage = async (imageUrl: string) => {
  const fileUri = FileSystem.documentDirectory + `${new Date().getTime()}.jpg`;

  try {
    const res = await FileSystem.downloadAsync(imageUrl, fileUri);
    return saveFile(res.uri);
  } catch (err) {
    console.log('FS Err: ', err);
  }
};

const saveFile = async (fileUri: string) => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  if (status === 'granted') {
    try {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      const album = await MediaLibrary.getAlbumAsync('Download');
      if (album == null) {
        const result = await MediaLibrary.createAlbumAsync('Download', asset, false);
        if (result) {
          toast.success('Image saved to Photos');
        }
      } else {
        const result = await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        if (result) {
          toast.success('Image saved to Photos');
        }
      }
    } catch (err) {
      console.log('Save err: ', err);
      toast.error('Failed to save image');
    }
  } else if (status === 'denied') {
    toast.error('please allow permissions to download');
  }
};
export const generateErrorMessage = (
    error: unknown,
    message: string
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
      'https://workcloud-server-1.onrender.com/create-token',
      {
        id: userId,
      }
    );

    return axiosData.streamToken;
  } catch (error) {
    console.log(JSON.stringify(error, null, 1));
  }
};

export const checkLength = (value: string) => {
  if (!value) return '';
  if (value.length > 25) {
    return value.substring(0, 25) + '...';
  } else {
    return value;
  }
};

export const trimText = (text: string, maxLength: number = 20) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }

  return text;
};

export const uploadProfilePicture = async (
    generateUploadUrl: any,
    selectedImage?: string
): Promise<{ storageId: Id<'_storage'>; uploadUrl: string } | undefined> => {
  if (!selectedImage) return;
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(selectedImage);
  const blob = await response.blob();

  const result = await fetch(uploadUrl, {
    method: 'POST',
    body: blob,
    headers: { 'Content-Type': 'image/jpeg' },
  });
  const { storageId } = await result.json();

  return { storageId, uploadUrl };
};
export const uploadDoc = async (
  selectedDoc: DocumentPickerResult | null,
  generateUploadUrl: any
): Promise<{ storageId: Id<'_storage'>; uploadUrl: string }> => {
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(selectedDoc?.assets?.[0]?.uri!);
  const blob = await response.blob();
  const result = await fetch(uploadUrl, {
    method: 'POST',
    body: blob,
    headers: { 'Content-Type': selectedDoc?.assets?.[0]?.mimeType! },
  });
  const { storageId } = await result.json();

  return { storageId, uploadUrl };
};

export function convertTimeToDateTime(timeString: string) {
  // Use current date as base, then parse the time
  const currentDate = new Date();
  return parse(
    `${currentDate.toISOString().split('T')[0]} ${timeString}`,
    'yyyy-MM-dd HH:mm',
    currentDate
  );
}
export const convertStringToDate = (dateString: string): string => {
  const date = parse(dateString, 'dd/MM/yyyy, HH:mm:ss', new Date());
  return formatDateToNowHelper(date);
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  }

  if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export function transformChatData(
  messages: DataType[],
  currentUserId: Id<'users'>
): ChatDateGroup[] {
  // Sort messages by creation time in descending order
  const groupedMessages: Record<string, ChatDateGroup> = {};

  messages.forEach((message) => {
    // Convert creation time to Date object
    const messageDate = new Date(message._creationTime);
    const formattedDate = messageDate.toISOString().split('T')[0];

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
    'less than a minute': '1 min',
    '1 minute': '1 min',
    minutes: 'mins',
    '1 hour': '1 hr',
    hours: 'hrs',
  };

  return Object.entries(replacements).reduce(
    (result, [search, replace]) => result.replace(search, replace),
    formattedDistance
  );
};
export const now = format(Date.now(), 'dd/MM/yyyy, HH:mm:ss');

export const checkIfOpen = (open: string, end: string): boolean => {
  const now = new Date();

  const openTime = parse(open, 'HH:mm', now);

  const closeTime = parse(end, 'HH:mm', now);

  return isWithinInterval(now, {
    start: openTime,
    end: closeTime,
  });
};

export const calculateRatingStats = (reviews: { stars: number; count: number }[]) => {
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

export const filterChannels = async (channels: Channel[], query: string) => {
  if (!query) return []; // Return all channels if no query is provided

  // Use Promise.all to handle async operations
  const filteredChannels = await Promise.all(
    channels.map(async (channel) => {
      // Query members for the channel
      const memberResponse = await channel.queryMembers({});

      // Check if the channel name or member name matches the query
      const isNameMatch = channel.data?.name?.includes(query);
      const isMemberMatch = memberResponse.members.some((member) =>
        member.user?.name?.includes(query)
      );

      // Return the channel if it matches the query
      return isNameMatch || isMemberMatch ? channel : null;
    })
  );

  // Filter out null values (channels that didn't match the query)
  return filteredChannels.filter((channel) => channel !== null) as Channel[];
};


export const sliceArray = <T>(array: T[], length = 10): T[] => {
  return array?.slice(0, length)
}