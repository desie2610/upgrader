import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { getCheapestSkin, getSkin, skinCatalog } from "../data/skinCatalog";
import {
  calculateUpgradeChance,
  getAutoIncome,
  getClickIncome,
  getUpgradeCost,
  type UpgradeLevels,
} from "../lib/economy";
import type { DailyRewardResult, InventoryItem, UpgradeKind, UpgradeResult, UpgradeStats } from "../types";

const starterSkin = getCheapestSkin();

function makeId(prefix: string) {
  const randomId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}-${randomId}`;
}

function makeInventoryItem(skinId: string, source: InventoryItem["source"]): InventoryItem {
  return {
    instanceId: makeId("item"),
    skinId,
    acquiredAt: Date.now(),
    source,
  };
}

function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function daysBetween(dateKeyA: string, dateKeyB: string) {
  const [yearA, monthA, dayA] = dateKeyA.split("-").map(Number);
  const [yearB, monthB, dayB] = dateKeyB.split("-").map(Number);
  const a = new Date(yearA, monthA - 1, dayA).getTime();
  const b = new Date(yearB, monthB - 1, dayB).getTime();
  return Math.round((b - a) / 86_400_000);
}

function withFoundSkin(foundSkinIds: string[], skinId: string) {
  return foundSkinIds.includes(skinId) ? foundSkinIds : [...foundSkinIds, skinId];
}

function bestSkinId(currentBestId: string | null, candidateId: string) {
  if (!currentBestId) return candidateId;
  return getSkin(candidateId).value > getSkin(currentBestId).value ? candidateId : currentBestId;
}

function pickDailySkin(streak: number) {
  if (streak % 3 !== 0) return undefined;
  const budget = Math.min(35_000, 1800 + streak * 1400);
  const pool = skinCatalog.filter((skin) => skin.value <= budget && skin.category !== "knives");
  return pool[Math.floor(Math.random() * pool.length)]?.id;
}

export interface GameState extends UpgradeLevels {
  coins: number;
  inventory: InventoryItem[];
  foundSkinIds: string[];
  selectedSourceInstanceId: string | null;
  selectedTargetSkinId: string | null;
  lastUpgradeResult: UpgradeResult | null;
  lastDailyClaim: string | null;
  dailyStreak: number;
  totalCoinClicks: number;
  stats: UpgradeStats;

  earnCoins: () => number;
  collectAutoIncome: () => number;
  buyIncomeUpgrade: (kind: UpgradeKind) => boolean;
  buySkin: (skinId: string) => boolean;
  selectSource: (instanceId: string | null) => void;
  selectTarget: (skinId: string | null) => void;
  attemptUpgrade: () => UpgradeResult | null;
  claimDailyReward: () => DailyRewardResult | null;
  resetProgress: () => void;
}

const initialState = {
  coins: 1500,
  clickPower: 0,
  autoClicker: 0,
  autoSpeed: 0,
  incomeMultiplier: 0,
  inventory: [makeInventoryItem(starterSkin.id, "starter")],
  foundSkinIds: [starterSkin.id],
  selectedSourceInstanceId: null,
  selectedTargetSkinId: null,
  lastUpgradeResult: null,
  lastDailyClaim: null,
  dailyStreak: 0,
  totalCoinClicks: 0,
  stats: {
    totalUpgrades: 0,
    successfulUpgrades: 0,
    failedUpgrades: 0,
    bestObtainedSkinId: starterSkin.id,
  },
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      earnCoins: () => {
        const amount = getClickIncome(get());
        set((state) => ({
          coins: state.coins + amount,
          totalCoinClicks: state.totalCoinClicks + 1,
        }));
        return amount;
      },

      collectAutoIncome: () => {
        const amount = getAutoIncome(get());
        if (amount <= 0) return 0;
        set((state) => ({ coins: state.coins + amount }));
        return amount;
      },

      buyIncomeUpgrade: (kind) => {
        const state = get();
        const cost = getUpgradeCost(kind, state);
        if (state.coins < cost) return false;

        set((current) => ({
          coins: current.coins - cost,
          [kind]: current[kind] + 1,
        }));
        return true;
      },

      buySkin: (skinId) => {
        const skin = getSkin(skinId);
        const state = get();
        if (state.coins < skin.value) return false;

        set((current) => ({
          coins: current.coins - skin.value,
          inventory: [...current.inventory, makeInventoryItem(skin.id, "purchase")],
          foundSkinIds: withFoundSkin(current.foundSkinIds, skin.id),
          stats: {
            ...current.stats,
            bestObtainedSkinId: bestSkinId(current.stats.bestObtainedSkinId, skin.id),
          },
        }));
        return true;
      },

      selectSource: (instanceId) => {
        set({ selectedSourceInstanceId: instanceId, selectedTargetSkinId: null });
      },

      selectTarget: (skinId) => {
        set({ selectedTargetSkinId: skinId });
      },

      attemptUpgrade: () => {
        const state = get();
        const sourceItem = state.inventory.find((item) => item.instanceId === state.selectedSourceInstanceId);
        if (!sourceItem || !state.selectedTargetSkinId) return null;

        const sourceSkin = getSkin(sourceItem.skinId);
        const targetSkin = getSkin(state.selectedTargetSkinId);
        const chance = calculateUpgradeChance(sourceSkin.value, targetSkin.value);
        if (chance <= 0) return null;

        const roll = Number((Math.random() * 100).toFixed(2));
        const success = roll <= chance;
        const result: UpgradeResult = {
          success,
          chance,
          roll,
          sourceSkinId: sourceSkin.id,
          targetSkinId: targetSkin.id,
          timestamp: Date.now(),
        };

        set((current) => {
          const inventoryWithoutSource = current.inventory.filter(
            (item) => item.instanceId !== sourceItem.instanceId,
          );
          const nextInventory = success
            ? [...inventoryWithoutSource, makeInventoryItem(targetSkin.id, "upgrade")]
            : inventoryWithoutSource;

          return {
            inventory: nextInventory,
            foundSkinIds: success ? withFoundSkin(current.foundSkinIds, targetSkin.id) : current.foundSkinIds,
            selectedSourceInstanceId: null,
            selectedTargetSkinId: null,
            lastUpgradeResult: result,
            stats: {
              totalUpgrades: current.stats.totalUpgrades + 1,
              successfulUpgrades: current.stats.successfulUpgrades + (success ? 1 : 0),
              failedUpgrades: current.stats.failedUpgrades + (success ? 0 : 1),
              bestObtainedSkinId: success
                ? bestSkinId(current.stats.bestObtainedSkinId, targetSkin.id)
                : current.stats.bestObtainedSkinId,
            },
          };
        });

        return result;
      },

      claimDailyReward: () => {
        const state = get();
        const today = localDateKey();
        if (state.lastDailyClaim === today) return null;

        const streak = state.lastDailyClaim && daysBetween(state.lastDailyClaim, today) === 1 ? state.dailyStreak + 1 : 1;
        const coins = 2500 + streak * 900;
        const skinId = pickDailySkin(streak);

        set((current) => ({
          coins: current.coins + coins,
          dailyStreak: streak,
          lastDailyClaim: today,
          inventory: skinId ? [...current.inventory, makeInventoryItem(skinId, "daily")] : current.inventory,
          foundSkinIds: skinId ? withFoundSkin(current.foundSkinIds, skinId) : current.foundSkinIds,
          stats: skinId
            ? {
                ...current.stats,
                bestObtainedSkinId: bestSkinId(current.stats.bestObtainedSkinId, skinId),
              }
            : current.stats,
        }));

        return { coins, skinId, streak };
      },

      resetProgress: () => {
        set({
          ...initialState,
          inventory: [makeInventoryItem(starterSkin.id, "starter")],
          foundSkinIds: [starterSkin.id],
          stats: {
            ...initialState.stats,
            bestObtainedSkinId: starterSkin.id,
          },
        });
      },
    }),
    {
      name: "cs-upgrade-simulator-progress",
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
