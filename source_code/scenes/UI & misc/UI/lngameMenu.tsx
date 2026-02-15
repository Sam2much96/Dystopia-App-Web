// ============================================================================
// INGAME MENU COMPONENT
// ============================================================================

import '../../../styles/ingame-menu-react.css';

interface IngameMenuProps {
  visible: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onContinue: () => void;
  onComics: () => void;
  onControls: () => void;
}


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
      <button 
        type="button" 
        className="menu-option" 
        onClick={handleNewGame}
        data-i18n="new game"
      >
        {window.ui.t("new game")}
      </button>
      <button 
        type="button" 
        className="menu-option" 
        onClick={handleContinue}
        data-i18n="continue"
      >
        {window.ui.t("continue",window.ui.language)}
      </button>
      <button 
        type="button" 
        className="menu-option" 
        onClick={handleComics}
        data-i18n="comics"
      >
        {window.ui.t("comics",window.ui.language)}
      </button>
      <button 
        type="button" 
        className="menu-option" 
        onClick={handleControls}
        data-i18n="controls"
      >
        {window.ui.t("controls",window.ui.language)}
      </button>
    </div>
  );
};
