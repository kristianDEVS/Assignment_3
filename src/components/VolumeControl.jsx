import { usePlayer } from '../context/PlayerContext';
import './VolumeControl.css';

export default function VolumeControl() {
  const { volume, changeVolume } = usePlayer();

  return (
    <div className="volume-control">
      <span className="volume-icon">{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
      <input
        type="range"
        className="volume-slider"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => changeVolume(parseFloat(e.target.value))}
        aria-label="Volume"
      />
    </div>
  );
}