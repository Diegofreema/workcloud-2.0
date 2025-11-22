import { RecorderState } from 'expo-audio';
import { create } from 'zustand';

type Store = {
  recorderState: RecorderState;
  setRecordingState: (recorderState: RecorderState) => void;
  clear: () => void;
};

export const useRecording = create<Store>((set) => ({
  recorderState: {} as RecorderState,
  setRecordingState: (recorderState) => set({ recorderState }),
  clear: () => set({ recorderState: {} as RecorderState }),
}));

type Minutes = {
  minutes: number;
  setMinutes: (minutes: number) => void;
  clear: () => void;
};

export const useMinutes = create<Minutes>((set) => ({
  minutes: 0,
  setMinutes: (minutes) => set({ minutes }),
  clear: () => set({ minutes: 0 }),
}));
