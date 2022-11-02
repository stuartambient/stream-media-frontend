import { useState, useEffect, useRef } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useMetadata } from './hooks/useServer';
import { useDuration, useCurrentTime } from './hooks/useTime';
import InfiniteList from './Components/InfiniteList';
import './App.css';

function App() {
  const [request, setRequest] = useState(undefined);
  /* const [playlist, setPlaylist] = useState(); */
  const [url, setUrl] = useState();
  const [currentTrack, setCurrentTrack] = useState();
  const [active, setActive] = useState();
  const [playNext, setPlayNext] = useState(false);
  const [playPrev, setPlayPrev] = useState(false);
  const { metadata, cover } = useMetadata(url);

  const audio = new Audio();
  const audioRef = useRef(audio);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (currentTime === duration) {
      setPlayNext(true);
    }
  }, [currentTime, duration]);

  const handleClick = id => {
    switch (id) {
      case 'playlist':
        setRequest('playlist');
      case 'pauseplay':
        setPause(() => !pause);
      case 'v-up':
        if (audioRef.current.volume >= 1.0) return;
        return (audioRef.current.volume += 0.1);
      case 'v-down':
        if (audioRef.current.volume <= 0) return;
        return (audioRef.current.volume -= 0.1);
      case 'backward':
        setPlayPrev(true);
      case 'forward':
        setPlayNext(true);
      default:
        return;
    }
  };

  useEffect(() => {
    audioRef.current.onloadedmetadata = async () => {
      audioRef.current.play();
      setDuration(useDuration(audioRef.current));
    };
  }, [audioRef.current]);

  useEffect(() => {
    audioRef.current.ontimeupdate = () => {
      setCurrentTime(useCurrentTime(audioRef.current));
    };
  }, [audioRef]);

  useEffect(() => {
    if (pause) audioRef.current.pause();
    if (!pause && url) audioRef.current.play();
  }, [pause, audioRef]);

  const handleListItem = async e => {
    e.preventDefault();
    setCurrentTrack(+e.target.getAttribute('val'));
    setActive(e.target.id);
    setPlayNext(false);
    setPlayPrev(false);
    setPause(false);
    audioRef.current.src = `http://localhost:3008/tracks/${e.target.id}`;
    setUrl(`track-metadata/${e.target.id}`);
    audioRef.current.load();
  };

  const getKey = () => uuidv4();

  return (
    <div className="container">
      <div className="audio-player">
        <div className="audio-duration">Duration: {duration}</div>
        <div className="time-elapsed">Elapsed: {currentTime}</div>
        <div
          id="v-up"
          onClick={e => handleClick(e.target.id)}
          style={{ cursor: 'pointer' }}
        >
          Volume +++
        </div>
        <div
          id="v-down"
          onClick={e => handleClick(e.target.id)}
          style={{ cursor: 'pointer' }}
        >
          Volume ---
        </div>
        <div className="buttons">
          <button
            className="btn lg neu"
            id="like"
            onClick={e => handleClick(e.target.id)}
          >
            <i
              className="fas fa-heart"
              href="#"
              id="like"
              onClick={e => handleClick(e.target.id)}
            ></i>
          </button>

          {pause ? (
            <button
              className="btn lg neu"
              id="pauseplay"
              onClick={e => handleClick(e.target.id)}
            >
              <i
                className="fas fa-play"
                href="#"
                id="pauseplay"
                onClick={e => handleClick(e.target.id)}
              ></i>
            </button>
          ) : (
            <button
              className="btn lg neu"
              id="pauseplay"
              onClick={e => handleClick(e.target.id)}
            >
              <i
                className="fa-solid fa-pause"
                href="#"
                id="pauseplay"
                onClick={e => handleClick(e.target.id)}
              ></i>
            </button>
          )}
          <button
            className="btn lg neu"
            id="backward"
            onClick={e => handleClick(e.target.id)}
          >
            <i
              className="fas fa-backward"
              href="#"
              id="backward"
              onClick={e => handleClick(e.target.id)}
            ></i>
          </button>

          <button
            className="btn lg neu"
            id="forward"
            onClick={e => handleClick(e.target.id)}
          >
            <i
              className="fas fa-forward"
              id="forward"
              onClick={e => handleClick(e.target.id)}
            ></i>
          </button>
          <button
            className="btn lg neu"
            id="playlist"
            onClick={e => handleClick(e.target.id)}
          >
            <i
              className="fa-solid fa-list"
              id="playlist"
              onClick={e => handleClick(e.target.id)}
            ></i>
          </button>
        </div>
        {metadata ? (
          <>
            <div>Artist: {metadata.common.artist}</div>
            <div>Album: {metadata.common.album}</div>
            <div>Title: {metadata.common.title}</div>
          </>
        ) : null}
        {cover && cover !== 'no available image' ? (
          <>
            <div>
              <img
                src={`data:image/png;base64,${cover}`}
                alt=""
                style={{ width: '200px', height: '200px' }}
              />
            </div>
          </>
        ) : (
          <p>{cover}</p>
        )}
      </div>
      {request === 'playlist' ? (
        <InfiniteList
          onClick={handleListItem}
          currentTrack={currentTrack}
          playNext={playNext}
          playPrev={playPrev}
          active={active}
        />
      ) : null}
    </div>
  );
}

export default App;
