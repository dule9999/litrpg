import type { Scene, ChapterData, GameState } from '@types';
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

// Evaluate a condition string against game state
// Supports both storyFlags (as direct variables) and completedPaths array
export function evaluateCondition(
  condition: string,
  storyFlags: Record<string, string | boolean | number>,
  completedPaths: string[] = []
): boolean {
  try {
    // Create evaluation context with flags as direct variables + completedPaths array
    const flagKeys = Object.keys(storyFlags);
    const flagValues = Object.values(storyFlags);
    const fn = new Function(...flagKeys, 'completedPaths', `return ${condition};`);
    return fn(...flagValues, completedPaths);
  } catch (e) {
    console.error('Failed to evaluate condition:', condition, e);
    return false;
  }
}

// Convenience function to evaluate condition from full game state
export function evaluateConditionFromState(condition: string, state: GameState): boolean {
  return evaluateCondition(condition, state.storyFlags, state.completedPaths);
}

// Get the appropriate text for a scene based on game state
export function getSceneText(scene: Scene, state: GameState): string {
  if (scene.textVariants && scene.textVariants.length > 0) {
    for (const variant of scene.textVariants) {
      if (evaluateConditionFromState(variant.condition, state)) {
        return variant.text;
      }
    }
  }
  return scene.text;
}
