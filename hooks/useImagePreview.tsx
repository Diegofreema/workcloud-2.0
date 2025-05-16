import * as ImagePicker from 'expo-image-picker';
import { create } from 'zustand';

type ImagePreviewProps = {
  url: string;
  getUrl: (url: string, selectedImage: ImagePicker.ImagePickerAsset) => void;
  removeUrl: () => void;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  selectedImage: ImagePicker.ImagePickerAsset | null;
};

export const useImagePreview = create<ImagePreviewProps>((set) => ({
  url: '',
  isOpen: false,
  getUrl: (url: string, selectedImage: ImagePicker.ImagePickerAsset) =>
    set((state) => ({ ...state, url, selectedImage })),
  removeUrl: () => set((state) => ({ ...state, url: '', selectedImage: null })),
  onClose: () => set((state) => ({ ...state, isOpen: false })),
  onOpen: () => set((state) => ({ ...state, isOpen: true })),
  selectedImage: null,
}));
