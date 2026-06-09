import { useEffect, useState } from "react";
import { CoinPanel } from "./components/CoinPanel";
import { DailyReward } from "./components/DailyReward";
import { TopBar, type ViewName } from "./components/TopBar";
import { UpgradesPanel } from "./components/UpgradesPanel";
import { CollectionView } from "./views/CollectionView";
import { InventoryView } from "./views/InventoryView";
import { StatsView } from "./views/StatsView";
import { UpgradeLab } from "./views/UpgradeLab";
import { useGameStore } from "./store/gameStore";
import "./styles.css";

function ToastLayer() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number | undefined;
    const onToast = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      setMessage(detail);
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setMessage(null), 2800);
    };

    document.addEventListener("toast", onToast);
    return () => {
      document.removeEventListener("toast", onToast);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return <div className={`toast ${message ? "is-visible" : ""}`}>{message}</div>;
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewName>("upgrade");
  const collectAutoIncome = useGameStore((state) => state.collectAutoIncome);
  const resetProgress = useGameStore((state) => state.resetProgress);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      useGameStore.getState().collectAutoIncome();
    }, 1000);
    return () => window.clearInterval(intervalId);
  }, [collectAutoIncome]);

  function renderView() {
    if (activeView === "inventory") return <InventoryView onViewChange={setActiveView} />;
    if (activeView === "collection") return <CollectionView />;
    if (activeView === "stats") return <StatsView />;
    return <UpgradeLab />;
  }

  return (
    <div className="app">
      <TopBar
        activeView={activeView}
        onViewChange={setActiveView}
        onReset={() => {
          if (window.confirm("Сбросить локальный прогресс?")) resetProgress();
        }}
      />

      <main className="app-layout">
        <aside className="sidebar">
          <CoinPanel />
          <DailyReward />
          <UpgradesPanel />
          <p className="safety-note">Локальный фан-симулятор: монеты и предметы не имеют реальной ценности.</p>
        </aside>

        {renderView()}
      </main>

      <ToastLayer />
    </div>
  );
}
