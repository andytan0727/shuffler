import { CloseLgPanelDialogBtn } from "components/Buttons";
import LgPanel from "components/Panels/LgPanel";
import React, { forwardRef, useCallback } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import {
  AppBar,
  Dialog,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";

interface LgPanelDialogProps extends RouteComponentProps {
  open: boolean;
  handleCloseDialog: () => void;
}

const useStyles = makeStyles({
  appBar: {
    position: "relative",

    "& .MuiToolbar-root": {
      display: "flex",
      justifyContent: "space-between",
    },
  },
  paper: {
    backgroundColor: "rgba(var(--bg-color-rgb), 0.9)",
  },
});

/**
 * Custom component to change default fade transition of dialog
 */
const Transition = forwardRef(function Transition(props: TransitionProps, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

Transition.displayName = "Transition";

/**
 * Dialog contains a portable version of LgPanel on
 * player page
 *
 * @param props
 */
const LgPanelDialog: React.FunctionComponent<LgPanelDialogProps> = (
  props: LgPanelDialogProps
) => {
  const {
    open,
    handleCloseDialog,
    history,

    // react-router match provide to LgPanel for routing
    match,
  } = props;
  const classes = useStyles();

  /**
   *  Reset url caused by routing in dialog to normal url
   *
   *  e.g. when the dialog is opened, it will show
   *       /player/ytplayer/panel/playing, and so on when
   *       user is navigating panel in dialog. This function
   *       is to reset the url back to /player/ytplayer
   *       when the dialog is exited
   */
  const handleResetUrl = useCallback(() => {
    history.push("/player/ytplayer");
  }, [history]);

  return (
    <Dialog
      classes={{
        paper: classes.paper,
      }}
      fullScreen
      open={open}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
      onExited={handleResetUrl}
    >
      <AppBar className={classes.appBar} color="inherit" elevation={5}>
        <Toolbar>
          <Typography variant="h6">Manage Playlists</Typography>

          <CloseLgPanelDialogBtn handleCloseDialog={handleCloseDialog} />
        </Toolbar>
      </AppBar>
      <LgPanel match={match} />
    </Dialog>
  );
};

export default withRouter(LgPanelDialog);
