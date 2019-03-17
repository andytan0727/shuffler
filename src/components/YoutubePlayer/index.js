import React from "react";
import YouTube from "react-youtube";

const YoutubePlayerIFrame = props => {
  return (
    <div id={"player"}>
      <YouTube
        // videoId={"M7lc1UVf-VE"}
        opts={{
          playerVars: {
            autoplay: 0,
            fs: 0, // prevent fullscreen
            listType: "playlist",
            list: "PL6nn1koAbIR_g6wG0CV2p-LgaOw2Lp9ON"
          }
        }}
      />
    </div>
  );
};

export default YoutubePlayerIFrame;
