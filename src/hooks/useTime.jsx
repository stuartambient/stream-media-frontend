const str_pad_left = (string, pad, length) => {
  return (new Array(length + 1).join(pad) + string).slice(-length);
};

export const useDuration = refcurrent => {
  const minutes = Math.floor(refcurrent.duration / 60);
  const seconds = Math.floor(refcurrent.duration - minutes * 60);
  const duration =
    str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
  /* setDuration(currentTime); */
  return duration;
};

export const useCurrentTime = refcurrent => {
  const minutes = Math.floor(refcurrent.currentTime / 60);
  const seconds = Math.floor(refcurrent.currentTime - minutes * 60);
  const currentTime =
    str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
  /* setDuration(currentTime); */
  return currentTime;
};

/* const str_pad_left = (string, pad, length) => {
  return (new Array(length + 1).join(pad) + string).slice(-length);
}; */
