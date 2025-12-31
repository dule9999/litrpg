import type { Item } from '@types';
import { items, armorItems, weaponItems, magicItems, equipmentItems, valuableItems } from './items';

export function getItem(id: string): Item | undefined {
  return items[id];
}

export function getItemName(id: string): string {
  return items[id]?.name ?? id;
}

export function getAllItems(): Item[] {
  return Object.values(items);
}

export function getItemsByCategory(category: Item['category']): Item[] {
  return Object.values(items).filter(item => item.category === category);
}

export { items, armorItems, weaponItems, magicItems, equipmentItems, valuableItems };

// Health utilities
export { applyInjury, applyHealing, getAttackModifier, canAttack } from './health';
