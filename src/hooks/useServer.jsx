import { useState, useEffect } from "react";
import axios from "axios";

/* const client = axios.create({
  baseURL: "http://localhost:3008/",
  proxy: false,
}); */

export const usePlaylist = pageNumber => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    setError(false);
    axios({
      method: "GET",
      url: "http://localhost:3008/alltracks/",
      params: { page: pageNumber },
    })
      .then(res => {
        if (!ignore) {
          console.log(res.data.results);
          setItems(prevItems => {
            return [...prevItems, ...res.data.results];
          });
          setHasMore(res.data.results.length > 0);
          setLoading(false);
        }
      })
      .catch(e => {
        setError(true);
      });
    return () => {
      ignore = true;
    };
  }, [pageNumber]);

  return { loading, items, hasMore, error };
};
