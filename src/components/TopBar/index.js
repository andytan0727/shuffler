import React from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.scss";

// import AppBar from "@material-ui/core/AppBar";
// import Toolbar from "@material-ui/core/Toolbar";
// import IconButton from "@material-ui/core/IconButton";
// import Button from "@material-ui/core/Button";
// // import { fade } from "@material-ui/core/styles/colorManipulator";
// import MenuIcon from "@material-ui/icons/Menu";
// import { withStyles } from "@material-ui/core/styles";

// const styles = theme => ({
//   root: {
//     width: "100vw"
//   },
//   toolbar: {
//     justifyContent: "space-between",
//   },
//   menuButton: {
//     marginLeft: -12,
//     marginRight: 20
//   },
//   title: {
//     display: "block",
//     flexGrow: 1
//     // [theme.breakpoints.up("sm")]: {
//     //   display: "block"
//     // }
//   }
// });

// function SearchAppBar(props) {
//   const { classes } = props;
//   return (
//     <div className={classes.root}>
//       <AppBar position="static" color="inherit">
//         <Toolbar variant="dense" className={classes.toolbar}>
//           <IconButton
//             className={classes.menuButton}
//             color="inherit"
//             aria-label="Menu"
//           >
//             <MenuIcon />
//           </IconButton>
//           {/* <Typography
//             className={classes.title}
//             variant="h6"
//             color="inherit"
//             noWrap
//           >
//             YT Random Player
//           </Typography> */}
//           <Button color="inherit">Login</Button>
//         </Toolbar>
//       </AppBar>
//     </div>
//   );
// }

const TopBar = props => {
  return (
    <div className={styles.mainNavDiv}>
      <nav className={styles.navbar}>
        <Link to="/" className={styles.logo}>
          YT Randomizer
        </Link>
        <Link to="/player">Player</Link>
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
};

// export default withStyles(styles)(SearchAppBar);
export default TopBar;
