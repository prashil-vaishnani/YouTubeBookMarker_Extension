export const convertTimeToSeconds = (time) => {
  const timeArray = time.split(":").map(Number);
  let seconds = 0;
  for (let i = 0; i < timeArray.length; i++) {
    const multiplier = Math.pow(60, timeArray.length - 1 - i);
    seconds += timeArray[i] * multiplier;
  }
  return seconds;
};

export const extractYouTubeVideoData = () => {
  let title = document.querySelector(
    ".title.style-scope.ytd-video-primary-info-renderer"
  ).innerText;
  let timestamp = document.querySelector(".ytp-time-current").innerText;
  return { title, timestamp };
};

export const extractEmbedVideoUrl = (url) => {
    const regex = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^?&\n]+)/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      const videoId = match[1];
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      return embedUrl;
    }
    
    return null;
  };
  