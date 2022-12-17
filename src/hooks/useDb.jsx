import { useState, useEffect } from "react";
import axios from "axios";

/* const client = axios.create({
  baseURL: "http://localhost:3008/",
  proxy: false,
}); */

const useFiles = (filesPageNumber, searchTermFiles) => {
  const [filesLoading, setFilesLoading] = useState(true);
  const [filesError, setFilesError] = useState(false);
  const [files, setFiles] = useState([]);
  /*   const [albums, setAlbums] = useState([]); */
  const [hasMoreFiles, setHasMoreFiles] = useState(false);

  useEffect(() => {
    /* let ignore = false; */
    setFilesLoading(true);
    setFilesError(false);
    axios({
      method: "GET",
      url: "http://localhost:3008/allfiles/",
      params: { page: filesPageNumber, text: searchTermFiles },
    })
      .then(res => {
        setFiles(prevFiles => {
          return [...prevFiles, ...res.data.results];
        });
        setHasMoreFiles(res.data.results.length > 0);
        setFilesLoading(false);
      })
      .catch(e => {
        setFilesError(true);
      });
  }, [filesPageNumber, searchTermFiles]);

  return { filesLoading, files, setFiles, hasMoreFiles, filesError };
};

const useAlbums = (albumsPageNumber, searchTermAlbums) => {
  const [albumsLoading, setAlbumsLoading] = useState(true);
  const [albumsError, setAlbumsError] = useState(false);
  const [albums, setAlbums] = useState([]);
  /*   const [albums, setAlbums] = useState([]); */
  const [hasMoreAlbums, setHasMoreAlbums] = useState(false);

  useEffect(() => {
    /* let ignore = false; */
    setAlbumsLoading(true);
    setAlbumsError(false);
    axios({
      method: "GET",
      url: "http://localhost:3008/allalbums/",
      params: { page: albumsPageNumber, text: searchTermAlbums },
    })
      .then(res => {
        setAlbums(prevItems => {
          return [...prevItems, ...res.data.results];
        });
        setHasMoreAlbums(res.data.results.length > 0);
        setAlbumsLoading(false);
      })
      .catch(e => {
        setAlbumsError(true);
      });
  }, [albumsPageNumber, searchTermAlbums]);

  return { albumsLoading, albums, setAlbums, hasMoreAlbums, albumsError };
};

const useAlbumTracks = albumId => {
  const [tracks, setTracks] = useState([]);
  const [error, setError] = useState([]);

  useEffect(() => {
    if (albumId) {
      axios({
        method: "GET",
        url: "http://localhost:3008/albumtracks/",
        params: { pattern: albumId },
      })
        .then(res => {
          setTracks(res.data);
          /* }); */
        })
        .catch(e => {
          setError(e.message);
        });
    }
  }, [albumId]);
  return { tracks, setTracks };
};

export { useFiles, useAlbums, useAlbumTracks };
