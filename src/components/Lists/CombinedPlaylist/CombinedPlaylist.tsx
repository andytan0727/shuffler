import React, { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { selectListToPlayResultSnippets } from "store/ytplaylist/listToPlaySelectors";
import { retryLazy } from "utils/helper/lazyImportHelper";

import { useMediaQuery } from "@material-ui/core";

const LazyVideoList = lazy(() => retryLazy(() => import("../VideoList")));

const CombinedPlaylist = () => {
  const matchesMobile = useMediaQuery("(max-width: 420px)");
  const listToPlaySnippets = useSelector(selectListToPlayResultSnippets);

  return (
    <React.Fragment>
      {listToPlaySnippets.length ? (
        <Suspense fallback={<div>loading playlist...</div>}>
          {matchesMobile ? (
            <LazyVideoList items={listToPlaySnippets} width={250} isMobile />
          ) : (
            <LazyVideoList items={listToPlaySnippets} width={400} />
          )}
        </Suspense>
      ) : (
        <div>
          <h3>No video to play? Add something.</h3>
        </div>
      )}
    </React.Fragment>
  );
};

export default CombinedPlaylist;
