import './SongInfo.css';

export default function SongInfo({ title, artist }) {
  return (
    <div className="song-info">
      <div className="album-art">🎵</div>
      <h2 className="song-title">{title || 'No Song Selected'}</h2>
      <p className="song-artist">{artist || 'Select a song to play'}</p>
    </div>
  );
}