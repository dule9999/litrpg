import type { Item } from '@types';
import armorData from './armor.json';
import weaponsData from './weapons.json';
import magicData from './magic.json';
import equipmentData from './equipment.json';
import valuablesData from './valuables.json';

// Combine all items into a single lookup
export const items: Record<string, Item> = {
  ...(armorData as Record<string, Item>),
  ...(weaponsData as Record<string, Item>),
  ...(magicData as Record<string, Item>),
  ...(equipmentData as Record<string, Item>),
  ...(valuablesData as Record<string, Item>),
};

// Category-specific exports
export const armorItems = armorData as Record<string, Item>;
export const weaponItems = weaponsData as Record<string, Item>;
export const magicItems = magicData as Record<string, Item>;
export const equipmentItems = equipmentData as Record<string, Item>;
export const valuableItems = valuablesData as Record<string, Item>;
