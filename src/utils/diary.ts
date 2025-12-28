import type { DiaryEntry, DiaryChapter } from '@types';
import { getDiaryChapters, getDiaryEntryBySceneId, getAllDiaryEntries } from '../diaryLogs';

export function getUnlockedChapters(unlockedIds: string[]): DiaryChapter[] {
  const chapters = getDiaryChapters();
  return chapters
    .map(chapter => ({
      ...chapter,
      entries: chapter.entries.filter(entry => unlockedIds.includes(entry.id)),
    }))
    .filter(chapter => chapter.entries.length > 0);
}

export function checkForNewDiaryEntry(sceneId: string, unlockedIds: string[]): DiaryEntry | null {
  const entry = getDiaryEntryBySceneId(sceneId);
  if (entry && !unlockedIds.includes(entry.id)) {
    return entry;
  }
  return null;
}

export { getDiaryChapters, getDiaryEntryBySceneId, getAllDiaryEntries };
