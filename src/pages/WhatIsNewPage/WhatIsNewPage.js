import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { connect } from "react-redux";

import styles from "./styles.module.scss";

const WhatIsNewPage = ({ appUpdates, preferDarkTheme }) => {
  const latestUpdates = appUpdates
    .concat()
    .reverse()
    .slice(0, 3);

  return (
    <div
      className={classNames(styles.whatIsNewDiv, {
        [styles.dark]: preferDarkTheme,
      })}
    >
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
  preferDarkTheme: PropTypes.bool.isRequired,
};

const mapStatesToProps = ({ appGeneral: { appUpdates } }) => ({
  appUpdates,
});

export default connect(
  mapStatesToProps,
  {}
)(WhatIsNewPage);
