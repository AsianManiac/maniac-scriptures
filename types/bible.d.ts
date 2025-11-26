export interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface Chapter {
  book: string;
  chapter: number;
  verses: Verse[];
}

export interface Book {
  id: string;
  name: string;
  testament: "old" | "new";
  chapters: number;
}

export interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
}

export interface Highlight {
  id: string;
  reference: VerseReference;
  color: string;
  createdAt: string;
}

export interface Note {
  id: string;
  reference?: VerseReference;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  reference: VerseReference;
  collectionId?: string;
  createdAt: string;
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  verses: VerseReference[];
  createdAt: string;
}

export interface Devotional {
  id: string;
  title: string;
  content: string;
  verseReference: VerseReference;
  verseText: string;
  category: string;
  date: string;
}

export interface ReadingPlan {
  id: string;
  name: string;
  description: string;
  duration: number;
  readings: ReadingPlanDay[];
  progress: number[];
  startDate?: string;
}

export interface ReadingPlanDay {
  day: number;
  references: VerseReference[];
  completed: boolean;
}

export interface ReadingHistory {
  reference: VerseReference;
  timestamp: string;
}

export interface UserSettings {
  theme: "light" | "dark" | "system";
  fontSize: number;
  lineSpacing: number;
  notifications: boolean;
  dailyReminderTime?: string;
}
