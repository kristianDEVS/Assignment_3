import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../context/PlayerContext';
import Navbar from '../components/Navbar';
import './SongList.css';

export default function SongList() {
  const { songs, playSong, currentSongIndex, isPlaying } = usePlayer();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const touchStartY = useRef(null);

  const songsPerPage = 10;

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const start = currentPage * songsPerPage;
  const end = start + songsPerPage;
  const currentSongs = filteredSongs.slice(start, end);

  const handlePlaySong = (index) => {
    const actualIndex = songs.findIndex(s => s.id === filteredSongs[start + index].id);
    playSong(actualIndex);
    navigate('/player');
  };

  const handleSwipe = (direction) => {
    if (direction === 'up' && currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'down' && currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="song-list-page">
      <Navbar title="Trini Tunes" />
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search songs..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>
      <div 
        className="song-list-container"
        onTouchStart={(e) => {
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const touchEndY = e.changedTouches[0].clientY;
          const diff = touchStartY.current - touchEndY;
          if (Math.abs(diff) > 50) {
            handleSwipe(diff > 0 ? 'up' : 'down');
          }
        }}
      >
        <ul className="song-list">
          {currentSongs.map((song, idx) => {
            const actualIndex = songs.findIndex(s => s.id === song.id);
            const isCurrentSong = actualIndex === currentSongIndex;
            return (
              <li
                key={song.id}
                className={`song-item ${isCurrentSong ? 'playing' : ''}`}
                onClick={() => handlePlaySong(idx)}
              >
                <div className="song-item-content">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                </div>
                {isCurrentSong && isPlaying && <span className="playing-indicator">▶</span>}
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>{currentPage + 1} / {totalPages}</span>
        <button 
          onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}