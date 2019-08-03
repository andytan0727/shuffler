import FullPageSpinner from "components/Loadings/FullPageSpinner";
import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router";
import { delayLazy, retryLazy } from "utils/helper/lazyImportHelper";

interface ManagementPlaylistsPanelProps {
  match: MatchRoute;
}

const ManagementPlaylistsPanelHome = lazy(() =>
  delayLazy(() => retryLazy(() => import("./ManagementPlaylistsPanelHome")))
);

const ManagementPlaylistPanel = lazy(() =>
  delayLazy(() => retryLazy(() => import("../ManagementPlaylistPanel")))
);

const ManagementPlaylistsPanel = ({ match }: ManagementPlaylistsPanelProps) => {
  const path = match.path;

  return (
    <Suspense fallback={<FullPageSpinner />}>
      <Switch>
        <Route
          exact
          path={`${path}`}
          component={ManagementPlaylistsPanelHome}
        />
        <Route path={`${path}/:id`} component={ManagementPlaylistPanel} />

        <Redirect to={`${path}`} />
      </Switch>
    </Suspense>
  );
};

export default ManagementPlaylistsPanel;
