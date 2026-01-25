import axios, { isAxiosError } from 'axios';
import {
  format,
  formatDistanceToNow,
  isToday,
  isWithinInterval,
  isYesterday,
  parse,
  parseISO,
} from 'date-fns';
import { DocumentPickerResult } from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

import { Id } from '~/convex/_generated/dataModel';

import { ConvexError } from 'convex/values';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { ChatDateGroup, DataType } from '~/constants/types';

export const generateErrorMessage = (
  error: unknown,
  message: string,
): string => {
  return error instanceof ConvexError
    ? error.data?.message || message
    : message;
};

export const createToken = async (userId: string) => {
  try {
    const { data: axiosData } = await axios.post(
      'https://workcloud-server-1.onrender.com/create-token',
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
  selectedImage?: string,
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
export const uploadAudio = async (
  generateUploadUrl: any,
  selectedImage?: string,
): Promise<{ storageId: Id<'_storage'>; uploadUrl: string } | undefined> => {
  if (!selectedImage) return;
  const uploadUrl = await generateUploadUrl();

  const response = await fetch(selectedImage);
  const blob = await response.blob();

  const result = await fetch(uploadUrl, {
    method: 'POST',
    body: blob,
    headers: { 'Content-Type': 'audio/mp4' },
  });
  const { storageId } = await result.json();

  return { storageId, uploadUrl };
};
export const uploadDoc = async (
  selectedDoc: DocumentPickerResult | null,
  generateUploadUrl: any,
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
    currentDate,
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
  currentUserId: Id<'users'>,
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
    formattedDistance,
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

export const capitaliseFirstLetter = (string?: string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : '';
};

export const formatMessageTime = (timestamp: string | Date): string => {
  try {
    // Parse timestamp if it's a string
    const date =
      typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;

    if (isToday(date)) {
      // Today: Show time like "12:34 PM"
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      // Yesterday: Show "Yesterday"
      return 'Yesterday';
    } else {
      // Older: Show date like "MM/DD/YY"
      return format(date, 'MM/dd/yy');
    }
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return 'Invalid date';
  }
};

export const benefits = {
  business_plan: ['Add up to 5 staffs', 'Access to all core features'],
  business_plan_pro: [
    'Add up to 10 staffs',
    'Automatic verification',
    'Collaboration (coming soon)',
    'View staffs analytics (coming soon)',
    'Inside view',
  ],
  enterprise_plan: [
    'Unlimited staff member',
    'Collaboration (coming soon)',
    'View staffs analytics (coming soon)',
    'Inside view',
  ],
};

export const STAFF_LIMITS = {
  FREE: 1,
  PRO: 5,
  BUSINESS_PRO: 10,
  ENTERPRISE: Infinity, // or a specific high number
};

export const getCurrentPlan = (
  isPro: boolean,
  isBusinessPlanPro: boolean,
  isEnterprisePlan: boolean,
) => {
  if (isEnterprisePlan) return 'ENTERPRISE';
  if (isBusinessPlanPro) return 'BUSINESS_PRO';
  if (isPro) return 'PRO';
  return 'FREE';
};
export const handleRetry = (failureCount: number, error: any) =>
  isAxiosError(error) && error.response?.status === 401
    ? false
    : failureCount < 2;
