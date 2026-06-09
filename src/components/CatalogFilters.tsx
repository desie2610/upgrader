import { Search, SlidersHorizontal } from "lucide-react";
import {
  categoryLabels,
  qualityOrder,
  rarityOrder,
  weapons as allWeapons,
} from "../data/skinCatalog";
import type { Skin, SkinCategory, SkinQuality, SkinRarity } from "../types";

export interface CatalogFilterState {
  query: string;
  category: "all" | SkinCategory;
  weapon: "all" | string;
  rarity: "all" | SkinRarity;
  quality: "all" | SkinQuality;
}

interface CatalogFiltersProps {
  filters: CatalogFilterState;
  onChange: (filters: CatalogFilterState) => void;
  weapons?: string[];
  total: number;
  shown: number;
}

export const emptyFilters: CatalogFilterState = {
  query: "",
  category: "all",
  weapon: "all",
  rarity: "all",
  quality: "all",
};

export function filterSkins<T extends { skin: Skin }>(items: T[], filters: CatalogFilterState): T[] {
  const query = filters.query.trim().toLowerCase();
  return items.filter(({ skin }) => {
    const matchesQuery =
      !query ||
      skin.name.toLowerCase().includes(query) ||
      skin.weapon.toLowerCase().includes(query) ||
      skin.quality.toLowerCase().includes(query);

    return (
      matchesQuery &&
      (filters.category === "all" || skin.category === filters.category) &&
      (filters.weapon === "all" || skin.weapon === filters.weapon) &&
      (filters.rarity === "all" || skin.rarity === filters.rarity) &&
      (filters.quality === "all" || skin.quality === filters.quality)
    );
  });
}

export function CatalogFilters({
  filters,
  onChange,
  weapons = allWeapons,
  total,
  shown,
}: CatalogFiltersProps) {
  return (
    <div className="filters">
      <label className="search-field">
        <Search size={18} />
        <input
          value={filters.query}
          placeholder="Поиск по названию"
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
        />
      </label>

      <div className="filters__selects">
        <label>
          <SlidersHorizontal size={16} />
          <select
            value={filters.category}
            onChange={(event) => onChange({ ...filters, category: event.target.value as CatalogFilterState["category"] })}
          >
            <option value="all">Все категории</option>
            {Object.entries(categoryLabels).map(([category, label]) => (
              <option key={category} value={category}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <select
            value={filters.weapon}
            onChange={(event) => onChange({ ...filters, weapon: event.target.value })}
          >
            <option value="all">Все оружие</option>
            {weapons.map((weapon) => (
              <option key={weapon} value={weapon}>
                {weapon}
              </option>
            ))}
          </select>
        </label>

        <label>
          <select
            value={filters.rarity}
            onChange={(event) => onChange({ ...filters, rarity: event.target.value as CatalogFilterState["rarity"] })}
          >
            <option value="all">Все редкости</option>
            {rarityOrder.map((rarity) => (
              <option key={rarity} value={rarity}>
                {rarity}
              </option>
            ))}
          </select>
        </label>

        <label>
          <select
            value={filters.quality}
            onChange={(event) => onChange({ ...filters, quality: event.target.value as CatalogFilterState["quality"] })}
          >
            <option value="all">Все качества</option>
            {qualityOrder.map((quality) => (
              <option key={quality} value={quality}>
                {quality}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="filters__count">
        {shown} / {total}
      </p>
    </div>
  );
}
