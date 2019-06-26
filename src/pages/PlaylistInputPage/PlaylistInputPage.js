import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classNames from "classnames";
import Switch from "@material-ui/core/Switch";
import { makeStyles } from "@material-ui/core/styles";

import { InputTabs } from "../../components/Tabs";
import { ReactComponent as DarkThemeIcon } from "../../assets/darkThemeIcon.svg";
import { ReactComponent as LightThemeIcon } from "../../assets/lightThemeIcon.svg";

import { setPreferDarkTheme } from "../../store/userPreferences/action";
import styles from "./styles.module.scss";

const useStyles = makeStyles({
  themeSwitch: {
    cursor: "pointer",
  },
});

const PlaylistInputPage = (props) => {
  const { preferDarkTheme, setPreferDarkTheme } = props;
  const classes = useStyles();

  const handleChangeTheme = () => {
    setPreferDarkTheme(!preferDarkTheme);
  };

  return (
    <React.Fragment>
      <div className={styles.playlistInPgDiv}>
        <InputTabs />
        <div className={styles.toggleDarkModeDiv}>
          <LightThemeIcon
            className={classNames({
              [styles.lightTheme]: !preferDarkTheme,
              [styles.darkTheme]: preferDarkTheme,
            })}
          />
          <Switch
            className={classes.themeSwitch}
            checked={preferDarkTheme}
            onChange={handleChangeTheme}
            value="toggle-dark-mode"
            color="secondary"
          />
          <DarkThemeIcon
            className={classNames({
              [styles.lightTheme]: !preferDarkTheme,
              [styles.darkTheme]: preferDarkTheme,
            })}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

PlaylistInputPage.propTypes = {
  preferDarkTheme: PropTypes.bool.isRequired,
  setPreferDarkTheme: PropTypes.func,
};

const mapStateToProps = ({ userPreferences: { preferDarkTheme } }) => ({
  preferDarkTheme,
});

export default connect(
  mapStateToProps,
  {
    setPreferDarkTheme,
  }
)(PlaylistInputPage);
