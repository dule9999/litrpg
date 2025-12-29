# Project Instructions

## Overview

This is a narrative choice-based game inspired by Baldur's Gate 3's dialogue system. Choices matter and branch the story, but complexity is managed through a **flag-based system** rather than exponential path branching.

---

## Core Concepts

### Flags
Variables that track player choices and state. Set by choices, used by diary rules and future chapters.

```javascript
flags: {
  helped: boolean,       // Did player help?
  payment: "none" | "noble" | "greedy",  // How did they help?
  creature_killed: boolean,
  has_intel: boolean,
  has_ring: boolean
}
```

### Pivot Points
Major decisions that create real story branches. Each chapter has 1-3 pivot points max.

### Outcomes
The possible end-states of a chapter. Typically 2-4 outcomes, each carrying different consequences to future chapters.

### Text Variants
Scenes can have different text based on flags, allowing one scene ID to serve multiple story branches.

### Conditional Choices
Choices can be shown or hidden based on flags. Use this to gate options behind previous decisions.

---

## Chapter Structure

```
┌─────────────────────────────────────────────────────────────┐
│  CHAPTER = Metadata + Initial Flags + Scenes                │
└─────────────────────────────────────────────────────────────┘
```

### Chapter JSON Format

```json
{
  "chapter": 1,
  "title": "The Old Man's Hovel",
  "initialFlags": {
    "helped": false,
    "payment": "none",
    "creature_killed": false
  },
  "startSceneId": "arrival",
  "scenes": [...]
}
```

---

## Scene Structure

### Basic Scene

```json
{
  "id": "scene_id",
  "text": "Narrative text...",
  "choices": [
    {
      "text": "Choice text shown to player",
      "nextSceneId": "next_scene",
      "setFlags": { "flag_name": "value" }
    }
  ]
}
```

### Scene with Text Variants

For scenes that display differently based on earlier choices:

```json
{
  "id": "resolution",
  "textVariants": [
    {
      "condition": "payment === 'noble'",
      "text": "The noble path resolution text..."
    },
    {
      "condition": "payment === 'greedy'",
      "text": "The greedy path resolution text..."
    }
  ],
  "text": "",
  "choices": [...]
}
```

The game engine evaluates conditions in order and displays the first matching variant.

### Single-Choice Scenes

Not every scene needs multiple choices. Some scenes can have just one choice to continue:

```json
{
  "id": "aftermath",
  "text": "The battle is over. You stand among the fallen...",
  "choices": [
    {
      "text": "...",
      "nextSceneId": "next_scene"
    }
  ]
}
```

This is appropriate for:
- Aftermath/resolution scenes
- Transitions between chapters
- Moments where the narrative needs to breathe

---

## Choice Structure

### Basic Choice

```json
{
  "text": "What the player sees",
  "nextSceneId": "where_it_goes",
  "setFlags": { "flag": "value" }
}
```

### Conditional Choice

Choices can have conditions - they only appear when the condition is true:

```json
{
  "text": "The old man mentioned a ford upstream. Find it.",
  "nextSceneId": "ford_crossing",
  "condition": "has_intel"
}
```

Use conditional choices to:
- Gate options behind previous decisions
- Reward players who earned information/items
- Punish players who took shortcuts

---

## Consequences Philosophy

**Choices have real consequences. Bad decisions get punished.**

### Don't Give Free Hints

If a player didn't earn information, don't give them hints that "something feels off." They walk into the trap because they don't know any better.

**Wrong:**
```json
// Player has no intel but gets a warning anyway
{
  "condition": "!has_intel",
  "text": "The mill looks abandoned, but something feels off. You could search for another way..."
}
```

**Right:**
```json
// Player has no intel, sees nothing suspicious
{
  "condition": "!has_intel",
  "text": "The mill looks abandoned. Peaceful. Your horse is tired. The bridge is right there."
}
// And the ford option is NOT available to them
```

### Consequences Examples

| Chapter 1 Choice | Chapter 2 Consequence |
|------------------|----------------------|
| Helped for free → got intel | Can avoid bandits via ford, or attack with surprise |
| Took the ring → no intel | Walk into ambush, get robbed, lose everything |
| Has ring at bandits | Can bribe way through |
| No ring at bandits | Must fight or lose sword |

### Delayed Punishment

The worst outcomes often come from seemingly "smart" choices:
- Taking the ring = immediate reward, but later you get robbed
- Leaving the old man = save time, but walk into ambush without warning

---

## Diary System

Diary entries are generated from **rules**, not scene triggers. At chapter end, evaluate all rules against current flags.

### Diary Chapter Format

```json
{
  "chapter": 1,
  "title": "The Old Man's Hovel",
  "rules": [
    {
      "id": "diary_helped_noble",
      "condition": "helped && payment === 'noble'",
      "text": "Cleared the old man's cellar without payment."
    },
    {
      "id": "diary_creature",
      "condition": "creature_killed",
      "text": "Killed a corrupted rat in the cellar."
    }
  ]
}
```

### Condition Syntax

Conditions use JavaScript-like boolean expressions:
- `helped === false` - exact match
- `helped && payment === 'noble'` - AND
- `has_ring || has_intel` - OR
- `creature_killed` - truthy check
- `!has_intel` - negation

### Diary Rules Guidelines

1. **Every path gets entries** - Even "left early" paths should have at least one diary entry
2. **No redundancy** - Each entry should add new information
3. **20-30 words max** - Keep entries concise
4. **Cover all outcomes** - Write rules for each possible end-state

---

## Choice Design

