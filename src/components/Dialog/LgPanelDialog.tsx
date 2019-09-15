import LgPanel from "components/Panels/LgPanel";
import React, { forwardRef } from "react";
import { RouteComponentProps, withRouter } from "react-router";

import {
  AppBar,
  Dialog,
  IconButton,
  makeStyles,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { TransitionProps } from "@material-ui/core/transitions/transition";
import CloseIcon from "@material-ui/icons/Close";

interface LgPanelDialogProps extends RouteComponentProps {
  open: boolean;
  handleCloseDialog: () => void;
}

const useStyles = makeStyles({
  appBar: {
    position: "relative",
  },
  paper: {
    backgroundColor: "rgba(var(--bg-color-rgb), 0.9)",
  },
  dialogCloseBtn: {
    marginRight: "1rem",
  },
});

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
  const { open, handleCloseDialog, match } = props;
  const classes = useStyles();

  return (
    <Dialog
      classes={{
        paper: classes.paper,
      }}
      fullScreen
      open={open}
      onClose={handleCloseDialog}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar} color="inherit" elevation={5}>
        <Toolbar>
          <IconButton
            className={classes.dialogCloseBtn}
            edge="start"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6">Manage Playlists</Typography>
        </Toolbar>
      </AppBar>
      <LgPanel match={match} />
    </Dialog>
  );
};

export default withRouter(LgPanelDialog);
