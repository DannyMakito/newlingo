import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProgressState {
  streak: number;
  currentXP: number;
  targetXP: number;
  setStreak: (streak: number) => void;
  setCurrentXP: (xp: number) => void;
  setTargetXP: (xp: number) => void;
}

export const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set) => ({
      streak: 12,
      currentXP: 15,
      targetXP: 20,
      setStreak: (streak) => set({ streak }),
      setCurrentXP: (currentXP) => set({ currentXP }),
      setTargetXP: (targetXP) => set({ targetXP }),
    }),
    {
      name: 'user-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
