import type { Scene } from '@types';
import { chapter1 } from '@scenes';

// Combine all scene sources into a single map for easy lookup
const allScenes: Scene[] = [
  ...chapter1.scenes,
  // Add more chapters here as they're created
];

const sceneMap = new Map<string, Scene>(
  allScenes.map(scene => [scene.id, scene])
);

export function getScene(id: string): Scene | undefined {
  return sceneMap.get(id);
}

export function getAllSceneIds(): string[] {
  return Array.from(sceneMap.keys());
}
