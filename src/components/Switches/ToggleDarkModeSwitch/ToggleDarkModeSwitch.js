import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { setPreferDarkTheme } from "../../../store/userPreferences/action";

import styles from "./styles.module.scss";

/**
 * @typedef ToggleDarkModeSwitchProps
 * @property {boolean} preferDarkTheme
 * @property {function(boolean):void} setPreferDarkTheme
 */

/**
 * @param {ToggleDarkModeSwitchProps} props
 */
const ToggleDarkModeSwitch = (props) => {
  const { preferDarkTheme, setPreferDarkTheme } = props;
  const [checked, setChecked] = useState(preferDarkTheme);

  /**
   * Handle toggle dark mode based on checkbox checked state
   *
   * @param {import("react").ChangeEvent<HTMLInputElement>} e
   */
  const handleToggleDarkMode = useCallback(
    (e) => {
      setChecked(e.target.checked);
      setPreferDarkTheme(e.target.checked);
    },
    [setPreferDarkTheme]
  );

  return (
    <div>
      <label className={styles.toggleDarkModeSwitchLabel}>
        <input
          type="checkbox"
          className={styles.toggleDarkModeSwitch}
          checked={checked}
          onChange={handleToggleDarkMode}
        />
      </label>
    </div>
  );
};

ToggleDarkModeSwitch.propTypes = {
  setPreferDarkTheme: PropTypes.func.isRequired,
};

const mapStatesToProps = ({ userPreferences: { preferDarkTheme } }) => ({
  preferDarkTheme,
});

export default connect(
  mapStatesToProps,
  {
    setPreferDarkTheme,
  }
)(ToggleDarkModeSwitch);
