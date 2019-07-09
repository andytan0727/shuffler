import React, { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import { Route, Redirect, Switch } from "react-router-dom";
import { retryLazy } from "../../utils/helper/lazyImportHelper";
import ToggleDarkModeSwitch from "../../components/Switches/ToggleDarkModeSwitch";

import styles from "./styles.module.scss";

const InputTabs = lazy(() => retryLazy(() => import("../../components/Tabs")));
const ManagementPanel = lazy(() =>
  retryLazy(() => import("../../components/Panels/ManagementPanel"))
);

/**
 * PlaylistInputPage component
 * A route switcher to playlist tabs or panels
 *
 * @param {{ match: MatchRoute }} props
 * @returns
 */
const PlaylistInputPage = ({ match }) => {
  const playlistInputPath = match.path;

  return (
    <div className={styles.playlistInputDiv}>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route path={`${playlistInputPath}/tabs`} component={InputTabs} />
          <Route
            path={`${playlistInputPath}/panel`}
            component={ManagementPanel}
          />
          <Redirect to={`${playlistInputPath}/tabs`} />
        </Switch>
      </Suspense>
      <ToggleDarkModeSwitch />
    </div>
  );
};

PlaylistInputPage.propTypes = {
  match: PropTypes.object.isRequired,
};

export default PlaylistInputPage;
