import { useState, useEffect } from 'react';
import axios from 'axios';

export const useServerStream = url => {
  const [response, setResponse] = useState();

  const client = axios.create({
    baseURL: 'http://localhost:3008/',
    proxy: false,
  });

  useEffect(() => {
    const getTrack = async () => {
      try {
        await client.get(`/tracks/${url}`).then(res => {
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
