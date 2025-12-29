import { getDiaryChapters, getDiaryRulesForChapter } from '../diaryLogs';
import { evaluateCondition } from './scenes';

export interface EvaluatedDiaryEntry {
  id: string;
  text: string;
}

export interface EvaluatedDiaryChapter {
  chapter: number;
  title: string;
  entries: EvaluatedDiaryEntry[];
}

// Evaluate diary rules against current flags and return matching entries
export function getUnlockedDiaryEntries(
  chapterNum: number,
  flags: Record<string, string | boolean | number>
): EvaluatedDiaryEntry[] {
  const rules = getDiaryRulesForChapter(chapterNum);
  return rules
    .filter(rule => evaluateCondition(rule.condition, flags))
    .map(rule => ({
      id: rule.id,
      text: rule.text,
    }));
}

// Get all diary entries for display, organized by chapter
export function getUnlockedChapters(
  flags: Record<string, string | boolean | number>,
  currentChapter: number
): EvaluatedDiaryChapter[] {
  const chapters = getDiaryChapters();
  const result: EvaluatedDiaryChapter[] = [];

  for (const chapter of chapters) {
    if (chapter.chapter <= currentChapter) {
      const entries = getUnlockedDiaryEntries(chapter.chapter, flags);
      if (entries.length > 0) {
        result.push({
          chapter: chapter.chapter,
          title: chapter.title,
          entries,
        });
      }
    }
  }

  return result;
}

export { getDiaryChapters, getDiaryRulesForChapter };
