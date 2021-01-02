import React, { lazy, Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { retryLazy } from "utils/helper/lazyImportHelper";

import styles from "./styles.module.scss";

const LgPanel = lazy(() =>
  retryLazy(() => import("components/Panels/LgPanel"))
);

/**
 * PlaylistInputPage component
 * A route switcher to playlist tabs or panels
 *
 */
const PlaylistInputPage = () => {
  return (
    <div className={styles.playlistInputDiv}>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route path="/panel" component={LgPanel} />
          <Redirect to="/panel" />
        </Switch>
      </Suspense>
    </div>
  );
};

export default PlaylistInputPage;
