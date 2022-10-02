import { useState, useEffect, useRef, forwardRef } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';
import { useServerStream } from './hooks/useServerStream';
import './App.css';

function App() {
  const [request, setRequest] = useState(undefined);
  const [playlist, setPlaylist] = useState();
  const [audioElement, setAudioElement] = useState('');

  const client = axios.create({
    baseURL: 'http://localhost:3008/',
    proxy: false,
  });

  /*   const audioElement = new Audio('http://localhost:3008/audio', {
    preload: false,
  }); */

  /*   audioElement.autoplay === false;
  const audioRef = useRef(audioElement);  */

  useEffect(() => {
    const getPlaylist = async () => {
      console.log('pl');
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
    console.log(id);
    switch (id) {
      case 'playlist':
        setRequest('playlist');
      case 'default':
        console.log(id);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="iphone neu">
          <div className="title">
            <div>
              <i className="fas fa-chevron-left"></i>
            </div>
            <div>NOW PLAYING</div>
            <div>
              <i className="fas fa-ellipsis-v"></i>
            </div>
          </div>
          <div className="album-cover">
            <div className="album-overlay"></div>
            <img
              src="https://images-na.ssl-images-amazon.com/images/I/810GyyWObmL._SL1400_.jpg"
              alt=""
            />
            <h2 className="song-title">Redbone</h2>
            <h3 className="artist-title">Childish Gambino</h3>
          </div>
          <div className="buttons">
            <button
              className="btn lg red neu"
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
              className="btn lg red neu"
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
          <div className="track neu">
            <div></div>
          </div>
          <div className="lyrics">
            <i className="fas fa-angle-up"></i>
            <span>Lyrux</span>
          </div>
        </div>
        <div>
          {playlist && playlist.data ? (
            <List
              className="List"
              height={500}
              itemCount={playlist.data.length}
              itemSize={60}
              width={320}
              itemData={playlist.data}
            >
              {Row}
            </List>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;

const Row = ({ data, index, style }) => {
  const item = data[index];
  const [track, setTrack] = useState();

  const [url, setUrl] = useState();
  const response = useServerStream(url);

  useEffect(() => {
    if (response) {
      const t = new Audio(`http://localhost:3008/tracks/${url}`);
      console.log(t.controls);
      t.play();
      setTimeout(() => t.pause(), 5000);
    }
  }, [response]);

  /*   useEffect(() => {
    if (track) {
      console.log(url);
    }
  }); */

  const handleRequest = e => {
    e.preventDefault();
    setUrl(e.target.id);
  };
  return (
    <a
      href={data[index].file}
      id={data[index]._id}
      style={style}
      key={data[index]._id}
      className="file-item"
      onClick={e => handleRequest(e)}
    >
      {data[index].artist}🔥{data[index].album}🔥{data[index].title}
    </a>
  );
};
