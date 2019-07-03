import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import styles from "./styles.module.scss";

const WhatIsNewPage = ({ appUpdates }) => {
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
              {update.changes.map((change, idx) => (
                <li key={idx}>{change}</li>
              ))}
            </ul>
          ))}
      </main>
    </div>
  );
};

WhatIsNewPage.propTypes = {
  appUpdates: PropTypes.array.isRequired,
};

const mapStatesToProps = ({ appGeneral: { appUpdates } }) => ({
  appUpdates,
});

export default connect(
  mapStatesToProps,
  {}
)(WhatIsNewPage);
