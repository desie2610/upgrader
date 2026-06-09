import { BarChart3, Briefcase, Crosshair, Gem, RotateCcw, Trophy } from "lucide-react";

export type ViewName = "inventory" | "upgrade" | "collection" | "stats";

interface TopBarProps {
  activeView: ViewName;
  onViewChange: (view: ViewName) => void;
  onReset: () => void;
}

const tabs = [
  { id: "inventory", label: "Инвентарь", icon: Briefcase },
  { id: "upgrade", label: "Апгрейд", icon: Crosshair },
  { id: "collection", label: "Коллекция", icon: Gem },
  { id: "stats", label: "Статистика", icon: BarChart3 },
] satisfies Array<{ id: ViewName; label: string; icon: typeof Briefcase }>;

export function TopBar({ activeView, onViewChange, onReset }: TopBarProps) {
  return (
    <header className="topbar">
      <div className="brand">
        <Trophy size={26} />
        <div>
          <h1>CS Upgrade Simulator</h1>
          <p>Local collection mode</p>
        </div>
      </div>

      <nav className="tabs" aria-label="Разделы игры">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={activeView === tab.id ? "is-active" : ""}
              type="button"
              onClick={() => onViewChange(tab.id)}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      <button className="icon-button danger" type="button" onClick={onReset} title="Сбросить прогресс">
        <RotateCcw size={18} />
      </button>
    </header>
  );
}
