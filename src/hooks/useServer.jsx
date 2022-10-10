import { useState, useEffect } from 'react';
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3008/',
  proxy: false,
});

export const useSelectTrack = url => {
  const [response, setResponse] = useState();

  const config = {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  };

  useEffect(() => {
    const getTrack = async () => {
      try {
        await client
          .get(`/tracks/${url}`, {
            responseType: 'blob',
          })
          .then(res => {
            setResponse(res);
          });
      } catch (e) {
        console.log(e);
      }
    };

    if (url) getTrack();
  }, [url]);
  return response;
};

export const usePlaylist = (pageNumber, textSearch) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(false);
    axios({
      method: 'GET',
      url: 'http://localhost:3008/alltracks/',
      params: { page: pageNumber, text: textSearch },
    })
      .then(res => {
        setItems(prevItems => {
          return [...prevItems, ...res.data];
        });
        setHasMore(res.data.length >= 100);
        setLoading(false);
      })
      .catch(e => {
        setError(true);
      });
  }, [pageNumber, textSearch]);

  return { loading, items, setItems, hasMore, error };
};
