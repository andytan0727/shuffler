import React, { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { Route, Redirect, Switch } from "react-router-dom";

import ManagementPanelDrawer from "./ManagementPanelDrawer";
import FullPageSpinner from "../../Loadings/FullPageSpinner";
import { retryLazy, delayLazy } from "../../../utils/helper/lazyImportHelper";

import styles from "./styles.module.scss";

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
 * @param {{ match: MatchRoute }} props
 * @returns
 */
const ManagementPanel = ({ match }) => {
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

ManagementPanel.propTypes = {
  match: PropTypes.object.isRequired,
};

export default ManagementPanel;
