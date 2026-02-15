
// ============================================================================
// MENU BUTTON COMPONENT
// ============================================================================

interface MenuButtonProps {
  onClick: () => void;
}

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
        onClick={handleClick}
      />
    </button>
  );
};