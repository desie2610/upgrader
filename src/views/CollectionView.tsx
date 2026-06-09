import { Gem, ShoppingCart } from "lucide-react";
import { useMemo, useState } from "react";
import { CatalogFilters, emptyFilters, filterSkins } from "../components/CatalogFilters";
import { SkinCard } from "../components/SkinCard";
import { skinCatalog } from "../data/skinCatalog";
import { formatCoins } from "../lib/economy";
import { useGameStore } from "../store/gameStore";

type CollectionMode = "all" | "found" | "missing";

export function CollectionView() {
  const [filters, setFilters] = useState(emptyFilters);
  const [mode, setMode] = useState<CollectionMode>("all");
  const coins = useGameStore((state) => state.coins);
  const foundSkinIds = useGameStore((state) => state.foundSkinIds);
  const inventory = useGameStore((state) => state.inventory);
  const buySkin = useGameStore((state) => state.buySkin);
  const foundSet = useMemo(() => new Set(foundSkinIds), [foundSkinIds]);

  const ownedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of inventory) counts.set(item.skinId, (counts.get(item.skinId) ?? 0) + 1);
    return counts;
  }, [inventory]);

  const rows = useMemo(() => {
    return skinCatalog
      .filter((skin) => {
        if (mode === "found") return foundSet.has(skin.id);
        if (mode === "missing") return !foundSet.has(skin.id);
        return true;
      })
      .map((skin) => ({ skin }));
  }, [foundSet, mode]);

  const filteredRows = filterSkins(rows, filters);

  return (
    <section className="workspace-panel collection-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">
            <Gem size={15} /> Коллекция
          </p>
          <h2>
            {foundSkinIds.length} / {skinCatalog.length} найдено
          </h2>
        </div>
        <div className="segmented">
          {(["all", "found", "missing"] as CollectionMode[]).map((item) => (
            <button key={item} type="button" className={mode === item ? "is-active" : ""} onClick={() => setMode(item)}>
              {item === "all" ? "Все" : item === "found" ? "Найденные" : "Скрытые"}
            </button>
          ))}
        </div>
      </div>

      <CatalogFilters filters={filters} onChange={setFilters} total={rows.length} shown={filteredRows.length} />

      <div className="skin-grid">
        {filteredRows.map(({ skin }) => {
          const found = foundSet.has(skin.id);
          const canBuy = coins >= skin.value;

          return (
            <SkinCard
              key={skin.id}
              skin={skin}
              found={found}
              ownedCount={ownedCounts.get(skin.id)}
              actionLabel={canBuy ? "Купить" : formatCoins(skin.value)}
              disabled={!canBuy}
              onAction={() => buySkin(skin.id)}
            />
          );
        })}
      </div>
    </section>
  );
}
