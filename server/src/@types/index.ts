import { Types } from 'mongoose'

// Account interface
export interface Account {
  username: string;
  password: string;
  role: 'user' | 'admin';
  nativeLanguage?: string;
  learningLanguages?: string[];
}

export interface Progress {
  userId: Types.ObjectId 
  totalLessons: number
  wordsLearned: number
  daysStreak: number
  weeklyProgress: number[]
}