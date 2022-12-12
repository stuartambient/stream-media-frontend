import { useState, useEffect } from "react";
import axios from "axios";

/* const client = axios.create({
  baseURL: "http://localhost:3008/",
  proxy: false,
}); */

export const usePlaylist = (type, pageNumber, searchText) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [files, setFiles] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    /* let ignore = false; */
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: "http://localhost:3008/alltracks/",
      params: { page: pageNumber, text: searchText, type: type },
    })
      .then(res => {
        setFiles(prevItems => {
          return [...prevItems, ...res.data.results];
        });
        setHasMore(res.data.results.length > 0);
        setLoading(false);
      })
      .catch(e => {
        setError(true);
      });
  }, [pageNumber, searchText, type]);

  return { loading, files, setFiles, albums, setAlbums, hasMore, error };
};
