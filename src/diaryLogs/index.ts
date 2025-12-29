import prologue from './prologue.json';
import chapter1 from './chapter1.json';
import chapter2 from './chapter2.json';
import type { DiaryChapter, DiaryRule } from '@types';

const allChapters: DiaryChapter[] = [
  prologue as DiaryChapter,
  chapter1 as DiaryChapter,
  chapter2 as DiaryChapter,
];

export function getDiaryChapters(): DiaryChapter[] {
  return allChapters;
}

export function getDiaryChapter(chapterNum: number): DiaryChapter | undefined {
  return allChapters.find(ch => ch.chapter === chapterNum);
}

export function getAllDiaryRules(): DiaryRule[] {
  return allChapters.flatMap(chapter => chapter.rules);
}

export function getDiaryRulesForChapter(chapterNum: number): DiaryRule[] {
  const chapter = getDiaryChapter(chapterNum);
  return chapter ? chapter.rules : [];
}
