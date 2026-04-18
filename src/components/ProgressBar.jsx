import { usePlayer } from '../context/PlayerContext';
import './ProgressBar.css';

function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function ProgressBar() {
  const { currentTime, duration, seek, currentSong } = usePlayer();

  if (!currentSong) return null;

  const progress = duration ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e) => {
    const newTime = (e.target.value / 100) * duration;
    seek(newTime);
  };

  return (
    <div className="progress-container">
      <div className="time-display">
        <span className="current-time">{formatTime(currentTime)}</span>
        <span className="duration">{formatTime(duration)}</span>
      </div>
      <input
        type="range"
        className="progress-bar"
        min="0"
        max="100"
        value={progress}
        onChange={handleSeek}
        aria-label="Seek"
      />
    </div>
  );
}