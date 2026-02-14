/**
 * React-based Game UI Components
 * 
 * Modern React implementation of the game UI system
 * Replaces the legacy DOM manipulation approach with declarative React components
 */

import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

//import './source_code/singletons/UIReact.css'; // React UI styling
import '../styles/core-react.css';
import '../styles/heartbox-react.css';
import '../styles/gamehud-react.css';
import '../styles/stats-react.css';
import '../styles/ingame-menu-react.css';
import '../styles/controls-react.css';
import '../styles/dialogue-react.css';




// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface HeartBoxProps {
  heartCount: number;
}

interface StatsHUDProps {
  visible: boolean;
  onClose: () => void;
}

interface IngameMenuProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  onComics: () => void;
  onControls: () => void;
}

interface MenuButtonProps {
  onClick: () => void;
}

interface GameHUDProps {
  onStatsClick: () => void;
  onItemClick: () => void;
  onDialogClick: () => void;
}

interface StatsTabsProps {
  activeTab: 'inventory' | 'wallet' | 'quest' | 'stats';
  onTabChange: (tab: 'inventory' | 'wallet' | 'quest' | 'stats') => void;
}

interface ControlsProps {
  visible: boolean; 
  onClose: () => void;
}

// ============================================================================
// HEARTBOX COMPONENT
// ============================================================================

export const HeartBox: React.FC<HeartBoxProps> = ({ heartCount }) => {
  return (
    <div className="heartbox-container">
      {Array.from({ length: heartCount }, (_, i) => (
        <div
          key={i}
          className="heartbox-heart"
          style={{
            right: `${5 + i * 40}px`,
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// STATS TABS COMPONENT
// ============================================================================

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
        Stats
      </button>
      <button
        className={`v12_15 tab-button ${activeTab === 'wallet' ? 'active' : ''}`}
        onClick={() => handleTabClick('wallet')}
        data-i18n="Wallet"
      >
        Wallet
      </button>
      <button
        className={`v12_16 tab-button ${activeTab === 'inventory' ? 'active' : ''}`}
        onClick={() => handleTabClick('inventory')}
        data-i18n="Inventory"
      >
        Inventory
      </button>
      <button
        className={`v12_17 tab-button ${activeTab === 'quest' ? 'active' : ''}`}
        onClick={() => handleTabClick('quest')}
        data-i18n="Quests"
      >
        Quests
      </button>
    </div>
  );
};

// ============================================================================
// STATS HUD COMPONENT
// ============================================================================

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
    switch(tab) {
      case 'inventory':
        window.inventory?.renderInventory();
        break;
      case 'wallet':
        window.wallet?.renderWallet();
        break;
      case 'quest':
        window.quest?.renderQuests();
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
            <h2 data-i18n="Stats">Stats</h2>
            <p><span data-i18n="kills">Kills</span>: {stats.kills}</p>
            <p><span data-i18n="deaths">Deaths</span>: {stats.deaths}</p>
            <p>HP: {stats.hp}</p>
          </div>
        );
      case 'inventory':
        return <div id="inventory-items" className="v11_5" />;
      case 'wallet':
        return <div id="wallet-items" className="v11_5" />;
      case 'quest':
        return <div id="quest-items" className="v11_5" />;
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

// ============================================================================
// MENU BUTTON COMPONENT
// ============================================================================

export const MenuButton: React.FC<MenuButtonProps> = ({ onClick }) => {
  const handleClick = () => {
    if (window.music) {
      window.music.ui_sfx[2].play();
    }
    onClick();
  };

  return (
    <button className="menu-btn" onClick={handleClick}>
      <img 
        src="./kenny ui-pack/grey_crossGrey.png" 
        alt="Menu"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none'
        }}
      />
    </button>
  );
};

// ============================================================================
// GAME HUD COMPONENT
// ============================================================================

export const GameHUD: React.FC<GameHUDProps> = ({ 
  onStatsClick, 
  onItemClick, 
  onDialogClick 
}) => {
  const handleStatsClick = () => {
    if (window.music) {
      window.music.ui_sfx[1].play();
    }
    onStatsClick();
  };

  const handleItemClick = () => {
    if (window.player) {
      window.player.holdingAttack = true;
    }
  };

  const handleDialogClick = () => {
    if (window.dialogs) {
      // to do: (1) connect dialogues UI
      window.dialogs.show_dialog("...", "Aarin: ...");
    }
  };

  return (
    <div id="left-buttons" className="game-hud-buttons">
      <button className="ui-button" onClick={handleStatsClick}>
        <img src="./btn-stats.png" alt="Stats" />
      </button>
      <button className="ui-button" onClick={handleItemClick}>
        <img src="./btn-hands.png" alt="Item" />
      </button>
      <button className="ui-button" onClick={handleDialogClick}>
        <img src="./btn-interact.png" alt="Dialog" />
      </button>
    </div>
  );
};

// ============================================================================
// INGAME MENU COMPONENT
// ============================================================================

export const IngameMenu: React.FC<IngameMenuProps> = ({ 
  visible, 
  onClose,
  onNewGame,
  onContinue,
  onComics,
  onControls
}) => {
  const playSound = () => {
    if (window.music) {
      window.music.sound_start.play();
    }
  };

  const handleNewGame = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    onNewGame();
  };

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    onContinue();
  };

  const handleComics = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open("https://dystopia-app.site", "_blank");
  };

  const handleControls = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    onControls();
  };

  if (!visible) return null;

  return (
    <div id="menu-container" className="ingame-menu">
      <a 
        href="#" 
        className="menu-option" 
        onClick={handleNewGame}
        data-i18n="new game"
      >
        New Game
      </a>
      <a 
        href="#" 
        className="menu-option" 
        onClick={handleContinue}
        data-i18n="continue"
      >
        Continue
      </a>
      <a 
        href="#" 
        className="menu-option" 
        onClick={handleComics}
        data-i18n="comics"
      >
        Comics
      </a>
      <a 
        href="#" 
        className="menu-option" 
        onClick={handleControls}
        data-i18n="controls"
      >
        Controls
      </a>
    </div>
  );
};

