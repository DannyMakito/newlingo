export interface Language {
  id: string; // e.g., 'es', 'fr'
  name: string; // e.g., 'Spanish', 'French'
  flag: string; // e.g., '🇪🇸', '🇫🇷'
}

export interface Vocabulary {
  id: string;
  word: string;
  translation: string;
  pronunciation?: string;
}

export interface Phrase {
  id: string;
  phrase: string;
  translation: string;
  pronunciation?: string;
}

export interface Activity {
  id: string;
  type: 'vocabulary' | 'phrase' | 'chat' | 'video';
  vocabularyId?: string; // If type is vocabulary
  phraseId?: string; // If type is phrase
  prompt?: string; // For chat or video activities (AI teacher prompt)
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  goals: string[];
  activities: Activity[];
}

export interface Unit {
  id: string;
  languageId: string;
  title: string;
  description: string;
  order: number;
}
