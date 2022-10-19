import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { usePlaylist } from '../hooks/useServer';
import '../style/InfiniteList.css';

const InfiniteList = ({ textSearch, onClick }) => {
  const [pageNumber, setPageNumber] = useState(1);
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
              <div className="item" key={getKey()} ref={lastItemElement}>
                <a href={item._id} id={item._id} onClick={onClick}>
                  {item.file}
                </a>
              </div>
            );
          } else {
            return (
              <div className="item" key={getKey()}>
                <a href={item._id} onClick={onClick} id={item._id}>
                  {item.file}
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
