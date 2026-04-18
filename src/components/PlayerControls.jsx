import { usePlayer } from '../context/PlayerContext';
import './PlayerControls.css';

export default function PlayerControls() {
  const { isPlaying, togglePlayPause, playNext, playPrev, currentSong } = usePlayer();

  if (!currentSong) return null;

  return (
    <div className="player-controls">
      <button className="control-btn prev-btn" onClick={playPrev} aria-label="Previous">
        ⏮
      </button>
      <button className="control-btn play-btn" onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
        {isPlaying ? '⏸' : '▶'}
      </button>
      <button className="control-btn next-btn" onClick={playNext} aria-label="Next">
        ⏭
      </button>
    </div>
  );
}