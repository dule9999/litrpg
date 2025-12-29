import { useState, useEffect, useRef, useMemo } from 'react';
import type { GameState, Choice } from '@types';
import { loadGameState, saveGameState, resetGameState, getScene, getSceneText, evaluateCondition, getChapterForScene, getChapter } from '@utils';
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

export default function ScenePage() {
  const [gameState, setGameState] = useState<GameState>(loadGameState);

  const currentScene = getScene(gameState.currentSceneId);
  const sceneText = currentScene ? getSceneText(currentScene, gameState.flags) : '';

  // Filter choices based on conditions
  const visibleChoices = useMemo(() => {
    if (!currentScene) return [];
    return currentScene.choices.filter(choice => {
      if (!choice.condition) return true;
      return evaluateCondition(choice.condition, gameState.flags);
    });
  }, [currentScene, gameState.flags]);

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  const handleChoice = (choice: Choice) => {
    setGameState(prev => {
      // Check if we're entering a new chapter
      const newChapterNum = getChapterForScene(choice.nextSceneId);
      const isNewChapter = newChapterNum !== undefined && newChapterNum !== prev.currentChapter;

      // If entering a new chapter, merge in that chapter's initial flags
      let newFlags = { ...prev.flags };
      if (isNewChapter) {
        const newChapterData = getChapter(newChapterNum);
        if (newChapterData) {
          newFlags = { ...newFlags, ...newChapterData.initialFlags };
        }
      }

      // Apply any flags from this choice (after chapter flags, so choice can override)
      if (choice.setFlags) {
        newFlags = { ...newFlags, ...choice.setFlags };
      }

      // Update character inventory
      let newCharacter = { ...prev.character };
      if (choice.addItems) {
        if (choice.addItems.equipment) {
          newCharacter.equipment = [...newCharacter.equipment, ...choice.addItems.equipment];
        }
        if (choice.addItems.valuables) {
          newCharacter.valuables = [...newCharacter.valuables, ...choice.addItems.valuables];
        }
      }
      if (choice.removeItems) {
        if (choice.removeItems.equipment) {
          newCharacter.equipment = newCharacter.equipment.filter(
            item => !choice.removeItems!.equipment!.includes(item)
          );
        }
        if (choice.removeItems.valuables) {
          newCharacter.valuables = newCharacter.valuables.filter(
            item => !choice.removeItems!.valuables!.includes(item)
          );
        }
      }

      return {
        ...prev,
        currentChapter: newChapterNum ?? prev.currentChapter,
        currentSceneId: choice.nextSceneId,
        history: [...prev.history, prev.currentSceneId],
        flags: newFlags,
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
