import type { Scene, ChapterData } from '@types';
import { chapter1, chapter2 } from '@scenes';

// All chapters
const chapters: ChapterData[] = [
  chapter1 as ChapterData,
  chapter2 as ChapterData,
];

// Combine all scenes into a single map
const allScenes: Scene[] = chapters.flatMap(ch => ch.scenes);
const sceneMap = new Map<string, Scene>(
  allScenes.map(scene => [scene.id, scene])
);

export function getScene(id: string): Scene | undefined {
  return sceneMap.get(id);
}

export function getAllSceneIds(): string[] {
  return Array.from(sceneMap.keys());
}

export function getChapter(chapterNum: number): ChapterData | undefined {
  return chapters.find(ch => ch.chapter === chapterNum);
}

// Get chapter number for a given scene ID
export function getChapterForScene(sceneId: string): number | undefined {
  for (const chapter of chapters) {
    if (chapter.scenes.some(scene => scene.id === sceneId)) {
      return chapter.chapter;
    }
  }
  return undefined;
}

// Evaluate a condition string against flags
export function evaluateCondition(
  condition: string,
  flags: Record<string, string | boolean | number>
): boolean {
  try {
    // Create a function that evaluates the condition with flags as variables
    const flagKeys = Object.keys(flags);
    const flagValues = Object.values(flags);
    const fn = new Function(...flagKeys, `return ${condition};`);
    return fn(...flagValues);
  } catch (e) {
    console.error('Failed to evaluate condition:', condition, e);
    return false;
  }
}

// Get the appropriate text for a scene based on flags
export function getSceneText(
  scene: Scene,
  flags: Record<string, string | boolean | number>
): string {
  if (scene.textVariants && scene.textVariants.length > 0) {
    for (const variant of scene.textVariants) {
      if (evaluateCondition(variant.condition, flags)) {
        return variant.text;
      }
    }
  }
  return scene.text;
}
