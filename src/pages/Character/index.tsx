import { loadGameState } from '@utils';
import './Character.css';

export default function CharacterPage() {
  const gameState = loadGameState();
  const { character } = gameState;

  return (
    <div className="character">
      <h2 className="character-title">Character</h2>

      <div className="character-sections">
        <section className="character-section">
          <h3 className="character-section-title">Equipment</h3>
          <ul className="character-list">
            {character.equipment.length > 0 ? (
              character.equipment.map((item, index) => (
                <li key={index} className="character-item">{item}</li>
              ))
            ) : (
              <li className="character-item character-item-none">None</li>
            )}
          </ul>
        </section>

        <section className="character-section">
          <h3 className="character-section-title">Valuables</h3>
          <ul className="character-list">
            {character.valuables.length > 0 ? (
              character.valuables.map((item, index) => (
                <li key={index} className="character-item">{item}</li>
              ))
            ) : (
              <li className="character-item character-item-none">None</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
