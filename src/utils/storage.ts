import type { GameState } from '@types';
import { chapter1 } from '@scenes';

const STORAGE_KEY = 'litrpg_game_state';

const DEFAULT_CHARACTER = {
  equipment: ['Rusty sword'],
  valuables: [],
};

const DEFAULT_STATE: GameState = {
  currentChapter: 1,
  currentSceneId: chapter1.startSceneId,
  flags: { ...chapter1.initialFlags },
  history: [],
  chapterOutcomes: {},
  character: { ...DEFAULT_CHARACTER },
};

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        flags: parsed.flags || { ...chapter1.initialFlags },
        chapterOutcomes: parsed.chapterOutcomes || {},
        character: parsed.character || { ...DEFAULT_CHARACTER },
      };
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return { ...DEFAULT_STATE, character: { ...DEFAULT_CHARACTER } };
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state:', e);
  }
}

export function resetGameState(): GameState {
  localStorage.removeItem(STORAGE_KEY);
  return { ...DEFAULT_STATE, flags: { ...chapter1.initialFlags }, character: { ...DEFAULT_CHARACTER } };
}
