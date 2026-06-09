import { BarChart3, Crown, Flame, Medal, Trophy } from "lucide-react";
import { getAchievements } from "../data/achievements";
import { getSkin } from "../data/skinCatalog";
import { formatCoins } from "../lib/economy";
import { useGameStore } from "../store/gameStore";

export function StatsView() {
  const coins = useGameStore((state) => state.coins);
  const inventoryCount = useGameStore((state) => state.inventory.length);
  const foundCount = useGameStore((state) => state.foundSkinIds.length);
  const dailyStreak = useGameStore((state) => state.dailyStreak);
  const totalCoinClicks = useGameStore((state) => state.totalCoinClicks);
  const stats = useGameStore((state) => state.stats);
  const luckRate = stats.totalUpgrades > 0 ? (stats.successfulUpgrades / stats.totalUpgrades) * 100 : 0;
  const bestSkin = stats.bestObtainedSkinId ? getSkin(stats.bestObtainedSkinId) : null;
  const achievements = getAchievements({
    coins,
    totalCoinClicks,
    inventoryCount,
    foundCount,
    dailyStreak,
    stats,
  });

  return (
    <section className="workspace-panel stats-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">
            <BarChart3 size={15} /> Статистика
          </p>
          <h2>Прогресс прохождения</h2>
        </div>
      </div>

      <div className="stats-grid">
        <article>
          <Trophy size={22} />
          <span>Всего апгрейдов</span>
          <strong>{stats.totalUpgrades}</strong>
        </article>
        <article>
          <Flame size={22} />
          <span>Успешных</span>
          <strong>{stats.successfulUpgrades}</strong>
        </article>
        <article>
          <Medal size={22} />
          <span>Процент удачи</span>
          <strong>{luckRate.toFixed(2)}%</strong>
        </article>
        <article>
          <Crown size={22} />
          <span>Лучший предмет</span>
          <strong>{bestSkin ? formatCoins(bestSkin.value) : "0 монет"}</strong>
        </article>
      </div>

      {bestSkin && (
        <div className="best-skin">
          <img src={bestSkin.image} alt={bestSkin.name} />
          <div>
            <p>Самый дорогой полученный предмет</p>
            <h3>{bestSkin.name}</h3>
            <span>
              {bestSkin.quality} / {bestSkin.rarity}
            </span>
          </div>
        </div>
      )}

      <div className="achievement-grid">
        {achievements.map((achievement) => (
          <article key={achievement.id} className={achievement.unlocked ? "is-unlocked" : ""}>
            <div>
              <Trophy size={18} />
              <h3>{achievement.title}</h3>
            </div>
            <p>{achievement.text}</p>
            <div className="achievement-bar">
              <i style={{ width: `${(achievement.progress / achievement.goal) * 100}%` }} />
            </div>
            <span>
              {achievement.progress} / {achievement.goal}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
