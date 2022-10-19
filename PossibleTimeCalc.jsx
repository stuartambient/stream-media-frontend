const [currentTime1, setCurrentTime1] = useState('00:00');
const [currentTime2, setCurrentTime2] = useState('00:00');

export const CurrentStreamTime = props => {
  const { src, type = 'audio', setCurrentTime } = props;
  const timeUpdate = event => {
    const minutes = Math.floor(event.target.currentTime / 60);
    const seconds = Math.floor(event.target.currentTime - minutes * 60);
    const currentTime =
      str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
    setCurrentTime(currentTime);
  };
  const str_pad_left = (string, pad, length) => {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  };
  let htmlTag = '';
  if (type === 'audio') {
    htmlTag = (
      <audio src={src} autoPlay muted controls onTimeUpdate={timeUpdate} />
    );
  }
  if (type === 'video') {
    htmlTag = (
      <video
        src={src}
        autoPlay
        muted
        controls
        loop
        onTimeUpdate={event => {
          timeUpdate(event);
        }}
      />
    );
  }
  return <>{htmlTag}</>;
};
