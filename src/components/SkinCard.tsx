import type { CSSProperties, MouseEventHandler } from "react";
import { Check, Lock, ShoppingCart, Target } from "lucide-react";
import { rarityColors } from "../data/skinCatalog";
import { formatCoins } from "../lib/economy";
import type { Skin } from "../types";

interface SkinCardProps {
  skin: Skin;
  ownedCount?: number;
  found?: boolean;
  selected?: boolean;
  disabled?: boolean;
  actionLabel?: string;
  onSelect?: MouseEventHandler<HTMLButtonElement>;
  onAction?: MouseEventHandler<HTMLButtonElement>;
}

export function SkinCard({
  skin,
  ownedCount = 0,
  found = true,
  selected = false,
  disabled = false,
  actionLabel,
  onSelect,
  onAction,
}: SkinCardProps) {
  const style = { "--rarity-color": rarityColors[skin.rarity] } as CSSProperties;

  return (
    <article className={`skin-card ${selected ? "is-selected" : ""} ${!found ? "is-locked" : ""}`} style={style}>
      <button className="skin-card__preview" type="button" onClick={onSelect} disabled={disabled || !onSelect}>
        <img src={skin.image} alt={skin.name} loading="lazy" />
        {!found && (
          <span className="skin-card__lock" aria-label="Не найдено">
            <Lock size={18} />
          </span>
        )}
      </button>

      <div className="skin-card__body">
        <div>
          <p className="skin-card__weapon">{skin.weapon}</p>
          <h3>{skin.skinName}</h3>
        </div>
        <p className="skin-card__meta">{skin.quality}</p>
        <p className="skin-card__rarity">{skin.rarity}</p>
        <div className="skin-card__footer">
          <strong>{formatCoins(skin.value)}</strong>
          {ownedCount > 0 && (
            <span className="skin-card__count">
              <Check size={14} /> x{ownedCount}
            </span>
          )}
        </div>
        {actionLabel && onAction && (
          <button className="skin-card__action" type="button" onClick={onAction} disabled={disabled}>
            {actionLabel === "Цель" ? <Target size={16} /> : <ShoppingCart size={16} />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </article>
  );
}
