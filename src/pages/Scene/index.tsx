import { useState, useEffect, useRef, useMemo } from 'react';
import type { GameState, Choice, Character } from '@types';
import { loadGameState, saveGameState, resetGameState, getScene, getSceneText, evaluateConditionFromState, getChapterForScene } from '@utils';
import { applyInjury, applyHealing } from '@data';
import './Scene.css';

interface SceneDisplayProps {
  sceneText: string;
  choices: Choice[];
  onChoice: (choice: Choice) => void;
}

function SceneDisplay({ sceneText, choices, onChoice }: SceneDisplayProps) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = 0;
    }
  }, [sceneText]);

  return (
    <div className="scene">
      <div className="scene-text" ref={textRef}>
        {sceneText.split('\n').map((line, i) => (
          <p key={i}>{line || <br />}</p>
        ))}
      </div>

      <div className="scene-choices">
        {choices.map((choice, index) => (
          <button
            key={index}
            className="choice-button"
            onClick={() => onChoice(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}

function applyEffectsToCharacter(character: Character, effects: Choice['effects']): Character {
  if (!effects) return character;

  const newCharacter: Character = {
    ...character,
    health: {
      ...character.health,
      additional: [...character.health.additional],
    },
    armor: [...character.armor],
    weapons: [...character.weapons],
    magic: [...character.magic],
    equipment: [...character.equipment],
  };

  // Health effects
  if (effects.injure) {
    newCharacter.health.condition = applyInjury(newCharacter.health.condition, effects.injure);
  }
  if (effects.heal) {
    newCharacter.health.condition = applyHealing(newCharacter.health.condition, effects.heal);
  }
  if (effects.addCondition && !newCharacter.health.additional.includes(effects.addCondition)) {
    newCharacter.health.additional.push(effects.addCondition);
  }
  if (effects.removeCondition) {
    newCharacter.health.additional = newCharacter.health.additional.filter(c => c !== effects.removeCondition);
  }

  // Item effects
  if (effects.addItems) {
    if (effects.addItems.armor) newCharacter.armor.push(...effects.addItems.armor);
    if (effects.addItems.weapons) newCharacter.weapons.push(...effects.addItems.weapons);
    if (effects.addItems.magic) newCharacter.magic.push(...effects.addItems.magic);
    if (effects.addItems.equipment) newCharacter.equipment.push(...effects.addItems.equipment);
  }
  if (effects.removeItems) {
    if (effects.removeItems.armor) {
      newCharacter.armor = newCharacter.armor.filter(id => !effects.removeItems!.armor!.includes(id));
    }
    if (effects.removeItems.weapons) {
      newCharacter.weapons = newCharacter.weapons.filter(id => !effects.removeItems!.weapons!.includes(id));
    }
    if (effects.removeItems.magic) {
      newCharacter.magic = newCharacter.magic.filter(id => !effects.removeItems!.magic!.includes(id));
    }
    if (effects.removeItems.equipment) {
      newCharacter.equipment = newCharacter.equipment.filter(id => !effects.removeItems!.equipment!.includes(id));
    }
  }

  // Currency effects
  if (effects.addGold) newCharacter.gold += effects.addGold;
  if (effects.addSilver) newCharacter.silver += effects.addSilver;

  return newCharacter;
}

export default function ScenePage() {
  const [gameState, setGameState] = useState<GameState>(loadGameState);

  const currentScene = getScene(gameState.currentSceneId);
  const sceneText = currentScene ? getSceneText(currentScene, gameState) : '';

  // Filter choices based on conditions
  const visibleChoices = useMemo(() => {
    if (!currentScene) return [];
    return currentScene.choices.filter(choice => {
      if (!choice.condition) return true;
      return evaluateConditionFromState(choice.condition, gameState);
    });
  }, [currentScene, gameState]);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const handleChoice = (choice: Choice) => {
    setGameState(prev => {
      const newChapterNum = getChapterForScene(choice.nextSceneId);
      const effects = choice.effects;

      // Apply story flags
      let newStoryFlags = { ...prev.storyFlags };
      if (effects?.setFlag) {
        newStoryFlags = { ...newStoryFlags, ...effects.setFlag };
      }

      // Apply completed paths
      let newCompletedPaths = [...prev.completedPaths];
      if (effects?.addPath && !newCompletedPaths.includes(effects.addPath)) {
        newCompletedPaths.push(effects.addPath);
      }

      // Apply character effects
      const newCharacter = applyEffectsToCharacter(prev.character, effects);

      return {
        ...prev,
        currentChapter: newChapterNum ?? prev.currentChapter,
        currentSceneId: choice.nextSceneId,
        history: [...prev.history, prev.currentSceneId],
        storyFlags: newStoryFlags,
        completedPaths: newCompletedPaths,
        character: newCharacter,
      };
    });
  };

  const handleReset = () => {
    setGameState(resetGameState());
  };

  if (!currentScene) {
    return (
      <div className="scene-error">
        <p>Scene not found: {gameState.currentSceneId}</p>
        <button onClick={handleReset}>Start Over</button>
      </div>
    );
  }

  return (
    <SceneDisplay
      sceneText={sceneText}
      choices={visibleChoices}
      onChoice={handleChoice}
    />
  );
}
