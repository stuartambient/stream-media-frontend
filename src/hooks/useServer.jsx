import { useState, useEffect } from "react";
import axios from "axios";

/* const client = axios.create({
  baseURL: "http://localhost:3008/",
  proxy: false,
}); */

export const usePlaylist = (type, pageNumber, searchText) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
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
        setItems(prevItems => {
          return [...prevItems, ...res.data.results];
        });
        setHasMore(res.data.results.length > 0);
        setLoading(false);
      })
      .catch(e => {
        setError(true);
      });
  }, [pageNumber, searchText, type]);

  return { loading, items, setItems, hasMore, error };
};
