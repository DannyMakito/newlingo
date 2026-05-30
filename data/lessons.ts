import { Lesson, Vocabulary, Phrase } from '../types/learning';

export const spanishBasicsVocabulary: Vocabulary[] = [
  { id: 'vocab-hola', word: 'hola', translation: 'hello', pronunciation: 'oh-lah' },
  { id: 'vocab-adios', word: 'adiós', translation: 'goodbye', pronunciation: 'ah-dyohs' },
  { id: 'vocab-gracias', word: 'gracias', translation: 'thank you', pronunciation: 'grah-syahs' },
];

export const spanishBasicsPhrases: Phrase[] = [
  { id: 'phrase-como-estas', phrase: '¿Cómo estás?', translation: 'How are you?', pronunciation: 'koh-moh ehs-tahs' },
  { id: 'phrase-muy-bien', phrase: 'Muy bien, gracias', translation: 'Very well, thank you', pronunciation: 'mwee byehn grah-syahs' },
];

export const lessons: Lesson[] = [
  {
    id: 'lesson-1-es',
    unitId: 'unit-1-es',
    title: 'Greetings',
    description: 'Learn how to say hello and goodbye.',
    goals: ['Say hello', 'Say goodbye', 'Say thank you'],
    activities: [
      { id: 'act-1-1', type: 'vocabulary', vocabularyId: 'vocab-hola' },
      { id: 'act-1-2', type: 'vocabulary', vocabularyId: 'vocab-adios' },
      { id: 'act-1-3', type: 'vocabulary', vocabularyId: 'vocab-gracias' },
      { id: 'act-1-4', type: 'phrase', phraseId: 'phrase-como-estas' },
      { 
        id: 'act-1-5', 
        type: 'chat', 
        prompt: 'You are a friendly Spanish teacher. The user has just learned how to say hello, goodbye, and thank you. Have a short conversation where they can practice these words.' 
      },
      {
        id: 'act-1-6',
        type: 'video',
        prompt: 'You are an AI teacher. Pronounce "Hola", "Adiós", and "Gracias" clearly and ask the user to repeat after you. Wait for their audio response and provide feedback.'
      }
    ],
  },
];
