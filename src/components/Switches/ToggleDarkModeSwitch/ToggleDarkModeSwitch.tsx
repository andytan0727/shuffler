import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPreferDarkTheme } from "store/userPreferences/action";
import { selectPreferDarkTheme } from "store/userPreferences/selector";

import styles from "./styles.module.scss";

const ToggleDarkModeSwitch = () => {
  const preferDarkTheme = useSelector(selectPreferDarkTheme);
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(preferDarkTheme);

  /**
   * Handle toggle dark mode based on checkbox checked state
   *
   */
  const handleToggleDarkMode = useCallback(
    (e: InputChangeEvent) => {
      setChecked(e.target.checked);
      dispatch(setPreferDarkTheme(e.target.checked));
    },
    [dispatch]
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

export default ToggleDarkModeSwitch;
