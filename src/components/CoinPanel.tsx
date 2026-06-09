import { Coins, MousePointerClick, Zap } from "lucide-react";
import { getAutoIncome, getClickIncome } from "../lib/economy";
import { playSound } from "../lib/sound";
import { useGameStore } from "../store/gameStore";
import { formatCoins } from "../lib/economy";

export function CoinPanel() {
  const coins = useGameStore((state) => state.coins);
  const levels = useGameStore((state) => ({
    clickPower: state.clickPower,
    autoClicker: state.autoClicker,
    autoSpeed: state.autoSpeed,
    incomeMultiplier: state.incomeMultiplier,
  }));
  const earnCoins = useGameStore((state) => state.earnCoins);
  const clickIncome = getClickIncome(levels);
  const autoIncome = getAutoIncome(levels);

  return (
    <section className="panel coin-panel">
      <div className="panel__title">
        <Coins size={20} />
        <h2>Монеты</h2>
      </div>
      <strong className="coin-total">{formatCoins(coins)}</strong>

      <button
        className="primary-button earn-button"
        type="button"
        onClick={() => {
          earnCoins();
          playSound("coin");
        }}
      >
        <MousePointerClick size={20} />
        <span>Заработать монеты</span>
      </button>

      <div className="income-strip">
        <span>
          <MousePointerClick size={15} />
          +{formatCoins(clickIncome)}
        </span>
        <span>
          <Zap size={15} />
          +{formatCoins(autoIncome)}/сек
        </span>
      </div>
    </section>
  );
}
