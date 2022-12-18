import { useState, useEffect, useRef, useReducer } from "react";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { FaForward, FaBackward, FaListUl, FaHeart } from "react-icons/fa";
import { Buffer } from "buffer";
import {
  convertDuration,
  convertDurationSeconds,
  convertCurrentTime,
  convertToSeconds,
} from "./hooks/useTime";
import InfiniteList from "./Components/InfiniteList";
import "./App.css";

function App() {
  const [request, setRequest] = useState(false);
  /* const [playlist, setPlaylist] = useState(); */
  /* const [url, setUrl] = useState(); */

  const [currentTrack, setCurrentTrack] = useState();
  const [active, setActive] = useState();
  const [playNext, setPlayNext] = useState(false);
  const [playPrev, setPlayPrev] = useState(false);
  const [artist, setArtist] = useState();
  const [title, setTitle] = useState();
  const [album, setAlbum] = useState();
  const [cover, setCover] = useState();
  /* const [metadata, setMetadata] = useState(); */
  /* const { metadata, cover } = useMetadata(url); */

  const audio = new Audio();
  const audioRef = useRef(audio);
  const [duration, setDuration] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [pause, setPause] = useState(false);
  const [progbarInc, setProgbarInc] = useState(0);
  /*  const [currentVolume, setCurrentVolume] = useState(1.0); */
  /* const [volumebarWidth, setVolumebarWidth] = useState(); */

  const seekbarOutline = useRef();
  const volumebarOutline = useRef();
  const volumeslider = useRef();

  const handleClick = e => {
    let id;

    e.target.id ? (id = e.target.id) : (id = e.target.parentNode.id);
    switch (id) {
      case "playlist":
        setRequest(() => !request);
        break;
      case "pauseplay":
        setPause(() => !pause);
        break;
      case "backward":
        if (playNext) setPlayNext(false);
        return setPlayPrev(true);
      case "forward":
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
    if (!pause) audioRef.current.play();
  }, [pause, audioRef /* , url */]);

  useEffect(() => {
    const outlineWidth = seekbarOutline.current.clientWidth;
    const convertForProgbar = convertToSeconds(duration, currentTime);
    /* console.log(convertForProgbar * outlineWidth); */
    setProgbarInc(convertForProgbar * outlineWidth);
  }, [duration, currentTime]);

  const handlePicture = buffer => {
    if (buffer === null || buffer.data === null)
      return setCover("not available");
    const bufferToString = Buffer.from(buffer.data).toString("base64");
    setCover(`data:${buffer.format};base64,${bufferToString}`);
  };

  const handleListItem = async (e, artist, title, album, picture = null) => {
    e.preventDefault();
    setArtist(artist);
    setTitle(title);
    setAlbum(album);
    handlePicture(picture);

    /* setCurrentVolume(audioRef.current.volume); */
    console.log("e-target: ", e.target);
    setCurrentTrack(+e.target.getAttribute("val"));

    /* audioRef.current.volume = currentVolume; */
    setActive(e.target.id);
    setPlayNext(false);
    setPlayPrev(false);
    setPause(false);
    audioRef.current.src = `http://localhost:3008/tracks/${e.target.id}`;
    /* setUrl(`track-metadata/${e.target.id}`); */
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

      volumeslider.current.setAttribute("style", `width:${widthRange}px`);
    } else {
      return;
    }
  };

  return (
    <div className="container">
      <div className="audio-player">
        <div className="title">{title ? <>{title.slice(0, 20)}</> : null}</div>

        {cover && cover !== "no available image" ? (
          <>
            <div className="image">
              <img src={cover} alt="" />
            </div>
          </>
        ) : (
          <p>{cover}</p>
        )}
        <div className="metadata">
          <>
            {artist ? (
              <div>
                <span className="label">Artist: </span>
                <span className="real-time">{artist.slice(0, 25)}</span>
              </div>
            ) : null}
            {album ? (
              <div>
                <span className="label">Album: </span>
                <span className="real-time">{album.slice(0, 25)}</span>
              </div>
            ) : null}
          </>
        </div>
        <div style={{ color: "white" }}>{audioRef.current.volume * 10}</div>
        <div
          className="volume-outline"
          onMouseMove={handleVolume}
          ref={volumebarOutline}
        >
          <div className="volumebar" ref={volumeslider}></div>
        </div>
        <div className="time">
          <span className="label">Duration: </span>
          <span className="real-time">{duration}</span>
          <span className="label">Elapsed: </span>
          <span className="real-time">{currentTime}</span>
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
        </div>
        <ul className="controls">
          <li className="btn" id="like" onClick={e => handleClick(e)}>
            <FaHeart id="like" className="icon" />
          </li>

          {pause ? (
            <li className="btn" id="pauseplay" onClick={e => handleClick(e)}>
              <GiPlayButton id="pauseplay" className="icon" />
            </li>
          ) : (
            <li className="btn" id="pauseplay" onClick={e => handleClick(e)}>
              <GiPauseButton id="pauseplay" className="icon" />
            </li>
          )}
          <li className="btn" id="backward" onClick={e => handleClick(e)}>
            <FaBackward id="backward" className="icon" />
          </li>

          <li className="btn" id="forward" onClick={e => handleClick(e)}>
            <FaForward id="forward" className="icon" />
          </li>
          <li className="btn" id="playlist" onClick={e => handleClick(e)}>
            <FaListUl id="playlist" className="icon" />
          </li>
        </ul>
      </div>
      {request ? (
        <InfiniteList
          onClick={handleListItem}
          currentTrack={currentTrack}
          playNext={playNext}
          playPrev={playPrev}
          active={active}
          setCurrentTrack={setCurrentTrack}
        />
      ) : null}
    </div>
  );
}

export default App;

/*

200


100px




*/
