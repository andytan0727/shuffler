import React, { lazy } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { retryLazy } from "../../utils/helper/lazyImportHelper";

// suspense in root router
const YTPlayerPage = lazy(() => retryLazy(() => import("./YTPlayerPage")));
const MiniPlayerPage = lazy(() => retryLazy(() => import("./MiniPlayerPage")));

const PlayerPage = () => {
  return (
    <React.Fragment>
      <Switch>
        <Route path="/player/ytplayer" component={YTPlayerPage} />
        <Route path="/player/miniplayer" component={MiniPlayerPage} />
        <Redirect to="/player/ytplayer" />
      </Switch>
    </React.Fragment>
  );
};

export default PlayerPage;
