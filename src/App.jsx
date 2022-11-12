import { useState, useEffect, useRef } from 'react';

import { v4 as uuidv4 } from 'uuid';
import { useMetadata } from './hooks/useServer';
import {
  convertDuration,
  convertDurationSeconds,
  convertCurrentTime,
  convertToSeconds,
} from './hooks/useTime';
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
  const [duration, setDuration] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [pause, setPause] = useState(false);
  const [progbarInc, setProgbarInc] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(1.0);
  const [volumebarWidth, setVolumebarWidth] = useState();

  const seekbarOutline = useRef();
  const volumebarOutline = useRef();
  const volumeslider = useRef();

  const handleClick = id => {
    console.log('id: ', id);
    switch (id) {
      case 'playlist':
        setRequest('playlist');
        break;
      case 'pauseplay':
        setPause(() => !pause);
        break;
      case 'backward':
        if (playNext) setPlayNext(false);
        return setPlayPrev(true);
      case 'forward':
        if (playPrev) setPlayPrev(false);
        return setPlayNext(true);
      default:
        return;
    }
  };

  useEffect(() => {
    audioRef.current.onloadedmetadata = async () => {
      audioRef.current.play();

      setDuration(convertDuration(audioRef.current));
    };
  });

  useEffect(() => {
    audioRef.current.ontimeupdate = () => {
      setCurrentTime(convertCurrentTime(audioRef.current));
    };
  }, [audioRef]);

  useEffect(() => {
    audioRef.current.onended = () => {
      setPlayNext(true);
    };
  }, [audioRef]);

  useEffect(() => {
    if (pause) audioRef.current.pause();
    if (!pause && url) audioRef.current.play();
  }, [pause, audioRef, url]);

  useEffect(() => {
    const outlineWidth = seekbarOutline.current.clientWidth;
    const convertForProgbar = convertToSeconds(duration, currentTime);
    /* console.log(convertForProgbar * outlineWidth); */
    setProgbarInc(convertForProgbar * outlineWidth);
  }, [duration, currentTime]);

  const handleListItem = async e => {
    e.preventDefault();
    setCurrentVolume(audioRef.current.volume);
    setCurrentTrack(+e.target.getAttribute('val'));
    audioRef.current.volume = currentVolume;
    setActive(e.target.id);
    setPlayNext(false);
    setPlayPrev(false);
    setPause(false);
    audioRef.current.src = `http://localhost:3008/tracks/${e.target.id}`;
    setUrl(`track-metadata/${e.target.id}`);
    audioRef.current.load();
  };

  const handleSeekTime = e => {
    if (e.buttons !== 1) console.log(e.buttons !== 1);
    const totaltime = convertDurationSeconds(duration);
    /* const seekbar = document.querySelector('.seekbar'); */
    const seekbarOutlineWidth = seekbarOutline.current.clientWidth;
    const seekPoint =
      e.clientX - seekbarOutline.current.getBoundingClientRect().left;

    audioRef.current.currentTime =
      (totaltime / seekbarOutlineWidth) * seekPoint;
  };

  const handleVolume = e => {
    if (e.buttons !== 1) return;

    const outlineRect = volumebarOutline.current.getBoundingClientRect();
    const outlineWidth = Math.round(outlineRect.width);
    const widthRange = e.clientX - volumebarOutline.current.offsetLeft;

    if (widthRange > 0 || widthRange < outlineWidth) {
      const mark = widthRange / outlineWidth;
      audioRef.current.volume = Math.round(mark * 10) / 10;

      volumeslider.current.setAttribute('style', `width:${widthRange}px`);
    } else {
      return;
    }
  };

  return (
    <div className="container">
      <div className="audio-player">
        {cover && cover !== 'no available image' ? (
          <>
            <div>
              <img
                src={cover}
                alt=""
                style={{ width: '250px', height: '250px' }}
              />
            </div>
          </>
        ) : (
          <p>{cover}</p>
        )}
        <div className="track-info">
          Duration: {duration} Elapsed: {currentTime}
          <div className="metadata">
            {metadata ? (
              <>
                <div>Artist: {metadata.common.artist}</div>
                <div>Album: {metadata.common.album}</div>
                <div>Title: {metadata.common.title}</div>
              </>
            ) : null}
          </div>
        </div>
        <div
          className="volume-outline"
          onMouseMove={handleVolume}
          ref={volumebarOutline}
        >
          <div className="volumebar" ref={volumeslider}></div>
        </div>

        <div
          className="seekbar-outline"
          ref={seekbarOutline}
          onClick={handleSeekTime}
        >
          <div
            className="seekbar"
            style={{ width: progbarInc ? `${progbarInc}px` : null }}
          ></div>
          {/*  <input
            type="range"
            min="0"
            max={audioRef.current.duration}
            value={audioRef.current.currentTime}
          ></input> */}
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
