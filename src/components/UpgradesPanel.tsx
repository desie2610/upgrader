import { Gauge, MousePointer2, Plus, Timer, TrendingUp } from "lucide-react";
import { formatCoins, getUpgradeCost, upgradeLabels } from "../lib/economy";
import { useGameStore } from "../store/gameStore";
import type { UpgradeKind } from "../types";

const upgradeIcons: Record<UpgradeKind, typeof MousePointer2> = {
  clickPower: MousePointer2,
  autoClicker: Timer,
  autoSpeed: Gauge,
  incomeMultiplier: TrendingUp,
};

export function UpgradesPanel() {
  const coins = useGameStore((state) => state.coins);
  const levels = useGameStore((state) => ({
    clickPower: state.clickPower,
    autoClicker: state.autoClicker,
    autoSpeed: state.autoSpeed,
    incomeMultiplier: state.incomeMultiplier,
  }));
  const buyIncomeUpgrade = useGameStore((state) => state.buyIncomeUpgrade);
  const kinds = Object.keys(upgradeLabels) as UpgradeKind[];

  return (
    <section className="panel upgrades-panel">
      <div className="panel__title">
        <TrendingUp size={20} />
        <h2>Улучшения</h2>
      </div>

      <div className="upgrade-list">
        {kinds.map((kind) => {
          const Icon = upgradeIcons[kind];
          const cost = getUpgradeCost(kind, levels);
          const canBuy = coins >= cost;

          return (
            <article className="upgrade-item" key={kind}>
              <Icon size={21} />
              <div>
                <h3>{upgradeLabels[kind].title}</h3>
                <p>{upgradeLabels[kind].text}</p>
                <span>Уровень {levels[kind]}</span>
              </div>
              <button type="button" disabled={!canBuy} onClick={() => buyIncomeUpgrade(kind)}>
                <Plus size={16} />
                <span>{formatCoins(cost)}</span>
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
