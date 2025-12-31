import type { GameState, Character } from '@types';
import { chapter1 } from '@scenes';

const STORAGE_KEY = 'litrpg_game_state';

const DEFAULT_CHARACTER: Character = {
  health: {
    condition: 'slightly_injured', // Start slightly injured from the war
    additional: [],
  },
  armor: [],
  weapons: ['rusty_sword'],
  magic: [],
  equipment: [],
  gold: 0,
  silver: 0,
};

const DEFAULT_STATE: GameState = {
  currentChapter: 1,
  currentSceneId: chapter1.startSceneId,
  history: [],
  storyFlags: {},
  completedPaths: [],
  character: { ...DEFAULT_CHARACTER, health: { ...DEFAULT_CHARACTER.health } },
};

function cloneCharacter(char: Character): Character {
  return {
    ...char,
    health: { ...char.health, additional: [...char.health.additional] },
    armor: [...char.armor],
    weapons: [...char.weapons],
    magic: [...char.magic],
    equipment: [...char.equipment],
  };
}

export function loadGameState(): GameState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STATE,
        ...parsed,
        storyFlags: parsed.storyFlags || {},
        completedPaths: parsed.completedPaths || [],
        character: parsed.character
          ? cloneCharacter(parsed.character)
          : cloneCharacter(DEFAULT_CHARACTER),
      };
    }
  } catch (e) {
    console.error('Failed to load game state:', e);
  }
  return { ...DEFAULT_STATE, character: cloneCharacter(DEFAULT_CHARACTER) };
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
  return { ...DEFAULT_STATE, character: cloneCharacter(DEFAULT_CHARACTER) };
}
