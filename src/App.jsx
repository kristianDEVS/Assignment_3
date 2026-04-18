import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import SongList from './pages/SongList';
import Player from './pages/Player';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <PlayerProvider>
        <Routes>
          <Route path="/" element={<SongList />} />
          <Route path="/player" element={<Player />} />
        </Routes>
      </PlayerProvider>
    </BrowserRouter>
  );
}

export default App;