import { ArrowUpRight, Briefcase } from "lucide-react";
import { useMemo, useState } from "react";
import { CatalogFilters, emptyFilters, filterSkins } from "../components/CatalogFilters";
import { SkinCard } from "../components/SkinCard";
import { getSkin } from "../data/skinCatalog";
import { useGameStore } from "../store/gameStore";
import type { ViewName } from "../components/TopBar";

interface InventoryViewProps {
  onViewChange: (view: ViewName) => void;
}

export function InventoryView({ onViewChange }: InventoryViewProps) {
  const [filters, setFilters] = useState(emptyFilters);
  const inventory = useGameStore((state) => state.inventory);
  const selectedSourceInstanceId = useGameStore((state) => state.selectedSourceInstanceId);
  const selectSource = useGameStore((state) => state.selectSource);

  const inventoryRows = useMemo(
    () =>
      inventory
        .map((item) => ({ item, skin: getSkin(item.skinId) }))
        .sort((a, b) => b.item.acquiredAt - a.item.acquiredAt),
    [inventory],
  );

  const ownedCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of inventoryRows) counts.set(row.skin.id, (counts.get(row.skin.id) ?? 0) + 1);
    return counts;
  }, [inventoryRows]);

  const weapons = useMemo(
    () => Array.from(new Set(inventoryRows.map((row) => row.skin.weapon))).sort((a, b) => a.localeCompare(b)),
    [inventoryRows],
  );
  const filteredRows = filterSkins(inventoryRows, filters);

  return (
    <section className="workspace-panel inventory-view">
      <div className="view-header">
        <div>
          <p className="eyebrow">
            <Briefcase size={15} /> Инвентарь
          </p>
          <h2>{inventory.length} предметов</h2>
        </div>
        <button
          className="secondary-button"
          type="button"
          disabled={!selectedSourceInstanceId}
          onClick={() => onViewChange("upgrade")}
        >
          <ArrowUpRight size={17} />
          <span>В апгрейд</span>
        </button>
      </div>

      <CatalogFilters
        filters={filters}
        onChange={setFilters}
        weapons={weapons}
        total={inventoryRows.length}
        shown={filteredRows.length}
      />

      <div className="skin-grid">
        {filteredRows.map(({ item, skin }) => (
          <SkinCard
            key={item.instanceId}
            skin={skin}
            ownedCount={ownedCounts.get(skin.id)}
            selected={item.instanceId === selectedSourceInstanceId}
            onSelect={() => selectSource(item.instanceId)}
          />
        ))}
      </div>

      {filteredRows.length === 0 && <p className="empty-state">Нет предметов по выбранным фильтрам.</p>}
    </section>
  );
}
