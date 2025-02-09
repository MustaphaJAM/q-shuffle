import { ReactNode } from 'react';

export interface StudentRegistrationData {
  studentName: string;
  studentSurname: string;
  studentCNE: string;
}

export interface Question {
  id: string;
  text: string;
  image?: string;
  options: string[];
}

export interface Answer {
  questionId: string;
  selectedOptions: number[];
  timeSpent: number;
}

export interface ExamSession {
  sessionId: string;
  allowNavigation: boolean;
}

export interface ExamResult {
  score: number | null; // Allow null values
  passed: boolean | null; // Allow null values
  message: string | null; // Change from ReactNode to string | null
  answersSubmitted: number;
  showResults?: boolean; // Optional, since it's not used in your code
}
