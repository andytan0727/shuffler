import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPreferDarkTheme } from "store/userPreferences/action";
import { selectPreferDarkTheme } from "store/userPreferences/selector";

import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  toggleDarkModeSwitch: {
    height: "1px",
    width: "1px",
    overflow: "hidden",
  },
  toggleDarkModeSwitchLabel: {
    cursor: "pointer",

    "&::before": {
      content: "var(--switch-icon)",
      fontSize: "40px",
      transition: "text-shadow 0.2s",
    },

    "&:hover::before": {
      textShadow: "0 0 15px var(--switch-shadow-color)",
    },
  },
});

const ToggleDarkModeSwitch = () => {
  const classes = useStyles();
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
      <label className={classes.toggleDarkModeSwitchLabel}>
        <input
          type="checkbox"
          className={classes.toggleDarkModeSwitch}
          checked={checked}
          onChange={handleToggleDarkMode}
        />
      </label>
    </div>
  );
};

export default ToggleDarkModeSwitch;
