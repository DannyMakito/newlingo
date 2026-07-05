import {
  lessons,
  spanishBasicsPhrases,
  spanishBasicsVocabulary,
} from '@/data/lessons';
import { languages } from '@/data/languages';
import type { Lesson, Phrase, Vocabulary } from '@/types/learning';

export const AI_TEACHER_USER_ID = 'ai_teacher';

const vocabularyById = Object.fromEntries(
  spanishBasicsVocabulary.map((item) => [item.id, item]),
);

const phrasesById = Object.fromEntries(
  spanishBasicsPhrases.map((item) => [item.id, item]),
);

export interface LessonCallCustomData {
  lessonId: string;
  languageId: string;
  languageName: string;
  lessonTitle: string;
  lessonDescription: string;
  goals: string[];
  vocabulary: Vocabulary[];
  phrases: Phrase[];
  aiTeacherPrompt: string;
}

function resolveLessonVocabulary(lesson: Lesson): Vocabulary[] {
  return lesson.activities
    .filter((activity) => activity.type === 'vocabulary' && activity.vocabularyId)
    .map((activity) => vocabularyById[activity.vocabularyId!])
    .filter(Boolean);
}

function resolveLessonPhrases(lesson: Lesson): Phrase[] {
  return lesson.activities
    .filter((activity) => activity.type === 'phrase' && activity.phraseId)
    .map((activity) => phrasesById[activity.phraseId!])
    .filter(Boolean);
}

function resolveAiTeacherPrompt(lesson: Lesson): string {
  const videoActivity = lesson.activities.find(
    (activity) => activity.type === 'video' && activity.prompt,
  );
  if (videoActivity?.prompt) {
    return videoActivity.prompt;
  }

  const chatActivity = lesson.activities.find(
    (activity) => activity.type === 'chat' && activity.prompt,
  );

  return chatActivity?.prompt ?? '';
}

export function buildLessonCallCustomData(
  lessonId: string,
  languageId: string,
): LessonCallCustomData {
  const lesson = lessons.find((item) => item.id === lessonId);
  const language = languages.find((item) => item.id === languageId);

  if (!lesson) {
    return {
      lessonId,
      languageId,
      languageName: language?.name ?? languageId,
      lessonTitle: 'Language lesson',
      lessonDescription: '',
      goals: [],
      vocabulary: [],
      phrases: [],
      aiTeacherPrompt: '',
    };
  }

  return {
    lessonId: lesson.id,
    languageId,
    languageName: language?.name ?? languageId,
    lessonTitle: lesson.title,
    lessonDescription: lesson.description,
    goals: lesson.goals,
    vocabulary: resolveLessonVocabulary(lesson),
    phrases: resolveLessonPhrases(lesson),
    aiTeacherPrompt: resolveAiTeacherPrompt(lesson),
  };
}
