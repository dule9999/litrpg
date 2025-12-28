import { useState, useEffect, useRef } from 'react';
import type { Scene as SceneType, GameState } from '@types';
import { loadGameState, saveGameState, resetGameState, getScene, checkForNewDiaryEntry } from '@utils';
import './Scene.css';

function SceneDisplay({ scene, onChoice }: { scene: SceneType; onChoice: (nextSceneId: string) => void }) {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.scrollTop = 0;
    }
  }, [scene.id]);

  return (
    <div className="scene">
      <div className="scene-text" ref={textRef}>
        {scene.text.split('\n').map((line, i) => (
          <p key={i}>{line || <br />}</p>
        ))}
      </div>

      <div className="scene-choices">
        {scene.choices.map((choice, index) => (
          <button
            key={index}
            className="choice-button"
            onClick={() => onChoice(choice.nextSceneId)}
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

  useEffect(() => {
    saveGameState(gameState);
  }, [gameState]);

  useEffect(() => {
    const newEntry = checkForNewDiaryEntry(gameState.currentSceneId, gameState.unlockedDiaryIds);
    if (newEntry) {
      setGameState(prev => ({
        ...prev,
        unlockedDiaryIds: [...prev.unlockedDiaryIds, newEntry.id],
      }));
    }
  }, []);

  const handleChoice = (nextSceneId: string) => {
    setGameState(prev => {
      const newEntry = checkForNewDiaryEntry(nextSceneId, prev.unlockedDiaryIds);
      return {
        currentSceneId: nextSceneId,
        history: [...prev.history, prev.currentSceneId],
        unlockedDiaryIds: newEntry
          ? [...prev.unlockedDiaryIds, newEntry.id]
          : prev.unlockedDiaryIds,
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

  return <SceneDisplay scene={currentScene} onChoice={handleChoice} />;
}
