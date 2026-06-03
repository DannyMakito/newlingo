import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserProgressState {
  streak: number;
  currentXP: number;
  targetXP: number;
  completedLessons: string[];
  setStreak: (streak: number) => void;
  setCurrentXP: (xp: number) => void;
  setTargetXP: (xp: number) => void;
  markLessonCompleted: (lessonId: string) => void;
}

export const useUserProgressStore = create<UserProgressState>()(
  persist(
    (set) => ({
      streak: 0,
      currentXP: 0,
      targetXP: 20,
      completedLessons: [],
      setStreak: (streak) => set({ streak }),
      setCurrentXP: (currentXP) => set({ currentXP }),
      setTargetXP: (targetXP) => set({ targetXP }),
      markLessonCompleted: (lessonId) => set((state) => ({
        completedLessons: state.completedLessons.includes(lessonId) 
          ? state.completedLessons 
          : [...state.completedLessons, lessonId]
      })),
    }),
    {
      name: 'user-progress-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
