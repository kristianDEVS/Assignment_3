import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import SongInfo from '../components/SongInfo';
import PlayerControls from '../components/PlayerControls';
import ProgressBar from '../components/ProgressBar';
import VolumeControl from '../components/VolumeControl';
import './Player.css';

export default function Player() {
  const { currentSong, playNext, playPrev } = usePlayer();
  const navigate = useNavigate();
  const [touchStartX, setTouchStartX] = useState(null);

  if (!currentSong) {
    return (
      <div className="player-page">
        <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
        <div className="no-song">
          <p>No song selected</p>
          <button onClick={() => navigate('/')}>Go to Library</button>
        </div>
      </div>
    );
  }

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        playNext();
      } else {
        playPrev();
      }
    }
    setTouchStartX(null);
  };

  return (
    <div className="player-page">
      <button className="back-btn" onClick={() => navigate('/')}>← Back</button>
      <div 
        className="player-content"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onClick={() => {}}
      >
        <SongInfo title={currentSong.title} artist={currentSong.artist} />
        <ProgressBar />
        <PlayerControls />
        <VolumeControl />
      </div>
    </div>
  );
}