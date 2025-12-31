import type { GameState } from '@types';
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

// Evaluate diary rules against current game state and return matching entries
export function getUnlockedDiaryEntries(
  chapterNum: number,
  storyFlags: Record<string, string | boolean | number>,
  completedPaths: string[]
): EvaluatedDiaryEntry[] {
  const rules = getDiaryRulesForChapter(chapterNum);
  return rules
    .filter(rule => evaluateCondition(rule.condition, storyFlags, completedPaths))
    .map(rule => ({
      id: rule.id,
      text: rule.text,
    }));
}

// Get all diary entries for display, organized by chapter
export function getUnlockedChapters(gameState: GameState): EvaluatedDiaryChapter[] {
  const chapters = getDiaryChapters();
  const result: EvaluatedDiaryChapter[] = [];

  for (const chapter of chapters) {
    if (chapter.chapter <= gameState.currentChapter) {
      const entries = getUnlockedDiaryEntries(
        chapter.chapter,
        gameState.storyFlags,
        gameState.completedPaths
      );
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
