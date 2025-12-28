import chapter1 from './chapter1.json';
import type { DiaryEntry, DiaryChapter } from '@types';

const allChapters: DiaryChapter[] = [
  chapter1 as DiaryChapter,
];

export function getDiaryChapters(): DiaryChapter[] {
  return allChapters;
}

export function getAllDiaryEntries(): DiaryEntry[] {
  return allChapters.flatMap(chapter => chapter.entries);
}

export function getDiaryEntryBySceneId(sceneId: string): DiaryEntry | undefined {
  return getAllDiaryEntries().find(entry => entry.unlockSceneId === sceneId);
}
