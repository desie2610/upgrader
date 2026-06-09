import type { UpgradeKind } from "../types";

export const coinFormatter = new Intl.NumberFormat("uk-UA", {
  maximumFractionDigits: 0,
});

export function formatCoins(value: number): string {
  return `${coinFormatter.format(Math.floor(value))} монет`;
}

export function formatChance(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function calculateUpgradeChance(sourceValue: number, targetValue: number): number {
  if (targetValue <= sourceValue || targetValue <= 0) return 0;
  // Ratio-based chance keeps upgrades transparent and always shows the exact number before the roll.
  const chance = (sourceValue / targetValue) * 100;
  return Math.min(95, Math.max(0.5, Number(chance.toFixed(2))));
}

export interface UpgradeLevels {
  clickPower: number;
  autoClicker: number;
  autoSpeed: number;
  incomeMultiplier: number;
}

export const upgradeLabels: Record<UpgradeKind, { title: string; text: string }> = {
  clickPower: {
    title: "Сила клика",
    text: "Больше монет за ручной клик.",
  },
  autoClicker: {
    title: "Автокликер",
    text: "Пассивно приносит монеты каждую секунду.",
  },
  autoSpeed: {
    title: "Ускоритель",
    text: "Увеличивает доход каждого автокликера.",
  },
  incomeMultiplier: {
    title: "Множитель",
    text: "Умножает ручной и пассивный доход.",
  },
};

export function getIncomeMultiplier(levels: UpgradeLevels): number {
  return 1 + levels.incomeMultiplier * 0.25;
}

export function getClickIncome(levels: UpgradeLevels): number {
  return Math.floor((100 + levels.clickPower * 100) * getIncomeMultiplier(levels));
}

export function getAutoIncome(levels: UpgradeLevels): number {
  if (levels.autoClicker <= 0) return 0;
  const speedFactor = 1 + levels.autoSpeed * 0.22;
  return Math.floor(levels.autoClicker * 75 * speedFactor * getIncomeMultiplier(levels));
}

export function getUpgradeCost(kind: UpgradeKind, levels: UpgradeLevels): number {
  const level = levels[kind];
  const baseCosts: Record<UpgradeKind, number> = {
    clickPower: 700,
    autoClicker: 2500,
    autoSpeed: 4200,
    incomeMultiplier: 9500,
  };
  const growth: Record<UpgradeKind, number> = {
    clickPower: 1.72,
    autoClicker: 1.86,
    autoSpeed: 1.92,
    incomeMultiplier: 2.18,
  };

  return Math.round(baseCosts[kind] * growth[kind] ** level);
}
