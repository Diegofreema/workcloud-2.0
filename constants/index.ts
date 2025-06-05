import {Reaction_Enum} from "~/constants/types";

export const defaultStyle = {
  paddingHorizontal: 15,
};

export const days = [
  {
    key: 'Sunday',
    value: 'Sunday',
  },
  {
    key: 'Monday',
    value: 'Monday',
  },
  {
    key: 'Tuesday',
    value: 'Tuesday',
  },
  {
    key: 'Wednesday',
    value: 'Wednesday',
  },
  {
    key: 'Thursday',
    value: 'Thursday',
  },
  {
    key: 'Friday',
    value: 'Friday',
  },
  {
    label: 'Saturday',
    value: 'Saturday',
  },
];

export const fontFamily = {
  Bold: 'PoppinsBold',
  Light: 'PoppinsLight',
  Medium: 'PoppinsMedium',
  BoldItalic: 'PoppinsBoldItalic',
  LightItalic: 'PoppinsLightItalic',
};

export const emojis = [
  { value: Reaction_Enum.LIKE, emoji: '👍' },
  { value: Reaction_Enum.LOVE, emoji: '❤️' },
  { value: Reaction_Enum.LAUGH, emoji: '😂' },
  { value: Reaction_Enum.WOW, emoji: '😮' },
  { value: Reaction_Enum.SAD, emoji: '😢' },
  { value: Reaction_Enum.ANGRY, emoji: '😡' },
];