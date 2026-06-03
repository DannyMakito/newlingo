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

import { images } from '../constants/images';

export const lessons: Lesson[] = [
  {
    id: 'lesson-1-es',
    unitId: 'unit-1-es',
    title: 'Greetings',
    description: 'Learn how to say hello and goodbye.',
    image: images.treasure,
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
  {
    id: 'lesson-2-es',
    unitId: 'unit-1-es',
    title: 'Polite Phrases',
    description: 'Learn how to say please and sorry.',
    image: 'https://picsum.photos/seed/lesson2es/200',
    goals: ['Say please', 'Say sorry'],
    activities: [],
  },
  {
    id: 'lesson-3-es',
    unitId: 'unit-1-es',
    title: 'Introductions',
    description: 'Introduce yourself.',
    image: 'https://picsum.photos/seed/lesson3es/200',
    goals: ['Introduce yourself'],
    activities: [],
  },
  {
    id: 'lesson-4-es',
    unitId: 'unit-2-es',
    title: 'Ordering Coffee',
    description: 'Order a coffee in a cafe.',
    image: 'https://picsum.photos/seed/lesson4es/200',
    goals: ['Order coffee'],
    activities: [],
  },
  {
    id: 'lesson-5-es',
    unitId: 'unit-2-es',
    title: 'Ordering Food',
    description: 'Order a meal in a restaurant.',
    image: 'https://picsum.photos/seed/lesson5es/200',
    goals: ['Order food'],
    activities: [],
  },
  {
    id: 'lesson-1-fr',
    unitId: 'unit-1-fr',
    title: 'Greetings',
    description: 'Learn how to say hello and goodbye.',
    image: images.palace,
    goals: ['Say hello', 'Say goodbye'],
    activities: [],
  },
  {
    id: 'lesson-2-fr',
    unitId: 'unit-1-fr',
    title: 'Polite Phrases',
    description: 'Learn how to say please and sorry.',
    image: 'https://picsum.photos/seed/lesson2fr/200',
    goals: ['Say please', 'Say sorry'],
    activities: [],
  },
  {
    id: 'lesson-3-fr',
    unitId: 'unit-1-fr',
    title: 'Introductions',
    description: 'Introduce yourself.',
    image: 'https://picsum.photos/seed/lesson3fr/200',
    goals: ['Introduce yourself'],
    activities: [],
  },
  {
    id: 'lesson-4-fr',
    unitId: 'unit-1-fr',
    title: 'Numbers 1-10',
    description: 'Learn to count.',
    image: 'https://picsum.photos/seed/lesson4fr/200',
    goals: ['Count to 10'],
    activities: [],
  },
  {
    id: 'lesson-5-fr',
    unitId: 'unit-1-fr',
    title: 'Family',
    description: 'Talk about your family.',
    image: 'https://picsum.photos/seed/lesson5fr/200',
    goals: ['Family members'],
    activities: [],
  },
];
