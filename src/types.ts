export type SkinQuality =
  | "Factory New"
  | "Minimal Wear"
  | "Field-Tested"
  | "Well-Worn"
  | "Battle-Scarred";

export type SkinRarity =
  | "Consumer Grade"
  | "Industrial Grade"
  | "Mil-Spec"
  | "Restricted"
  | "Classified"
  | "Covert"
  | "Contraband"
  | "Extraordinary";

export type SkinCategory = "knives" | "snipers" | "rifles" | "pistols" | "smgs" | "heavy";

export interface Skin {
  id: string;
  name: string;
  skinName: string;
  weapon: string;
  quality: SkinQuality;
  rarity: SkinRarity;
  category: SkinCategory;
  collection: string;
  image: string;
  value: number;
}

export interface InventoryItem {
  instanceId: string;
  skinId: string;
  acquiredAt: number;
  source: "starter" | "purchase" | "upgrade" | "daily";
}

export interface UpgradeStats {
  totalUpgrades: number;
  successfulUpgrades: number;
  failedUpgrades: number;
  bestObtainedSkinId: string | null;
}

export interface UpgradeResult {
  success: boolean;
  chance: number;
  roll: number;
  sourceSkinId: string;
  targetSkinId: string;
  timestamp: number;
}

export type UpgradeKind = "clickPower" | "autoClicker" | "autoSpeed" | "incomeMultiplier";

export interface DailyRewardResult {
  coins: number;
  skinId?: string;
  streak: number;
}
