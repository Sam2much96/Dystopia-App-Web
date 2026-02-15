// ============================================================================
// HEARTBOX COMPONENT
// ============================================================================
import '../../../styles/heartbox-react.css';


interface HeartBoxProps {
  heartCount: number;
}


export const HeartBox: React.FC<HeartBoxProps> = ({ heartCount }) => {
  return (
    <div className="heartbox-container">
      {Array.from({ length: heartCount }).map((_, i) => (
        <div
          key={`heart-${i}`}
          className="heartbox-heart"
          style={{
            animationDelay: `${i * 0.1}s`
          }}
        />
      ))}
    </div>
  );
};