import React, { lazy } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import { retryLazy } from "utils/helper/lazyImportHelper";

interface PlayerPageProps {
  match: MatchRoute;
}

// suspense in root router
const YTPlayerPage = lazy(() => retryLazy(() => import("./YTPlayerPage")));
const MiniPlayerPage = lazy(() => retryLazy(() => import("./MiniPlayerPage")));

const PlayerPage = ({ match }: PlayerPageProps) => {
  const playerPagePath = match.path;

  return (
    <React.Fragment>
      <Switch>
        <Route path={`${playerPagePath}/ytplayer`} component={YTPlayerPage} />
        <Route
          path={`${playerPagePath}/miniplayer`}
          component={MiniPlayerPage}
        />
        <Redirect to={`${playerPagePath}/ytplayer`} />
      </Switch>
    </React.Fragment>
  );
};

export default PlayerPage;
