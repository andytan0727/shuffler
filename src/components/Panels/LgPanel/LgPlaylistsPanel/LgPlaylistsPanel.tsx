import FullPageSpinner from "components/Loadings/FullPageSpinner";
import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router";
import { delayLazy, retryLazy } from "utils/helper/lazyImportHelper";

interface LgPlaylistsPanelProps {
  match: MatchRoute;
}

const LgPlaylistsPanelHome = lazy(() =>
  delayLazy(() => retryLazy(() => import("./LgPlaylistsPanelHome")))
);

const LgPlaylistPanel = lazy(() =>
  delayLazy(() => retryLazy(() => import("../LgPlaylistPanel")))
);

const LgPlaylistsPanel = ({ match }: LgPlaylistsPanelProps) => {
  const path = match.path;

  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Switch>
        <Route exact path={`${path}`} component={LgPlaylistsPanelHome} />
        <Route path={`${path}/:id`} component={LgPlaylistPanel} />

        <Redirect to={`${path}`} />
      </Switch>
    </Suspense>
  );
};

export default LgPlaylistsPanel;
