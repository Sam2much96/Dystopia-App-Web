// ============================================================================
// STATS HUD COMPONENT
// ============================================================================

import React, { useState, useEffect} from 'react';

import { StatsTabs } from './StatsTab.tsx'; // react UI component
import {WalletPanel} from "../Wallet/WalletPanel.tsx"
import { QuestPanel } from '../Quest/QuestPanel.tsx';

import '../../../styles/stats-react.css';
import { InventoryPanel } from '../Inventory/InventoryPanel.tsx';


interface StatsHUDProps {
  visible: boolean;
  onClose: () => void;
}


export const StatsHUD: React.FC<StatsHUDProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'wallet' | 'quest' | 'stats'>('inventory');
  const [stats, setStats] = useState({
    hp: 0,
    kills: 0,
    deaths: 0
  });


  // to do:
  //(1) add a use effects for wallet stats
  useEffect(() => {
    if (visible && window.globals) {
      setStats({
        hp: window.globals.hp,
        kills: window.globals.kill_count,
        deaths: window.globals.death_count
      });
    }
  }, [visible, activeTab]);

  const handleTabChange = (tab: 'inventory' | 'wallet' | 'quest' | 'stats') => {
    setActiveTab(tab);
    
    // Trigger appropriate render function
    // to do:
    // (1) format each render function to use react to render instead of dom manupulation
    //depreciated status HUD function
    // to do : (1) finish porting inventory and quests into React components and export them in render content function below
    //hfhsdhgff
    switch(tab) {
      case 'inventory':
        //window.inventory?.renderInventory();
        break;
      case 'wallet':
         // return (
         //   <div className="wallet-tab">
         //</div>     <WalletPanel visible={true} onClose={function (): void {
         //       throw new Error('Function not implemented.');
         //     } } />
         //   </div>
        //  );
        break;
      case 'quest':
        //window.quest?.renderQuests();
        break;
      case 'stats':
        // Stats are handled by React state
        break;
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'stats':
        return (
          <div className="stats-tab">
            <h2 data-i18n="Stats">{window.ui.t("Stats")}</h2>
            <p><span data-i18n="kills">{window.ui.t("kills",window.ui.language)}</span>: {stats.kills}</p>
            <p><span data-i18n="deaths">{window.ui.t("deaths",window.ui.language)}</span>: {stats.deaths}</p>
            <p>HP: {stats.hp}</p>
          </div>
        );
      case 'inventory':
        return <InventoryPanel/>
          
        ;
      case 'wallet':
        return <div id="wallet-items" className="v11_5">
          <div className="wallet-tab">
             <WalletPanel visible={true} onClose={() => {}}></WalletPanel>
          </div>

        </div> ;
      case 'quest':
        return <QuestPanel />;
      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <div id="hud" className="stats-hud">
      <StatsTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="stats-content">
        {renderContent()}
      </div>
    </div>
  );
};
