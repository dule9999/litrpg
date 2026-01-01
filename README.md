# LitRPG

A text-based interactive fiction game built with React and TypeScript. Players navigate through a branching narrative, making choices that affect the story, their character's condition, and inventory.

## Overview

LitRPG is a choice-driven adventure where player decisions shape the narrative. The game features a dark fantasy setting following a war-weary soldier navigating a world filled with supernatural threats and moral dilemmas.

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing

## Features Implemented

### Core Gameplay
- **Scene-based narrative** - Story progression through interconnected scenes defined in JSON
- **Branching choices** - Multiple choice options that lead to different outcomes
- **Conditional text variants** - Scene text changes based on previous decisions
- **Story flags** - Track player decisions across the game
- **Path tracking** - Record which story branches the player has explored

### Character System
- **Health conditions** - Five-tier health system (Full health → Dying) with attack modifiers
- **Additional conditions** - Temporary status effects (poisoned, cursed, etc.)
- **Inventory management** - Armor, weapons, magic items, and equipment
- **Currency** - Gold and silver tracking

### Pages
- **Scene** (`/`) - Main game view displaying narrative text and choices
- **Character** (`/character`) - Character sheet showing health, inventory, and valuables
- **Diary** (`/diary`) - Story journal with unlockable entries based on progress

### Data & Persistence
- **LocalStorage** - Game state persists between sessions
- **JSON-based content** - Scenes and diary entries stored in structured JSON files
- **Item database** - Centralized item definitions with stats and descriptions

## Project Structure

```
src/
├── components/       # Reusable UI components (Layout)
├── data/            # Item definitions (armor, weapons, magic, equipment, valuables)
├── diaryLogs/       # Diary entry rules per chapter
├── pages/           # Route pages (Scene, Character, Diary)
├── scenes/          # Chapter scene definitions
├── types/           # TypeScript type definitions
└── utils/           # Helper functions (storage, scenes, diary)
```

## Content

- **Chapter 1: The Old Man's Hovel** - Encounter with an old man plagued by a creature in his cellar
- **Chapter 2** - Continuation of the journey

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
