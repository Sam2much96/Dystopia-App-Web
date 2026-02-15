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




import DialogueBox, { Choice } from "./DialogueBox.tsx";



export const GameUIContainer: React.FC = () => {

  /**
   * Use state is how we create variables in React
   * 
   */
  const [menuVisible, setMenuVisible] = useState(true);
  const [statsVisible, setStatsVisible] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [heartCount, setHeartCount] = useState(3);
  const [translationsReady, setTranslationsReady] = useState(false);

    /* Dialogue State */
  const [dialogVisible, setDialogVisible] = useState(false);
  const [speaker, setSpeaker] = useState("");
  const [text, setText] = useState("");
  const [choices, setChoices] = useState<Choice[] | undefined>();

/**
 * Use Effects are functions that run outside React
 * 
 */

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



  useEffect(() => {
    window.dialogs = {
      showDialog,
      showDecisionDialog,
      hideDialog,
    };


    console.log("UI Dialogue API ready");

    

}, []);

  /* Normal dialogue */
  function showDialog(speaker: string, text: string) {
    setSpeaker(speaker);
    setText(text);
    setChoices(undefined);
    setDialogVisible(true);
  }

  /* Decision dialogue */
  function showDecisionDialog(
    speaker: string,
    text: string,
    choices: Choice[]
  ) {
    setSpeaker(speaker);
    setText(text);
    setChoices(choices);
    setDialogVisible(true);
  }

    function hideDialog() {
    setDialogVisible(false);
  }


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

  //renders the game hud UI using react components
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

      {/* DIalogbox */}
      <DialogueBox 
         visible={dialogVisible}
        speaker={speaker}
        text={text}
        choices={choices}
        onClose={hideDialog}
      />
    </div>
  );
};
