export interface User {
  id: string;
  name: string;
  email: string;
  schoolName: string;
  plan: 'free' | 'pro' | 'school';
}

export enum Subject {
  Mathematics = 'Mathematics',
  English = 'English Language',
  BasicScience = 'Basic Science',
  SocialStudies = 'Social Studies',
  CivicEducation = 'Civic Education',
  ComputerScience = 'Computer Science',
  AgriculturalScience = 'Agricultural Science'
}

export enum GradeLevel {
  Primary1 = 'Primary 1',
  Primary2 = 'Primary 2',
  Primary3 = 'Primary 3',
  Primary4 = 'Primary 4',
  Primary5 = 'Primary 5',
  Primary6 = 'Primary 6',
  JSS1 = 'JSS 1',
  JSS2 = 'JSS 2',
  JSS3 = 'JSS 3',
  SSS1 = 'SSS 1',
  SSS2 = 'SSS 2',
  SSS3 = 'SSS 3'
}

export interface LessonAnalysis {
  mainTopic: string;
  learningObjectives: string[];
  keyConcepts: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: number; // in seconds
}

export interface DrawingElement {
  type: 'text' | 'rectangle' | 'circle' | 'line';
  content?: string; // For text
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  animationDelay: number; // ms
}

export interface Scene {
  sceneNumber: number;
  title: string;
  visualDescription: string;
  narrationScript: string;
  duration: number; // seconds
  elements: DrawingElement[];
}

export interface VideoProject {
  id: string;
  title: string;
  subject: Subject;
  grade: GradeLevel;
  createdAt: Date;
  status: 'draft' | 'processing' | 'completed';
  analysis?: LessonAnalysis;
  scenes?: Scene[];
}