import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { usePlaylist } from '../hooks/useServer';
import '../style/InfiniteList.css';

const InfiniteList = ({ textSearch, onClick }) => {
  const [pageNumber, setPageNumber] = useState(0);
  const { loading, items, hasMore, error } = usePlaylist(
    pageNumber,
    textSearch
  );

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
        { root: document.querySelector('.results') }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <div
        className="results"
        style={{
          overflowY: 'scroll',
          overflowX: 'hidden',
          width: '100%',
          height: '90%',
        }}
      >
        {loading && <div className="loader-flex">...Loading</div>}
        {!items.length && !loading ? (
          <div className="no-results">No results</div>
        ) : null}
        {items.map((item, index) => {
          if (items.length === index + 1) {
            return (
              <div
                className="item"
                key={getKey()}
                ref={lastItemElement}
                item={item.file}
              >
                <a href={item._id} id={item._id} onClick={onClick}>
                  {item.file}
                </a>
                <p>Album: {item.album} </p>
                <p>Artist: {item.artist}</p>
                <p>Title: {item.title}</p>
                {item.genre && item.genre.length ? (
                  item.genre.map((g, i) => {
                    return <p key={getKey()}>{g}</p>;
                  })
                ) : (
                  <p>null</p>
                )}
              </div>
            );
          } else {
            return (
              <div className="item" key={getKey()} item={item.file}>
                <a href={item._id} onClick={onClick} id={item._id}>
                  {item.file}
                </a>
                <p>Album: {item.album}</p>
                <p>Artist: {item.artist}</p>
                <p>Title: {item.title}</p>
                {item.genre && item.genre.length ? (
                  item.genre.map((g, i) => {
                    return <p key={getKey()}>{g}</p>;
                  })
                ) : (
                  <p>null</p>
                )}
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
