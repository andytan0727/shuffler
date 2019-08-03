import FullPageSpinner from "components/Loadings/FullPageSpinner";
import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { delayLazy, retryLazy } from "utils/helper/lazyImportHelper";

import ManagementPanelDrawer from "./ManagementPanelDrawer";
import styles from "./styles.module.scss";

interface ManagementPanelProps {
  match: MatchRoute;
}

const ManagementVideosPanel = lazy(() =>
  delayLazy(() => retryLazy(() => import("./ManagementVideosPanel")))
);

const ManagementRecentlyPlayedPanel = lazy(() =>
  delayLazy(() => retryLazy(() => import("./ManagementRecentlyPlayedPanel")))
);

const ManagementNowPlayingPanel = lazy(() =>
  delayLazy(() => retryLazy(() => import("./ManagementNowPlayingPanel")))
);
const ManagementPlaylistsPanel = lazy(() =>
  delayLazy(() => retryLazy(() => import("./ManagementPlaylistsPanel")))
);

/**
 * ManagementPanel component
 *
 * A component that holds the routes for videos, playlists and other panels
 * related to video management
 *
 */
const ManagementPanel = ({ match }: ManagementPanelProps) => {
  const managementPanelPath = match.path;

  return (
    <div className={styles.managementPanelDiv}>
      <Route component={ManagementPanelDrawer} />
      <Suspense fallback={<FullPageSpinner />}>
        <Switch>
          <Route
            path={`${managementPanelPath}/videos`}
            component={ManagementVideosPanel}
          />
          <Route
            path={`${managementPanelPath}/recent`}
            component={ManagementRecentlyPlayedPanel}
          />
          <Route
            path={`${managementPanelPath}/playing`}
            component={ManagementNowPlayingPanel}
          />
          <Route
            path={`${managementPanelPath}/playlists`}
            component={ManagementPlaylistsPanel}
          />
          <Redirect to={`${managementPanelPath}/videos`} />
        </Switch>
      </Suspense>
    </div>
  );
};

export default ManagementPanel;
