import {
  useState,
  useRef,
  useCallback,
  useEffect /* , useMemo */,
} from "react";
/* import axios from 'axios'; */
import { GiMagnifyingGlass } from "react-icons/gi";
import { v4 as uuidv4 } from "uuid";
import { usePlaylist } from "../hooks/useServer";
import Switch from "./Switch";
import "../style/InfiniteList.css";

const InfiniteList = ({
  onClick,
  currentTrack,
  setCurrentTrack,
  playNext,
  playPrev,
  active,
}) => {
  const [nextTrack, setNextTrack] = useState(undefined);
  const [prevTrack, setPrevTrack] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [type, setType] = useState("files");
  /* const [activeDiv, setActiveDiv] = useState(); */
  /*  const [loadNextPage, setLoadNextPage] = useState(false); */
  const [textSearch, setTextSearch] = useState("");
  const { loading, files, setFiles, albums, setAlbums, hasMore, error } =
    usePlaylist(type, pageNumber, textSearch);

  const scrollRef = useRef();

  useEffect(() => {
    if (!files[currentTrack + 1]) return;
    if (currentTrack >= 0 && files) {
      setNextTrack(files[currentTrack + 1].afid);
    }

    if (currentTrack >= 1) {
      setPrevTrack(files[currentTrack - 1].afid);
    }
  }, [currentTrack, files]);

  useEffect(() => {
    if (playNext && nextTrack) {
      handleTrackChange(nextTrack);
    }
    if (playPrev && prevTrack) {
      handleTrackChange(prevTrack);
    }
  }, [playNext, nextTrack, playPrev, prevTrack]);

  const handleStateChange = () => {
    setFiles([]);
    setCurrentTrack(undefined);
    setNextTrack(undefined);
    setPrevTrack(undefined);
    setPageNumber(0);
  };

  const handleTextSearch = e => {
    /* setTextSearch(e.target.value); */
    e.preventDefault();
    handleStateChange();
    setTextSearch(e.currentTarget.textsearch.value);
  };

  const handleTrackChange = trackId => {
    const changeTrack = new Event("click", {
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
          root: document.querySelector(".results"),
          rootMargin: "0px",
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
      if (active && node && node.getAttribute("id") === `${active}--item-div`) {
        scrollRef.current = node;
        /* scrollRef.current.scrollIntoView(); */
      }
      /*       if (active) {
        console.log(activeRef);
      } */
    },
    [active, scrollRef]
  );

  const byFiles = files.map((item, index) => {
    return (
      <div
        key={getKey()}
        id={`${item.afid}--item-div`}
        className={
          `${active}--item-div` === `${item.afid}--item-div`
            ? "item active"
            : "item"
        }
        ref={files.length === index + 1 ? lastItemElement : scrollToView}
      >
        <a
          href={item.afid}
          id={item.afid}
          val={index}
          onClick={e =>
            onClick(e, item.artist, item.title, item.album, item.picture)
          }
        >
          Artist: {item.artist ? item.artist : "not available"}
          <br></br>
          Title: {item.title ? item.title : "not available"}
          <br></br>
          Album: {item.album ? item.album : "not available"}>
        </a>
      </div>
    );
  });

  const byAlbums = albums.map((item, index) => {
    return (
      <div
        key={getKey()}
        id={item._id}
        className="item"
        ref={albums.length === index + 1 ? lastItemElement : scrollToView}
      >
        <a href={item.fullpath} id={item._id} val={index}>
          {item.foldername}
        </a>
      </div>
    );
  });

  return (
    <>
      <div className="search">
        <Switch type={type} setType={setType} />
        <div className="form">
          <form onSubmit={handleTextSearch}>
            <div className="formelements">
              <input type="text" className="textsearch" id="textsearch" />

              <button type="text" className="submitbtn">
                <div className="icon">
                  <GiMagnifyingGlass />
                </div>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="results" onScroll={handleListScroll}>
        {!files.length && !loading ? (
          <div className="noresults">No results</div>
        ) : null}
        {type === "files" ? byFiles : byAlbums}
        {loading && <div className="item itemloading">...Loading</div>}
      </div>
    </>
  );
};

export default InfiniteList;
