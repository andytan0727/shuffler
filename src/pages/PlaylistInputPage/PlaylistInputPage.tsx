import { ToggleDarkModeSwitch } from "components/Switches";
import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { retryLazy } from "utils/helper/lazyImportHelper";

import styles from "./styles.module.scss";

interface PlaylistInputPageProps {
  match: MatchRoute;
}

const InputTabs = lazy(() =>
  retryLazy(() => import("components/Tabs/InputTabs"))
);
const LgPanel = lazy(() =>
  retryLazy(() => import("components/Panels/LgPanel"))
);

/**
 * PlaylistInputPage component
 * A route switcher to playlist tabs or panels
 *
 */
const PlaylistInputPage = ({ match }: PlaylistInputPageProps) => {
  const playlistInputPath = match.path;

  return (
    <div className={styles.playlistInputDiv}>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route path={`${playlistInputPath}/tabs`} component={InputTabs} />
          <Route path={`${playlistInputPath}/panel`} component={LgPanel} />
          <Redirect to={`${playlistInputPath}/tabs`} />
        </Switch>
      </Suspense>
      <ToggleDarkModeSwitch />
    </div>
  );
};

export default PlaylistInputPage;
