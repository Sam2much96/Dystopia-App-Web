
// ============================================================================
// CONTROLS COMPONENT
// ============================================================================
import React, { useState, useEffect, useCallback } from 'react';


import '../../../styles/controls-react.css';


// ============================================================================
// TYPE DEFINITIONS
// ============================================================================



interface ControlsProps {
  visible: boolean; 
  onClose: () => void;
}




export const Controls: React.FC<ControlsProps> = ({ visible, onClose }) => {
  
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
  return window.music?.enable ?? true;
  });

  useEffect(() => {
  const sync = () => {
    if (window.music) {
      setMusicEnabled(window.music.enable);
    }

    requestAnimationFrame(sync);
  };

  sync();

  return () => {};
}, []);

  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  //bug:
  // (1) the normalizeLocale function breaks when using pt_BR locale
  // i used a hacky fix by defaulting to es spanish which is not a native translation of brazillain portuguese

  const languages = [
    { code: 'en_US', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'zh_CN', name: '中文', flag: '🇨🇳' },
    { code: 'ru_RU', name: 'Русский', flag: '🇷🇺' },
    { code: 'es', name: 'Português', flag: '🇧🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi_IN', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'yo_NG', name: 'Yorùbá', flag: '🇳🇬' },

  ];

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return window.ui.language || 'en_US';
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

const handleMusic = (e?: React.MouseEvent) => {
  if (e) e.preventDefault();

  playSound();

  if (!window.music) return;

  const newValue = !window.music.enable;

  window.music.enable = newValue;
  setMusicEnabled(newValue);
};


  const handleVibrations = (e: React.MouseEvent) => {
    e.preventDefault();
    playSound();
    // Toggle vibrations logic
  };

  const handleLanguageChange = async (lang: string) => {
    playSound();
    
    // Normalize and update the dialogs language
    const normalizedLang = window.ui.normalizeLocale(lang);
    window.ui.language = normalizedLang;
    
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
      <button 
        type="button" 
        className="menu-option" 
        onClick={handleBack}
        data-i18n="back"
      >
        {window.ui.t("back")}
      </button>

      {/* Music Options */}
      <button
        type="button"
        className="menu-option music-toggle"
        onClick={handleMusic}
      >
        <span data-i18n="music">Music</span>

        <span className="music-checkbox">
          {musicEnabled ? "✔️" : "❌"}
        </span>
      </button>

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
      <button 
        type="button" 
        className="menu-option" 
        onClick={handleVibrations}
        data-i18n="vibration"
      >
        {window.ui.t("vibration")}
      </button>
    </div>
  );
};