import type { GameState } from '@types';

const STORAGE_KEY = 'litrpg_game_state';

const DEFAULT_STATE: GameState = {
  currentSceneId: 'scene1_arrival',
  history: [],
  unlockedDiaryIds: [],
};

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        unlockedDiaryIds: parsed.unlockedDiaryIds || [],
      };
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return DEFAULT_STATE;
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
  return DEFAULT_STATE;
}
