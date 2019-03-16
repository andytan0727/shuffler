import React, { useEffect } from "react";
import YoutubePlayer from "youtube-player";

const YoutubePlayerFrame = props => {
  useEffect(() => {
    const ytplayer = YoutubePlayer("player");
    ytplayer.loadVideoById("M7lc1UVf-VE");
    ytplayer.playVideo();
  }, []);

  return (
    <div id={"player"}>
      <p>hello</p>
    </div>
  );
};

export default YoutubePlayerFrame;
