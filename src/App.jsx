import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [request, setRequest] = useState(undefined);
  const [playlist, setPlaylist] = useState([]);

  const client = axios.create({
    baseURL: 'http://localhost:3008/',
    proxy: false,
  });

  const audioElement = new Audio('http://localhost:3008/audio');

  useEffect(() => {
    if (playlist.data) {
      console.log(playlist.data);
    }
  }, [playlist]);

  useEffect(() => {
    if (request === 'play') {
      audioElement.play();
    } else if (request === 'playlist') {
      client.get('/alltracks').then(response => {
        setPlaylist(response);
      });
    } else {
      console.log(request);
    }
  }, [request]);

  const handleClick = e => {
    setRequest(e);
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
            <span>LYRICS</span>
          </div>
        </div>
        <div className="iphone neu">
          {playlist.length > 0 ? (
            <ul>
              {playlist.data.map(x => {
                <li>{x}</li>;
              })}
            </ul>
          ) : (
            <div>loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
