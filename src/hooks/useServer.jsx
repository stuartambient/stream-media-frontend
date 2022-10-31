import { useState, useEffect } from 'react';
import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3008/',
  proxy: false,
});

export const useMetadata = url => {
  const [metadata, setMetadata] = useState();
  const [cover, setCover] = useState(undefined);

  /*  const config = {
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  }; */

  useEffect(() => {
    const getTrackMetadata = async () => {
      try {
        await client.get(url).then(res => {
          console.log(res.data.metadata);
          if (res.data.cover === 'no available image') {
            setCover(res.data.cover);
          } else {
            setCover(
              btoa(
                String.fromCharCode(...new Uint8Array(res.data.cover.data.data))
              )
            );
          }

          if (!res.data.metadata) {
            setMetadata(undefined);
          } else {
            setMetadata(res.data.metadata);
          }
        });
      } catch (e) {
        console.log(e);
      }
    };

    if (url) getTrackMetadata();
  }, [url]);
  return { metadata, cover };
};

export const usePlaylist = pageNumber => {
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
      params: { page: pageNumber },
      /* headers: {
        'Cache-Control': 'no-cache',
        'cache-control': 'no-cache',
        expires: '0',
        pragma: 'no-cache',
      }, */
    })
      .then(res => {
        setItems(prevItems => {
          return [...prevItems, ...res.data];
        });
        /* OR GREATER THEN 0 */
        setHasMore(res.data.length > 0);
        setLoading(false);
      })
      .catch(e => {
        setError(true);
      });
  }, [pageNumber]);

  return { loading, items, hasMore, error };
};
