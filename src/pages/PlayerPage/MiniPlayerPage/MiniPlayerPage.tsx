import { MiniPlayer } from "components/Players";
import React from "react";
import { useSelector } from "react-redux";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";

import NoVideoFound from "../NoVideoFound";

const MiniPlayerPage = () => {
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);

  return listToPlaySnippets.length !== 0 ? (
    <div>
      <MiniPlayer />
    </div>
  ) : (
    <NoVideoFound />
  );
};

export default MiniPlayerPage;
