// ============================================================================
// STATS TABS COMPONENT
// ============================================================================


interface StatsTabsProps {
  activeTab: 'inventory' | 'wallet' | 'quest' | 'stats';
  onTabChange: (tab: 'inventory' | 'wallet' | 'quest' | 'stats') => void;
}

export const StatsTabs: React.FC<StatsTabsProps> = ({ activeTab, onTabChange }) => {
  const handleTabClick = (tab: 'inventory' | 'wallet' | 'quest' | 'stats') => {
    if (window.music) {
      window.music.ui_sfx[0].play();
    }
    onTabChange(tab);
  };

  return (
    <div className="stats-tabs">
      <button
        className={`v12_14 tab-button ${activeTab === 'stats' ? 'active' : ''}`}
        onClick={() => handleTabClick('stats')}
        data-i18n="Stats"
      >
        {window.ui.t("Stats")}
      </button>
      <button
        className={`v12_15 tab-button ${activeTab === 'wallet' ? 'active' : ''}`}
        onClick={() => handleTabClick('wallet')}
        data-i18n="Wallet"
      >
        {window.ui.t("wallet")}
      </button>
      <button
        className={`v12_16 tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => handleTabClick('inventory')}
        data-i18n="Inventory"
      >
        {window.ui.t("inventory")}
      </button>
      <button
        className={`v12_17 tab-button ${activeTab === 'quest' ? 'active' : ''}`}
        onClick={() => handleTabClick('quest')}
        data-i18n="Quests"
      >
        {window.ui.t("quests")}
      </button>
    </div>
  );
};