// ============================================================================
// CONTROLS COMPONENT
// ============================================================================

export const Controls: React.FC<ControlsProps> = ({ visible, onClose }) => {
  
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  
  const languages = [
    { code: 'en_US', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh_CN', name: '中文', flag: '🇨🇳' },
    { code: 'ru_RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'pt_BR', name: 'Português', flag: '🇧🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi_IN', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'te_IN', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'yo_NG', name: 'Yorùbá', flag: '🇳🇬' },
    { code: 'ha_NG', name: 'Hausa', flag: '🇳🇬' },
    { code: 'ig_NG', name: 'Igbo', flag: '🇳🇬' }
  ];

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return window.dialogs?.language || 'en_US';
  });

  const playSound = () => {
    if (window.music) {
      window.music.sound_start.play();
    }
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    if (window.utils) {
      window.utils.saveGame();
    }
    onClose();
  };

  const handleMusic = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    if (window.music) {
      window.music.enable = !window.music.enable;
      console.log("Music settings debug: ", window.music.enable);
    }
  };

  const handleVibrations = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    // Toggle vibrations logic
  };

  const handleLanguageChange = async (lang: string) => {
    playSound();
    
    // Normalize and update the dialogs language
    const normalizedLang = window.dialogs.normalizeLocale(lang);
    window.dialogs.language = normalizedLang;
    
    // Update React state with the original code (not normalized)
    setCurrentLanguage(lang);
    
    // Close the dropdown
    setShowLanguageMenu(false);
    
    // Translate all UI elements
    await window.ui.translateUIElements(lang);
    
    // Save preference
    localStorage.setItem('game_language', lang);
    
    console.log(`Language changed to: ${lang} (normalized: ${normalizedLang})`);
  };

  if (!visible) return null;

  const getCurrentLanguageName = () => {
    const lang = languages.find(l => l.code === currentLanguage);
    return lang ? `${lang.flag} ${lang.name}` : 'Select Language';
  };

  return (
    <div id="controls-container" className="controls-menu">
      {/* Back Options */}
      <a 
        href="#" 
        className="menu-option" 
        onClick={handleBack}
        data-i18n="back"
      >
        Back
      </a>

      {/* Music Options */}
      <a 
        href="#" 
        className="menu-option" 
        onClick={handleMusic}
        data-i18n="music"
      >
        Music
      </a>

      {/* Language Dropdown */}
      <div className="language-dropdown">
        <button 
          className="menu-option language-toggle"
          onClick={() => {
            playSound();
            setShowLanguageMenu(!showLanguageMenu);
          }}
        >
          <span data-i18n="language">Language</span>: {getCurrentLanguageName()}
          <span className="dropdown-arrow">{showLanguageMenu ? '▲' : '▼'}</span>
        </button>

        {showLanguageMenu && (
          <div className="language-menu-dropdown">
            {languages.map(lang => (
              <button
                key={lang.code}
                className={`language-option ${currentLanguage === lang.code ? 'active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="flag">{lang.flag}</span>
                <span className="lang-name">{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Vibrations Options */}
      <a 
        href="#" 
        className="menu-option" 
        onClick={handleVibrations}
        data-i18n="vibration"
      >
        Vibrations
      </a>
    </div>
  );
};
// ============================================================================
// MAIN UI CONTAINER COMPONENT
// ============================================================================

export const GameUIContainer: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [heartCount, setHeartCount] = useState(3);

  useEffect(() => {
    // Update heart count from globals
    if (window.globals) {
      setHeartCount(window.globals.hp || 3);
    }
  }, []);

  const handleNewGame = () => {
    if (window.globals) {
      window.globals.GAME_START = true;
    }
    if (window.utils) {
      window.utils.saveGame();
    }
    setMenuVisible(false);
    
    if (window.ads) {
      window.ads.initialize();
      window.ads.showAds();
    }
  };

  const handleContinue = () => {
    if (window.utils) {
      window.utils.loadGame();
    }
    
    if (window.map) {
      window.map.destroy();
    }
    
    const curr_lvl = window.globals?.current_level;
    if (window.globals) {
      window.globals.GAME_START = true;
    }
    
    if (window.THREE_RENDER) {
      window.THREE_RENDER.hideThreeLayer();
    }
    
    // Load appropriate level based on saved data
    // This would need to be expanded based on your level loading logic
    
    setMenuVisible(false);
  };

  return (
    <div id="ui-root">
      {/* Top Right UI */}
      <div id="top-right-ui">
        <MenuButton onClick={() => setMenuVisible(!menuVisible)} />
        <HeartBox heartCount={heartCount} />
      </div>

      {/* Left Buttons */}
      <GameHUD
        onStatsClick={() => setStatsVisible(!statsVisible)}
        onItemClick={() => {}}
        onDialogClick={() => {}}
      />

      {/* Stats HUD */}
      <StatsHUD
        visible={statsVisible}
        onClose={() => setStatsVisible(false)}
      />

      {/* Ingame Menu */}
      <IngameMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNewGame={handleNewGame}
        onContinue={handleContinue}
        onComics={() => {}}
        onControls={() => setControlsVisible(true)}
      />

      {/* Controls */}
      <Controls
        visible={controlsVisible}
        onClose={() => setControlsVisible(false)}
      />
    </div>
  );
};

// ============================================================================
// UI MANAGER CLASS (Bridge between old system and React)
// ============================================================================

export class UIReact {
  private root: ReactDOM.Root | null = null;
  private containerElement: HTMLElement | null = null;

  constructor() {
    this.containerElement = document.getElementById('ui-root');
    
    if (!this.containerElement) {
      console.error('UI root element not found');
      return;
    }

    this.root = ReactDOM.createRoot(this.containerElement);
  }

  /**
   * Initialize and render the React UI
   */
  initialize() {
    if (!this.root) {
      console.error('React root not initialized');
      return;
    }

    this.root.render(<GameUIContainer />);

    //this.translateUIElements(window.dialogs.language);

    // Wait for translations to load

       (async () => {
            await this.waitForTranslations();
        })();
    
  }

  /**
   * Destroy the React UI
   */
  destroy() {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
  }

 /**
 * Translates all HTML elements at runtime by using their data-i18n keys.
 */
async translateUIElements(language: string) {
  if (!window.dialogs || !window.dialogs.translations) {
    console.warn("Translation system not ready yet.");
    return;
  }

  // Wait until translations file is loaded
  await this.waitForTranslations();

  // Normalize the language code
  const normalizedLang = window.dialogs.normalizeLocale(language);

  // Select all elements marked for translation
  const elements = document.querySelectorAll<HTMLElement>("[data-i18n]");

  elements.forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;

    // Translate text content using your existing Dialogs system
    const translatedText = window.dialogs.t(key, normalizedLang);
    if (translatedText && translatedText !== key) {
      el.textContent = translatedText;
    }
  });

  console.log(`✅ UI translated to ${normalizedLang}`);
}


private async waitForTranslations(): Promise<void> {
  return new Promise((resolve) => {
    const check = () => {
      if (window.dialogs && window.dialogs.loadedTranslations) {
        resolve();
      } else {
        requestAnimationFrame(check);
      }
    };
    check();
  });
  }
}

// Export for use in main game
export default UIReact;
