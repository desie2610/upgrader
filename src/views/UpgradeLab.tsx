import { Crosshair, Dice5, ShieldAlert, Sparkles, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { CatalogFilters, emptyFilters, filterSkins } from "../components/CatalogFilters";
import { SkinCard } from "../components/SkinCard";
import { getSkin, skinCatalog } from "../data/skinCatalog";
import { calculateUpgradeChance, formatChance, formatCoins } from "../lib/economy";
import { playSound } from "../lib/sound";
import { useGameStore } from "../store/gameStore";

export function UpgradeLab() {
  const [targetFilters, setTargetFilters] = useState(emptyFilters);
  const [rolling, setRolling] = useState(false);
  const inventory = useGameStore((state) => state.inventory);
  const selectedSourceInstanceId = useGameStore((state) => state.selectedSourceInstanceId);
  const selectedTargetSkinId = useGameStore((state) => state.selectedTargetSkinId);
  const selectSource = useGameStore((state) => state.selectSource);
  const selectTarget = useGameStore((state) => state.selectTarget);
  const attemptUpgrade = useGameStore((state) => state.attemptUpgrade);

  const sourceRows = useMemo(
    () =>
      inventory
        .map((item) => ({ item, skin: getSkin(item.skinId) }))
        .sort((a, b) => b.skin.value - a.skin.value),
    [inventory],
  );
  const selectedSource = sourceRows.find((row) => row.item.instanceId === selectedSourceInstanceId);
  const selectedTarget = selectedTargetSkinId ? getSkin(selectedTargetSkinId) : null;
  const targetRows = useMemo(() => {
    const sourceValue = selectedSource?.skin.value ?? 0;
    return skinCatalog.filter((skin) => skin.value > sourceValue).map((skin) => ({ skin }));
  }, [selectedSource?.skin.value]);
  const filteredTargets = filterSkins(targetRows, targetFilters);
  const chance =
    selectedSource && selectedTarget ? calculateUpgradeChance(selectedSource.skin.value, selectedTarget.value) : 0;

  function runUpgrade() {
    if (!selectedSource || !selectedTarget || rolling) return;

    setRolling(true);
    window.setTimeout(() => {
      const result = attemptUpgrade();
      if (result) {
        playSound(result.success ? "success" : "failure");
        document.dispatchEvent(
          new CustomEvent("toast", {
            detail: result.success
              ? `Успех: получен ${getSkin(result.targetSkinId).name}`
              : `Провал: ${getSkin(result.sourceSkinId).name} исчез`,
          }),
        );
      }
      setRolling(false);
    }, 1100);
  }

  return (
    <section className="workspace-panel upgrade-lab">
      <div className="view-header">
        <div>
          <p className="eyebrow">
            <Crosshair size={15} /> Апгрейд
          </p>
          <h2>Шанс считается автоматически</h2>
        </div>
        <button
          className={`primary-button upgrade-button ${rolling ? "is-rolling" : ""}`}
          type="button"
          disabled={!selectedSource || !selectedTarget || chance <= 0 || rolling}
          onClick={runUpgrade}
        >
          <Dice5 size={18} />
          <span>{rolling ? "Ролл..." : "Подтвердить"}</span>
        </button>
      </div>

      <div className="upgrade-summary">
        <div className="summary-slot">
          <ShieldAlert size={19} />
          <div>
            <p>Исходный</p>
            <strong>{selectedSource ? selectedSource.skin.name : "Не выбран"}</strong>
          </div>
        </div>
        <div className={`chance-meter ${rolling ? "is-rolling" : ""}`}>
          <span>{formatChance(chance)}</span>
          <div>
            <i style={{ width: `${Math.min(100, chance)}%` }} />
          </div>
        </div>
        <div className="summary-slot">
          <Sparkles size={19} />
          <div>
            <p>Цель</p>
            <strong>{selectedTarget ? selectedTarget.name : "Не выбрана"}</strong>
          </div>
        </div>
      </div>

      <div className="upgrade-columns">
        <section>
          <div className="column-title">
            <Target size={17} />
            <h3>Исходный предмет</h3>
          </div>
          <div className="source-list">
            {sourceRows.map(({ item, skin }) => (
              <button
                key={item.instanceId}
                className={item.instanceId === selectedSourceInstanceId ? "is-active" : ""}
                type="button"
                onClick={() => selectSource(item.instanceId)}
              >
                <img src={skin.image} alt={skin.name} />
                <span>{skin.name}</span>
                <strong>{formatCoins(skin.value)}</strong>
              </button>
            ))}
          </div>
        </section>

        <section>
          <div className="column-title">
            <Sparkles size={17} />
            <h3>Цель улучшения</h3>
          </div>
          <CatalogFilters
            filters={targetFilters}
            onChange={setTargetFilters}
            total={targetRows.length}
            shown={filteredTargets.length}
          />
          <div className="skin-grid target-grid">
            {filteredTargets.map(({ skin }) => (
              <SkinCard
                key={skin.id}
                skin={skin}
                selected={skin.id === selectedTargetSkinId}
                actionLabel="Цель"
                onSelect={() => selectTarget(skin.id)}
                onAction={() => selectTarget(skin.id)}
              />
            ))}
          </div>
          {selectedSource && filteredTargets.length === 0 && (
            <p className="empty-state">Для выбранного предмета нет более дорогих целей по фильтрам.</p>
          )}
        </section>
      </div>
    </section>
  );
}
