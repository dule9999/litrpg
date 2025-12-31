// Health system
export const HEALTH_CONDITIONS = [
  'full_health',
  'slightly_injured',
  'moderately_injured',
  'heavily_injured',
  'dying',
] as const;

export type HealthCondition = typeof HEALTH_CONDITIONS[number];

export const HEALTH_DISPLAY_NAMES: Record<HealthCondition, string> = {
  full_health: 'Full health',
  slightly_injured: 'Slightly injured',
  moderately_injured: 'Moderately injured',
  heavily_injured: 'Heavily injured',
  dying: 'Dying',
};

export const HEALTH_ATTACK_MODIFIERS: Record<HealthCondition, number | null> = {
  full_health: 1,
  slightly_injured: 0,
  moderately_injured: -1,
  heavily_injured: -2,
  dying: null, // Cannot attack
};

// Item system
export type ItemCategory = 'armor' | 'weapon' | 'magic' | 'equipment' | 'valuables';

export interface Item {
  id: string;
  name: string;
  description?: string;
  category: ItemCategory;
  stats?: {
    attack?: number;
    defense?: number;
  };
}

// Character state
export interface CharacterHealth {
  condition: HealthCondition;
  additional: string[]; // Temporary conditions: "poisoned", "cursed", etc.
}

export interface Character {
  health: CharacterHealth;
  armor: string[];      // Item IDs
  weapons: string[];    // Item IDs
  magic: string[];      // Item IDs
  equipment: string[];  // Item IDs
  gold: number;
  silver: number;
}

// Choice effects
export interface ChoiceEffects {
  // Health
  injure?: number;
  heal?: number;
  addCondition?: string;
  removeCondition?: string;

  // Items (by ID)
  addItems?: {
    armor?: string[];
    weapons?: string[];
    magic?: string[];
    equipment?: string[];
  };
  removeItems?: {
    armor?: string[];
    weapons?: string[];
    magic?: string[];
    equipment?: string[];
  };

  // Currency
  addGold?: number;
  addSilver?: number;

  // Story tracking
  setFlag?: Record<string, string | boolean | number>;
  addPath?: string;
}

export interface Choice {
  text: string;
  nextSceneId: string;
  condition?: string;
  effects?: ChoiceEffects;
}

export interface Scene {
  id: string;
  text: string;
  choices: Choice[];
  textVariants?: {
    condition: string;
    text: string;
  }[];
}

export interface ChapterData {
  chapter: number;
  title: string;
  startSceneId: string;
  scenes: Scene[];
}

export interface GameState {
  currentChapter: number;
  currentSceneId: string;
  history: string[];
  storyFlags: Record<string, string | boolean | number>;
  completedPaths: string[];
  character: Character;
}

// Diary system
export interface DiaryRule {
  id: string;
  condition: string;
  text: string;
}

export interface DiaryChapter {
  chapter: number;
  title: string;
  rules: DiaryRule[];
}
