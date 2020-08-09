import React, { lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { retryLazy } from "utils/helper/lazyImportHelper";

interface PlayerPageProps {
  match: MatchRoute;
}

// suspense in root router
const YTPlayerPage = lazy(() => retryLazy(() => import("./YTPlayerPage")));

const PlayerPage = ({ match }: PlayerPageProps) => {
  const playerPagePath = match.path;

  return (
    <React.Fragment>
      <Switch>
        <Route path={`${playerPagePath}/ytplayer`} component={YTPlayerPage} />
        <Redirect to={`${playerPagePath}/ytplayer`} />
      </Switch>
    </React.Fragment>
  );
};

export default PlayerPage;
