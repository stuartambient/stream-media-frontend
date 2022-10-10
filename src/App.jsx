import { useState, useEffect, useRef, forwardRef } from 'react';
import axios from 'axios';
import { FixedSizeList as List } from 'react-window';
import * as mmb from 'music-metadata-browser';
import { v4 as uuidv4 } from 'uuid';
import { useSelectTrack, usePlaylist } from './hooks/useServer';
import Row from './components/Row';
import './App.css';

function App() {
  const [request, setRequest] = useState(undefined);
  const [playlist, setPlaylist] = useState();
  const [url, setUrl] = useState();
  const response = useSelectTrack(url);
  const audio = new Audio();

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
      case 'default':
        console.log(id);
    }
  };

  useEffect(() => {
    if (response) {
      const file = URL.createObjectURL(response.data);
      audio.src = file;
      audio.play();
    }
  }, [response]);

  const handleListItem = e => {
    e.preventDefault();
    setUrl(e.target.id);
  };

  const outerElementType = forwardRef((props, ref) => (
    <div ref={ref} onClick={handleListItem} {...props} />
  ));

  const getKey = () => uuidv4();

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
              itemKey={getKey}
              outerElementType={outerElementType}
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
