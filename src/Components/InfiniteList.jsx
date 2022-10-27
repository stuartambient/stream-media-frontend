import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { usePlaylist } from '../hooks/useServer';
import '../style/InfiniteList.css';

const InfiniteList = ({
  textSearch,
  onClick,
  currentTrack,
  playNext,
  playPrev,
}) => {
  const [nextTrack, setNextTrack] = useState();
  const [prevTrack, setPrevTrack] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const { loading, items, hasMore, error } = usePlaylist(
    pageNumber,
    textSearch
  );

  useEffect(() => {
    if (currentTrack >= 0) {
      const currentEl = document.getElementById(items[currentTrack]._id);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack >= 0) {
      setNextTrack(items[currentTrack + 1]._id);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (currentTrack >= 1) {
      /* console.log(currentTrack, items[currentTrack - 1]._id); */
      setPrevTrack(items[currentTrack - 1]._id);
    }
  }, [currentTrack]);

  useEffect(() => {
    if (playNext && nextTrack) {
      const clickNext = new Event('click', {
        bubbles: true,
        cancelable: false,
      });
      /* items[nextTrack].dispatchEvent(clickEvent); */
      const nt = document.getElementById(nextTrack);
      nt.dispatchEvent(clickNext);
    }
  }, [playNext, nextTrack]);

  useEffect(() => {
    if (playPrev && prevTrack) {
      const clickPrev = new Event('click', {
        bubbles: true,
        cancelable: false,
      });
      const pt = document.getElementById(prevTrack);
      pt.dispatchEvent(clickPrev);
    }
  }, [playPrev, prevTrack]);

  const getKey = () => uuidv4();

  const observer = useRef();
  const lastItemElement = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1);
          }
        },
        {
          root: document.querySelector('.results'),
          rootMargin: '0px 0px 10px 0px',
          threshold: 1.0,
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <div className="results">
        {loading && <div className="loader-flex">...Loading</div>}
        {!items.length && !loading ? (
          <div className="no-results">No results</div>
        ) : null}
        {items.map((item, index) => {
          if (items.length === index + 1) {
            return (
              <div
                className="item"
                id={item._id}
                key={getKey()}
                ref={lastItemElement}
              >
                <a href={item._id} id={item._id} val={index} onClick={onClick}>
                  index: {index} --- {item.file}
                </a>
              </div>
            );
          } else {
            return (
              <div className="item" id={`${item._id}---a-div`} key={getKey()}>
                <a href={item._id} onClick={onClick} val={index} id={item._id}>
                  index: {index} --- {item.file}
                </a>
              </div>
            );
          }
        })}
        {hasMore && (
          <>
            <div className="item itemloading">
              {loading && items.length ? (
                <div className="loading">Loading...</div>
              ) : null}
            </div>
            <div className="item itemerror">{error && 'Error'}</div>
          </>
        )}
      </div>
    </>
  );
};

export default InfiniteList;
