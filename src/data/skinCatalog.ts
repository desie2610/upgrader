import heavy from "./skins/heavy.json";
import knives from "./skins/knives.json";
import pistols from "./skins/pistols.json";
import rifles from "./skins/rifles.json";
import smgs from "./skins/smgs.json";
import snipers from "./skins/snipers.json";
import type { Skin, SkinCategory, SkinQuality, SkinRarity } from "../types";

export const categoryLabels: Record<SkinCategory, string> = {
  knives: "Ножи и перчатки",
  snipers: "Снайперские",
  rifles: "Винтовки",
  pistols: "Пистолеты",
  smgs: "ПП",
  heavy: "Тяжелое",
};

export const qualityOrder: SkinQuality[] = [
  "Factory New",
  "Minimal Wear",
  "Field-Tested",
  "Well-Worn",
  "Battle-Scarred",
];

export const rarityOrder: SkinRarity[] = [
  "Consumer Grade",
  "Industrial Grade",
  "Mil-Spec",
  "Restricted",
  "Classified",
  "Covert",
  "Contraband",
  "Extraordinary",
];

export const rarityColors: Record<SkinRarity, string> = {
  "Consumer Grade": "#b5c2cf",
  "Industrial Grade": "#78a9ff",
  "Mil-Spec": "#4b69ff",
  Restricted: "#8847ff",
  Classified: "#d32ce6",
  Covert: "#eb4b4b",
  Contraband: "#e4ae33",
  Extraordinary: "#d9a441",
};

export const skinCatalog = [
  ...(knives as Skin[]),
  ...(snipers as Skin[]),
  ...(rifles as Skin[]),
  ...(pistols as Skin[]),
  ...(smgs as Skin[]),
  ...(heavy as Skin[]),
].sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));

export const skinById = new Map(skinCatalog.map((skin) => [skin.id, skin]));

export const weapons = Array.from(new Set(skinCatalog.map((skin) => skin.weapon))).sort((a, b) =>
  a.localeCompare(b),
);

export function getSkin(skinId: string): Skin {
  const skin = skinById.get(skinId);
  if (!skin) throw new Error(`Unknown skin id: ${skinId}`);
  return skin;
}

export function getCheapestSkin(): Skin {
  return skinCatalog.reduce((cheapest, skin) => (skin.value < cheapest.value ? skin : cheapest), skinCatalog[0]);
}
