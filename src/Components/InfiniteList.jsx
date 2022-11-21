import {
  useState,
  useRef,
  useCallback,
  useEffect /* , useMemo */,
} from 'react';
/* import axios from 'axios'; */
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
  /* const [activeDiv, setActiveDiv] = useState(); */
  /*  const [loadNextPage, setLoadNextPage] = useState(false); */
  const [textSearch, setTextSearch] = useState('');
  const { loading, items, hasMore, error } = usePlaylist(pageNumber);

  const scrollRef = useRef();

  useEffect(() => {
    if (!items[currentTrack + 1]) return;
    if (currentTrack >= 0 && items) {
      setNextTrack(items[currentTrack + 1]._id);
    }

    if (currentTrack >= 1) {
      setPrevTrack(items[currentTrack - 1]._id);
    }
  }, [currentTrack, items]);

  useEffect(() => {
    if (playNext && nextTrack) {
      handleTrackChange(nextTrack);
    }
    if (playPrev && prevTrack) {
      handleTrackChange(prevTrack);
    }
  }, [playNext, nextTrack, playPrev, prevTrack]);

  const handleTextSearch = e => {
    setTextSearch(e.target.value);
  };

  const handleTrackChange = trackId => {
    const changeTrack = new Event('click', {
      bubbles: true,
      cancelable: false,
    });

    const toTrack = document.getElementById(trackId);
    toTrack.dispatchEvent(changeTrack);
  };
  /* Cannot update a component (`App`) while rendering a different component (`InfiniteList`). */

  const handleListScroll = e => {
    /* console.log(scrollRef.current); */
  };
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

  const scrollToView = useCallback(
    node => {
      if (!node) return;
      if (active && node && node.getAttribute('id') === `${active}--item-div`) {
        scrollRef.current = node;
        scrollRef.current.scrollIntoView();
      }
      /*       if (active) {
        console.log(activeRef);
      } */
    },
    [active, scrollRef]
  );

  return (
    <>
      <div className="textsearch">
        <input type="text" value={textSearch} onChange={handleTextSearch} />
      </div>
      <div className="results" onScroll={handleListScroll}>
        {/* {loading && <div className="item itemloading">...Loading</div>} */}
        {!items.length && !loading ? (
          <div className="no-results">No results</div>
        ) : null}
        {items.map((item, index) => {
          /*       console.log(trigger, index);
          /* if (items.length === index + 1) */
          return (
            <div
              key={getKey()}
              id={`${item._id}--item-div`}
              /* key={getKey()} */
              className={
                `${active}--item-div` === `${item._id}--item-div`
                  ? 'item active'
                  : 'item'
              }
              ref={items.length === index + 1 ? lastItemElement : scrollToView}
            >
              {item.artist && item.title && item.album ? (
                <a
                  href={item._id}
                  id={item._id}
                  val={index}
                  onClick={e => onClick(e, item.artist, item.title, item.album)}
                >
                  Artist: {item.artist}
                  <br></br>
                  Title: {item.title}
                  <br></br>
                  Album: {item.album}>
                </a>
              ) : (
                <a href={item._id} id={item._id} val={index} onClick={onClick}>
                  {item.file}
                </a>
              )}
            </div>
          );
        })}

        {loading && <div className="item itemloading">...Loading</div>}
      </div>
    </>
  );
};

export default InfiniteList;
