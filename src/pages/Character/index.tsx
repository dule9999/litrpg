import { loadGameState } from '@utils';
import { getItemName } from '@data';
import { HEALTH_DISPLAY_NAMES, HEALTH_ATTACK_MODIFIERS } from '@types';
import './Character.css';

function formatAttackModifier(modifier: number | null): string {
  if (modifier === null) return '(Cannot attack)';
  if (modifier > 0) return `(+${modifier} to Attack)`;
  if (modifier < 0) return `(${modifier} to Attack)`;
  return '(+0 to Attack)';
}

export default function CharacterPage() {
  const gameState = loadGameState();
  const { character } = gameState;

  const healthDisplay = HEALTH_DISPLAY_NAMES[character.health.condition];
  const attackMod = HEALTH_ATTACK_MODIFIERS[character.health.condition];

  return (
    <div className="character">
      <h2 className="character-title">Character</h2>

      <div className="character-sections">
        {/* Health Section */}
        <section className="character-section">
          <h3 className="character-section-title">Health</h3>
          <div className="character-health">
            <div className="character-health-condition">
              <span className="character-health-label">Condition:</span>
              <span className="character-health-value">
                {healthDisplay} {formatAttackModifier(attackMod)}
              </span>
            </div>
            {character.health.additional.length > 0 && (
              <div className="character-health-additional">
                <span className="character-health-label">Additional:</span>
                <span className="character-health-value">
                  {character.health.additional.join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Armor Section */}
        <section className="character-section">
          <h3 className="character-section-title">Armor</h3>
          <ul className="character-list">
            {character.armor.length > 0 ? (
              character.armor.map((itemId, index) => (
                <li key={index} className="character-item">{getItemName(itemId)}</li>
              ))
            ) : (
              <li className="character-item character-item-none">None</li>
            )}
          </ul>
        </section>

        {/* Weapons Section */}
        <section className="character-section">
          <h3 className="character-section-title">Weapons</h3>
          <ul className="character-list">
            {character.weapons.length > 0 ? (
              character.weapons.map((itemId, index) => (
                <li key={index} className="character-item">{getItemName(itemId)}</li>
              ))
            ) : (
              <li className="character-item character-item-none">None</li>
            )}
          </ul>
        </section>

        {/* Magic Section */}
        <section className="character-section">
          <h3 className="character-section-title">Magic</h3>
          <ul className="character-list">
            {character.magic.length > 0 ? (
              character.magic.map((itemId, index) => (
                <li key={index} className="character-item">{getItemName(itemId)}</li>
              ))
            ) : (
              <li className="character-item character-item-none">None</li>
            )}
          </ul>
        </section>

        {/* Equipment Section */}
        <section className="character-section">
          <h3 className="character-section-title">Equipment</h3>
          <ul className="character-list">
            {character.equipment.length > 0 ? (
              character.equipment.map((itemId, index) => (
                <li key={index} className="character-item">{getItemName(itemId)}</li>
              ))
            ) : (
              <li className="character-item character-item-none">None</li>
            )}
          </ul>
        </section>

        {/* Valuables Section */}
        <section className="character-section">
          <h3 className="character-section-title">Valuables</h3>
          <ul className="character-list">
            {character.gold > 0 && (
              <li className="character-item">{character.gold} gold</li>
            )}
            {character.silver > 0 && (
              <li className="character-item">{character.silver} silver</li>
            )}
            {character.gold === 0 && character.silver === 0 && (
              <li className="character-item character-item-none">None</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
