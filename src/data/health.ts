import type { HealthCondition } from '@types';
import { HEALTH_CONDITIONS, HEALTH_ATTACK_MODIFIERS } from '@types';

export function applyInjury(current: HealthCondition, steps: number): HealthCondition {
  const currentIndex = HEALTH_CONDITIONS.indexOf(current);
  const newIndex = Math.min(currentIndex + steps, HEALTH_CONDITIONS.length - 1);
  return HEALTH_CONDITIONS[newIndex];
}

export function applyHealing(current: HealthCondition, steps: number): HealthCondition {
  const currentIndex = HEALTH_CONDITIONS.indexOf(current);
  const newIndex = Math.max(currentIndex - steps, 0);
  return HEALTH_CONDITIONS[newIndex];
}

export function getAttackModifier(condition: HealthCondition): number | null {
  return HEALTH_ATTACK_MODIFIERS[condition];
}

export function canAttack(condition: HealthCondition): boolean {
  return condition !== 'dying';
}
