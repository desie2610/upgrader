import { skinCatalog } from "./skinCatalog";
import type { UpgradeStats } from "../types";

export interface AchievementSnapshot {
  coins: number;
  totalCoinClicks: number;
  inventoryCount: number;
  foundCount: number;
  dailyStreak: number;
  stats: UpgradeStats;
}

export interface AchievementProgress {
  id: string;
  title: string;
  text: string;
  progress: number;
  goal: number;
  unlocked: boolean;
}

type AchievementDefinition = {
  id: string;
  title: string;
  text: string;
  goal: number;
  getProgress: (snapshot: AchievementSnapshot) => number;
};

const totalSkinCount = skinCatalog.length;

const achievements: AchievementDefinition[] = [
  {
    id: "first-clicks",
    title: "Первый контракт",
    text: "Заработать монеты вручную.",
    goal: 1,
    getProgress: (state) => state.totalCoinClicks,
  },
  {
    id: "bank-10k",
    title: "Стартовый банк",
    text: "Накопить 10 000 монет.",
    goal: 10_000,
    getProgress: (state) => state.coins,
  },
  {
    id: "bank-1m",
    title: "Миллионер",
    text: "Накопить 1 000 000 монет.",
    goal: 1_000_000,
    getProgress: (state) => state.coins,
  },
  {
    id: "first-upgrade",
    title: "Первая попытка",
    text: "Сделать первый апгрейд.",
    goal: 1,
    getProgress: (state) => state.stats.totalUpgrades,
  },
  {
    id: "five-wins",
    title: "Полоса удачи",
    text: "Выиграть 5 апгрейдов.",
    goal: 5,
    getProgress: (state) => state.stats.successfulUpgrades,
  },
  {
    id: "upgrade-100",
    title: "Апгрейд-марафон",
    text: "Сделать 100 апгрейдов.",
    goal: 100,
    getProgress: (state) => state.stats.totalUpgrades,
  },
  {
    id: "collector-25",
    title: "Коллекционер",
    text: "Открыть 25 разных предметов.",
    goal: 25,
    getProgress: (state) => state.foundCount,
  },
  {
    id: "collector-half",
    title: "Полная витрина",
    text: "Открыть половину каталога.",
    goal: Math.ceil(totalSkinCount / 2),
    getProgress: (state) => state.foundCount,
  },
  {
    id: "daily-week",
    title: "Неделя наград",
    text: "Собрать ежедневную награду 7 раз подряд.",
    goal: 7,
    getProgress: (state) => state.dailyStreak,
  },
  {
    id: "inventory-50",
    title: "Склад коллекционера",
    text: "Держать 50 предметов в инвентаре.",
    goal: 50,
    getProgress: (state) => state.inventoryCount,
  },
];

export function getAchievements(snapshot: AchievementSnapshot): AchievementProgress[] {
  return achievements.map((achievement) => {
    const progress = Math.min(achievement.goal, achievement.getProgress(snapshot));
    return {
      ...achievement,
      progress,
      unlocked: progress >= achievement.goal,
    };
  });
}
