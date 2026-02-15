// ============================================================================
// GAME HUD COMPONENT
// ============================================================================

//import '../../../styles/gamehud-react.css';
import '../../../styles/menu-button.css';
import "../../../styles/left-buttons.css";

// to do: (1) add in separate css for game hud
// (2) separate menu button into separate component


interface GameHUDProps {
  onStatsClick: () => void;
  onItemClick: () => void;
  onDialogClick: () => void;
}

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
      /**
       * Code is called in UI/GameUIContainer.tsx
       * and created in DialogueBox.tsx
       */
      
      //decision dialogue box
      //showDialog,
      //showDecisionDialog,
      //hideDialog,


      // regular dialogue box
      window.dialogs.showDialog(window.ui.t("char1", window.ui.language), window.ui.t("Character", window.ui.language));
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
