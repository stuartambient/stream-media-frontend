import { useState, useEffect, useRef, forwardRef } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';

import { v4 as uuidv4 } from 'uuid';
import { useMetadata, usePlaylist } from './hooks/useServer';
import Row from './components/Row';
import InfiniteList from './Components/InfiniteList';
import './App.css';

function App() {
  const [request, setRequest] = useState(undefined);
  const [playlist, setPlaylist] = useState();
  const [url, setUrl] = useState();
  const [currentTrack, setCurrentTrack] = useState();
  const [playNext, setPlayNext] = useState(false);
  const [playPrev, setPlayPrev] = useState(false);
  const { metadata, cover } = useMetadata(url);

  const audio = new Audio();
  const audioRef = useRef(audio);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [pause, setPause] = useState(false);

  const client = axios.create({
    baseURL: 'http://localhost:3008/',
    proxy: false,
  });

  useEffect(() => {
    if (currentTime === duration) {
      setPlayNext(true);
    }
  }, [currentTime, duration]);

  useEffect(() => {
    const getPlaylist = async () => {
      try {
        await client.get('/alltracks').then(response => {
          setPlaylist(response);
        });
      } catch (e) {
        console.log(e);
      }
    };
    if (request === 'playlist') getPlaylist();
  }, [request]);

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

      const minutes = Math.floor(audioRef.current.duration / 60);
      const seconds = Math.floor(audioRef.current.duration - minutes * 60);
      const currentTime =
        str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
      setDuration(currentTime);
    };
    const str_pad_left = (string, pad, length) => {
      return (new Array(length + 1).join(pad) + string).slice(-length);
    };
  }, [audioRef.current]);

  useEffect(() => {
    audioRef.current.onvolumechange = () => console.log(audio.volume);
  }, [audioRef.current]);

  useEffect(() => {
    /*  audioRef.current.ontimeupdate = e => setCurrentTime(e.target.currentTime); */

    audioRef.current.ontimeupdate = () => {
      const minutes = Math.floor(audioRef.current.currentTime / 60);
      const seconds = Math.floor(audioRef.current.currentTime - minutes * 60);

      const currentTime =
        str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);

      setCurrentTime(currentTime);
    };
    const str_pad_left = (string, pad, length) => {
      return (new Array(length + 1).join(pad) + string).slice(-length);
    };
  }, [audioRef]);

  useEffect(() => {
    if (pause) audioRef.current.pause();
    if (!pause && url) audioRef.current.play();
  }, [pause, audioRef]);

  const handleListItem = async e => {
    /* console.log('target: ', e.target.id, 'index: ', e.target.attributes.val); */
    e.preventDefault();
    setCurrentTrack(+e.target.getAttribute('val'));
    setPlayNext(false);
    setPlayPrev(false);
    setPause(false);
    audioRef.current.src = `http://localhost:3008/tracks/${e.target.id}`;
    setUrl(`track-metadata/${e.target.id}`);
    audioRef.current.load();
  };

  const getKey = () => uuidv4();

  return (
    <div className="App">
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
          />
        ) : (
          <div className="results">Playlist</div>
        )}
      </div>
    </div>
  );
}

export default App;
