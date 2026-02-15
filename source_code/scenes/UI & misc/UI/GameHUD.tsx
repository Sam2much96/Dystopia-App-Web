// ============================================================================
// GAME HUD COMPONENT
// ============================================================================

import '../../../styles/gamehud-react.css';


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
