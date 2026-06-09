import { CalendarCheck, Gift } from "lucide-react";
import { getSkin } from "../data/skinCatalog";
import { formatCoins } from "../lib/economy";
import { playSound } from "../lib/sound";
import { useGameStore } from "../store/gameStore";

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${`${now.getMonth() + 1}`.padStart(2, "0")}-${`${now.getDate()}`.padStart(2, "0")}`;
}

export function DailyReward() {
  const lastDailyClaim = useGameStore((state) => state.lastDailyClaim);
  const dailyStreak = useGameStore((state) => state.dailyStreak);
  const claimDailyReward = useGameStore((state) => state.claimDailyReward);
  const canClaim = lastDailyClaim !== todayKey();

  return (
    <section className="panel daily-panel">
      <div className="panel__title">
        <Gift size={20} />
        <h2>Ежедневная награда</h2>
      </div>
      <p className="daily-streak">
        <CalendarCheck size={16} />
        Серия: {dailyStreak}
      </p>
      <button
        className="secondary-button"
        type="button"
        disabled={!canClaim}
        onClick={() => {
          const reward = claimDailyReward();
          if (reward) {
            playSound("daily");
            const skinText = reward.skinId ? ` + ${getSkin(reward.skinId).name}` : "";
            window.setTimeout(() => {
              document.dispatchEvent(
                new CustomEvent("toast", {
                  detail: `Награда: ${formatCoins(reward.coins)}${skinText}`,
                }),
              );
            }, 20);
          }
        }}
      >
        <Gift size={17} />
        <span>{canClaim ? "Забрать" : "Получено"}</span>
      </button>
    </section>
  );
}
