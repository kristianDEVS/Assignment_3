import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { songs } from '../data/songs';

const PlayerContext = createContext();

const STORAGE_KEYS = {
  CURRENT_SONG: 'music_player_current_song',
  PLAYING: 'music_player_is_playing',
  POSITION: 'music_player_position',
  VOLUME: 'music_player_volume'
};

export function PlayerProvider({ children }) {
  const [currentSongIndex, setCurrentSongIndex] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_SONG);
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [isPlaying, setIsPlaying] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PLAYING);
    return saved === 'true';
  });
  
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VOLUME);
    return saved ? parseFloat(saved) : 0.8;
  });

  const audioRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_SONG, currentSongIndex.toString());
  }, [currentSongIndex]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PLAYING, isPlaying.toString());
  }, [isPlaying]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const savedPosition = parseFloat(localStorage.getItem(STORAGE_KEYS.POSITION) || '0');
    if (audioRef.current && savedPosition > 0) {
      audioRef.current.currentTime = savedPosition;
    }
  }, []);

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    const handleEnded = () => {
      playNext();
    };

    const audio = audioRef.current;
    if (audio) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('ended', handleEnded);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('ended', handleEnded);
      }
    };
  }, []);

  useEffect(() => {
    const savePosition = () => {
      if (audioRef.current) {
        localStorage.setItem(STORAGE_KEYS.POSITION, audioRef.current.currentTime.toString());
      }
    };
    
    window.addEventListener('beforeunload', savePosition);
    return () => window.removeEventListener('beforeunload', savePosition);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSongIndex]);

  const playSong = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    } else {
      setCurrentSongIndex(0);
    }
  };

  const playPrev = () => {
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    } else {
      setCurrentSongIndex(songs.length - 1);
    }
  };

  const seek = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const changeVolume = (newVolume) => {
    setVolume(newVolume);
  };

  return (
    <PlayerContext.Provider value={{
      songs,
      currentSong,
      currentSongIndex,
      isPlaying,
      volume,
      duration,
      currentTime,
      audioRef,
      playSong,
      togglePlayPause,
      playNext,
      playPrev,
      seek,
      changeVolume
    }}>
      {children}
      <audio
        ref={audioRef}
        src={currentSong?.file}
        preload="metadata"
      />
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}