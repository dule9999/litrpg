export interface Choice {
  text: string;
  nextSceneId: string;
  setFlags?: Record<string, string | boolean | number>;
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
