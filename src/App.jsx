import { useState, useEffect, useRef, forwardRef } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';
import * as mmb from 'music-metadata-browser';
import { v4 as uuidv4 } from 'uuid';
import { useSelectTrack, usePlaylist } from './hooks/useServer';
import Row from './components/Row';
import InfiniteList from './Components/InfiniteList';
import './App.css';

function App() {
  const [request, setRequest] = useState(undefined);
  const [playlist, setPlaylist] = useState();
  /*   const [url, setUrl] = useState(); */
  /* const response = useSelectTrack(url); */

  const audio = new Audio();
  const audioRef = useRef(audio);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const client = axios.create({
    baseURL: 'http://localhost:3008/',
    proxy: false,
  });

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
      case 'v-up':
        if (audio.volume >= 1.0) return;
        return (audio.volume += 0.1);
      case 'v-down':
        if (audio.volumne <= 0) return;
        return (audio.volume -= 0.1);
      default:
        return;
    }
  };

  useEffect(() => {
    audioRef.current.onloadedmetadata = () => {
      audioRef.current.play();
      /* setDuration(audioRef.current.duration); */
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

  const handleListItem = e => {
    console.log('target: ', e.target.id);
    e.preventDefault();
    audioRef.current.src = `http://localhost:3008/tracks/${e.target.id}`;
    audioRef.current.load();
  };

  const getKey = () => uuidv4();

  return (
    <div className="App">
      <div className="container">
        <div>
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
            <button
              className="btn lg neu"
              id="pause"
              onClick={e => handleClick(e.target.id)}
            >
              <i
                className="fa-solid fa-pause"
                href="#"
                id="pause"
                onClick={e => handleClick(e.target.id)}
              ></i>
            </button>
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
              id="play"
              onClick={e => handleClick(e.target.id)}
            >
              <i
                className="fas fa-play"
                href="#"
                id="play"
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
        </div>
        {request === 'playlist' ? (
          <InfiniteList onClick={handleListItem} />
        ) : (
          <div style={{ height: '30px', width: '100%' }}>Playlist</div>
        )}
      </div>
    </div>
  );
}

export default App;
