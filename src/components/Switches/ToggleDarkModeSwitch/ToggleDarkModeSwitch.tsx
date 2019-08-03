import React, { useCallback, useState } from "react";
import { connect } from "react-redux";
import { AppState } from "store";
import { setPreferDarkTheme } from "store/userPreferences/action";

import styles from "./styles.module.scss";

interface ConnectedState {
  preferDarkTheme: boolean;
}

interface ConnectedDispatch {
  setPreferDarkTheme: typeof setPreferDarkTheme;
}

type ToggleDarkModeSwitchProps = ConnectedState & ConnectedDispatch;

const ToggleDarkModeSwitch = (props: ToggleDarkModeSwitchProps) => {
  const { preferDarkTheme, setPreferDarkTheme } = props;
  const [checked, setChecked] = useState(preferDarkTheme);

  /**
   * Handle toggle dark mode based on checkbox checked state
   *
   */
  const handleToggleDarkMode = useCallback(
    (e: InputChangeEvent) => {
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

const mapStatesToProps = (state: AppState) => ({
  preferDarkTheme: state.userPreferences.preferDarkTheme,
});

export default connect(
  mapStatesToProps,
  {
    setPreferDarkTheme,
  }
)(ToggleDarkModeSwitch);
