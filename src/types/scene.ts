export interface Choice {
  text: string;
  nextSceneId: string;
  setFlags?: Record<string, string | boolean | number>;
  condition?: string; // If set, choice only shows when condition evaluates to true
  addItems?: { equipment?: string[]; valuables?: string[] };
  removeItems?: { equipment?: string[]; valuables?: string[] };
}

export interface Scene {
  id: string;
  text: string;
  choices: Choice[];
  // For scenes with dynamic text based on flags
  textVariants?: {
    condition: string;
    text: string;
  }[];
}

export interface ChapterData {
  chapter: number;
  title: string;
  initialFlags: Record<string, string | boolean | number>;
  startSceneId: string;
  scenes: Scene[];
}

export interface GameState {
  currentChapter: number;
  currentSceneId: string;
  flags: Record<string, string | boolean | number>;
  history: string[];
  chapterOutcomes: Record<number, string>; // chapter number -> outcome id
  character: CharacterInventory;
}

// New: Condition-based diary rules
export interface DiaryRule {
  id: string;
  condition: string; // e.g., "helped && payment === 'noble'"
  text: string;
}

export interface DiaryChapter {
  chapter: number;
  title: string;
  rules: DiaryRule[];
}

// Legacy support (can remove later)
export interface DiaryEntry {
  id: string;
  unlockSceneId: string;
  text: string;
}

// Character inventory - derived from flags
export interface CharacterInventory {
  equipment: string[];
  valuables: string[];
}
