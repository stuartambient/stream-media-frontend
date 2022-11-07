import { useState, useEffect } from 'react';
import axios from 'axios';
import { Buffer } from 'buffer';

const client = axios.create({
  baseURL: 'http://localhost:3008/',
  proxy: false,
});

export const useMetadata = url => {
  const [metadata, setMetadata] = useState();
  const [cover, setCover] = useState(undefined);

  useEffect(() => {
    const getTrackMetadata = async () => {
      try {
        await client.get(url).then(res => {
          if (res.data.cover === 'no available image') {
            setCover(res.data.cover);
          } else {
            const format = res.data.cover.format;
            const buffer = Buffer.from(res.data.cover.data.data).toString(
              'base64'
            );
            setCover(`data:${format};base64,${buffer}`);
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
    let ignore = false;
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
        if (!ignore) {
          setItems(prevItems => {
            return [...prevItems, ...res.data];
          });
          /* OR GREATER THEN 0 */
          setHasMore(res.data.length > 0);
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
