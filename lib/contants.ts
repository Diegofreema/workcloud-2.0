export const APPWRITE_PROJECT_ID = '681b3f0a00211d68896c';

import { ImageStyle, StyleSheet, TextStyle, ViewStyle } from 'react-native';

export const sizes = {
  xxs: 1,
  xs: 2,
  s: 4,
  sm: 6,
  m: 8,
  ml: 12,
  l: 16,
  lxl: 20,
  xl: 24,
  xxl: 30,
  xxxl: 36,
};

type FlexStyle = ViewStyle | TextStyle | ImageStyle;

const directionRow: FlexStyle = {
  flexDirection: 'row',
};
const itemsCenter: FlexStyle = {
  alignItems: 'center',
};
const itemsEnd: FlexStyle = {
  alignItems: 'flex-end',
};
const contentSpaceBetween: FlexStyle = {
  justifyContent: 'space-between',
};

const contentEnd: FlexStyle = {
  justifyContent: 'flex-end',
};

const contentCenter: FlexStyle = {
  justifyContent: 'center',
};

const flex1: FlexStyle = {
  flex: 1,
};

export const directionRowItemsCenter: FlexStyle = {
  ...directionRow,
  alignItems: 'center',
};
export const directionRowItemsEnd: FlexStyle = {
  ...directionRow,
  alignItems: 'flex-end',
};
