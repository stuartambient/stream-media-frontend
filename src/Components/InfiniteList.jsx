import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { usePlaylist } from '../hooks/useServer';
import '../style/InfiniteList.css';

const InfiniteList = ({
  onClick,
  currentTrack,
  playNext,
  playPrev,
  active,
}) => {
  const [nextTrack, setNextTrack] = useState(undefined);
  const [prevTrack, setPrevTrack] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [activeDiv, setActiveDiv] = useState();
  const { loading, items, hasMore, error } = usePlaylist(pageNumber);

  const trackQueue = useMemo(() => {
    if (currentTrack >= 0 && items) {
      setNextTrack(items[currentTrack + 1]._id);
    }

    if (currentTrack >= 1) {
      setPrevTrack(items[currentTrack - 1]._id);
    }
  }, [currentTrack]);

  const handleTrackChange = trackId => {
    const changeTrack = new Event('click', {
      bubbles: true,
      cancelable: false,
    });

    const toTrack = document.getElementById(trackId);
    toTrack.dispatchEvent(changeTrack);
  };

  const useQueue = useMemo(() => {
    if (playNext && nextTrack) {
      handleTrackChange(nextTrack);
    }
    if (playPrev && prevTrack) {
      handleTrackChange(prevTrack);
    }
  }, [playNext, nextTrack, playPrev, prevTrack]);

  const getKey = () => uuidv4();

  const observer = useRef();
  const lastItemElement = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            /* console.log('entries: ', entries[0].isIntersecting, hasMore); */
            setPageNumber(prevPageNumber => prevPageNumber + 1);
          }
        },
        {
          root: document.querySelector('.results'),
          rootMargin: '0px',
          threshold: 1.0,
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const trigger = items.length - 2;

  return (
    <>
      <div className="results">
        {/* {loading && <div className="item itemloading">...Loading</div>} */}
        {!items.length && !loading ? (
          <div className="no-results">No results</div>
        ) : null}
        {items.map((item, index) => {
          /*       console.log(trigger, index);
          /* if (items.length === index + 1) */
          return (
            <div
              id={`${item._id}--item-div`}
              key={getKey()}
              className={
                /* activeDiv === `${item._id}--item-div`
                  ? 'item active'
                  : 'item' */ `${active}--item-div` === `${item._id}--item-div`
                  ? 'item active'
                  : 'item'
              }
              /* ref={items.length === index + 1 ? lastItemElement : null} */
              ref={trigger ? lastItemElement : null}
            >
              <a href={item._id} id={item._id} val={index} onClick={onClick}>
                index: {index} --- {item.file}
              </a>
            </div>
          );
        })}

        {loading && <div className="item itemloading">...Loading</div>}
      </div>
    </>
  );
};

export default InfiniteList;
