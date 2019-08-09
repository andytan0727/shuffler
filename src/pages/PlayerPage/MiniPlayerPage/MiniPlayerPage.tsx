import { MiniPlayer } from "components/Players";
import React from "react";
import { useSelector } from "react-redux";
import { selectNormListToPlayResultSnippets } from "store/ytplaylist/normSelector";

import NoVideoFound from "../NoVideoFound";

const MiniPlayerPage = () => {
  const listToPlaySnippets = useSelector(selectNormListToPlayResultSnippets);

  return listToPlaySnippets.length !== 0 ? (
    <div>
      <MiniPlayer />
    </div>
  ) : (
    <NoVideoFound />
  );
};

export default MiniPlayerPage;
