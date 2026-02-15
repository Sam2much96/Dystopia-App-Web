// ============================================================================
// MAIN UI CONTAINER COMPONENT
// ============================================================================



import React, { useState, useEffect, useCallback } from 'react';

// React UI components
import { MenuButton } from './MenuButton.tsx';
import { HeartBox } from './Heartbox.tsx';
import { GameHUD } from './GameHUD.tsx';
import { StatsHUD } from './StatsHUD.tsx';
import { IngameMenu } from './lngameMenu.tsx';
import { Controls } from './Controls.tsx';




export const GameUIContainer: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [heartCount, setHeartCount] = useState(3);
  const [translationsReady, setTranslationsReady] = useState(false);


  useEffect(() => {
    let lastHP = -1;

    const update = () =>{
      if (window.globals){
        const hp = window.globals.hp ?? 5;
        if (hp !== lastHP){
          lastHP = hp;
          setHeartCount(hp);
        }
      }

       requestAnimationFrame(update);
    };
   update()
   return () => {}

  }, []);


  useEffect(() => {
    if (!window.ui) return;

    window.ui.setOnTranslationsLoaded(() => {
    setTranslationsReady(true);
  });
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
    <div id="ui-root" key={translationsReady ? "ready" : "loading"}>
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