Scenes typically have **2 choices**, but this is flexible:

### The Compassionate Path
- Shows care for others
- Selflessness, empathy, connection
- Builds trust with NPCs
- Often rewards: **lore, intel, warnings, relationships**

### The Pragmatic Path
- Self-interest, survival
- Pragmatic decisions
- May alienate NPCs
- Often rewards: **items, gold, immediate material gain**

### When to Use Fewer/More Choices

**1 choice:** Aftermath scenes, chapter transitions, dramatic pauses

**2 choices:** Standard decision points (compassionate vs pragmatic)

**3+ choices:** Complex negotiations where multiple approaches exist (attack/bribe/negotiate), but only if choices are conditional based on what player has available

---

## Chapter Design Process

### Step 1: Define Outcomes

Before writing scenes, list the 2-4 possible end-states:

```
Chapter 1 Outcomes:
1. LEFT_EARLY - Didn't help, no rewards
2. HELPED_NOBLE - Helped freely, gained intel
3. HELPED_GREEDY - Helped for payment, gained ring
```

### Step 2: Identify Pivot Points

Mark the 1-3 major decisions:

```
Pivot 1: Help or Leave?
Pivot 2: Noble or Greedy payment?
```

### Step 3: Design Flag Flow

Map what flags get set at each pivot:

```
Pivot 1 (Help):    helped = true
Pivot 1 (Leave):   helped = false → END
Pivot 2 (Noble):   payment = "noble"
Pivot 2 (Greedy):  payment = "greedy", has_ring = true
```

### Step 4: Write Scenes

Write the minimal scenes needed:
- **Arrival/Setup** - Establish the situation
- **Pivot Scenes** - Where major choices happen
- **Resolution** - Outcome based on flags (use textVariants)
- **Early Exits** - For paths that leave early

### Step 5: Write Diary Rules

For each outcome, write the diary entries:

```
LEFT_EARLY → 1 entry (what they saw before leaving)
HELPED_NOBLE → 3 entries (helped, killed creature, got intel)
HELPED_GREEDY → 3 entries (helped, killed creature, got ring)
```

---

## Chapter Transitions

When transitioning between chapters:

1. Set `nextSceneId` to the new chapter's start scene
2. Include the new chapter's initial flags in `setFlags`
3. The game automatically updates `currentChapter` when entering a new chapter's scene

```json
{
  "text": "Continue to Chapter 2",
  "nextSceneId": "approach",
  "setFlags": {
    "went_over_bridge": false,
    "bandits_attacked": false,
    "was_robbed": false
  }
}
```

---

## Branching Guidelines

### DO:
- Use flags to track choices
- Use textVariants for scenes that differ by path
- Use conditional choices to gate options
- Keep to 2-4 outcomes per chapter
- Ensure every path has diary entries
- Punish bad choices with consequences

### DON'T:
- Create separate scenes for every possible combination
- Branch exponentially (14 paths in one chapter)
- Leave any path without diary entries
- Give hints to uninformed players
- Let pragmatic choices have no downsides

---

## How Outcomes Affect Future Chapters

Each chapter's outcome can influence future chapters:

```javascript
// In Chapter 2, check Chapter 1 outcome:
if (chapter1.flags.helped === false) {
  // Hear rumors old man was found dead
}
if (chapter1.flags.payment === 'noble') {
  // Intel helps avoid bandit trap
}
if (chapter1.flags.has_ring) {
  // Can sell ring for gold, or keep it
}
```

This creates meaningful consequences without exponential branching.

---

## Tone Guidelines

- **Grimdark and brutal** - The world is harsh
- **Avoid gratuitous gore** - Violence present but not vivid
- **Moral ambiguity** - "Good" choices can have negative consequences
- **Consequences matter** - Choices ripple forward
- **No hand-holding** - Players face the results of their choices

---

## The Stranger

The protagonist is "The Stranger" (to NPCs) or "you" (in narrative).

Background:
- Former soldier from the losing side of a war
- Combat-experienced, capable fighter
- Wounded, weary, with nothing left
- Rugged: month-long beard, disheveled black hair
- Carries rusty sword, rides tired old horse
- No home, no allegiance, no destination

---

## File Structure

```
src/
├── scenes/
│   ├── chapter1.json     # Scene definitions
│   ├── chapter2.json
│   └── index.ts          # Exports all chapters
├── diaryLogs/
│   ├── chapter1.json     # Diary rules
│   ├── chapter2.json
│   └── index.ts          # Exports all diary chapters
└── types/
    └── scene.ts          # TypeScript interfaces
```

---

## Quick Reference

| Concept | Purpose |
|---------|---------|
| Flags | Track player choices as variables |
| Pivot Points | Major decisions that branch story (1-3 per chapter) |
| Outcomes | End-states of a chapter (2-4 per chapter) |
| Text Variants | Same scene, different text based on flags |
| Conditional Choices | Choices that only appear based on flags |
| Diary Rules | Condition-based entry generation |

---

## Technical Notes

### Condition Evaluation

Conditions are evaluated using JavaScript's `new Function()`. Flag names become variables:

```javascript
// Condition: "has_intel && !was_robbed"
// Becomes: new Function('has_intel', 'was_robbed', 'return has_intel && !was_robbed')
```

### Auto Chapter Detection

When navigating to a scene, the game automatically detects which chapter owns that scene and updates `currentChapter` in the game state.

### Flag Persistence

Flags persist across chapters. Chapter 1 flags are still available in Chapter 2. When transitioning chapters, include the new chapter's initial flags in `setFlags` to initialize them.
