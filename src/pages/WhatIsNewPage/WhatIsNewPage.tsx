import React from "react";
import { connect } from "react-redux";
import { AppState } from "store";

import styles from "./styles.module.scss";

interface WhatIsNewPageProps {
  appUpdates: any[];
}

const WhatIsNewPage = ({ appUpdates }: WhatIsNewPageProps) => {
  const latestUpdates = appUpdates
    .concat()
    .reverse()
    .slice(0, 3);

  return (
    <div className={styles.whatIsNewDiv}>
      <header>
        <h2>Changelog</h2>
      </header>
      <main>
        {latestUpdates.length &&
          latestUpdates.map((update) => (
            <ul key={update.version}>
              <h3>v{update.version}</h3>
              {update.changes.map((change: string, idx: number) => (
                <li key={idx}>{change}</li>
              ))}
            </ul>
          ))}
      </main>
    </div>
  );
};

const mapStatesToProps = (state: AppState) => ({
  appUpdates: state.appGeneral.appUpdates,
});

export default connect(
  mapStatesToProps,
  {}
)(WhatIsNewPage);
