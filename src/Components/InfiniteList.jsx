import { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { usePlaylist } from '../hooks/useServer';

const InfiniteList = ({ textSearch }) => {
  const { loading, items, setItems, hasMore, error } = usePlaylist(
    pageNumber,
    textSearch
  );

  useEffect(() => {
    setItems([]);
  }, [textSearch, setItems]);

  const observer = useRef();
  const lastItemElement = useCallback(
    node => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        entries => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber(prevPageNumber => prevPageNumber + 1);
          }
        },
        { root: document.querySelector('.results') }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
};
