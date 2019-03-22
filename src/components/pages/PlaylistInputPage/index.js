import React from "react";
import Divider from "@material-ui/core/Divider";
import { withStyles } from "@material-ui/core/styles";
import PlaylistAppBar from "../../BarComponents/PlaylistAppBar";
import PlaylistInput from "../../InputComponents/PlaylistInput";
import SongChips from "../../Chips/SongChips";

import styles from "./styles.module.scss";

const muiStyles = theme => ({
  divider: {
    width: "500px"
  }
});

const PlaylistInputPage = props => {
  const { classes } = props;
  return (
    <React.Fragment>
      <PlaylistAppBar />
      <div className={styles.playlistInPgDiv}>
        <div className={styles.inputDiv}>
          <PlaylistInput />
          <Divider variant="middle" className={classes.divider} />
          {/* <SongChips /> */}
        </div>
        <section>
          <h3>
            How To:
          </h3>
          <p>
            Officia cillum officia sint qui magna officia. Excepteur minim Lorem
            enim amet nulla cupidatat velit deserunt culpa velit cillum laborum.
            Labore cillum veniam sunt dolor magna non Lorem ullamco elit. Nulla
            culpa adipisicing eu ullamco sit nulla reprehenderit eu aliqua
            nostrud sint esse dolore. Pariatur ea laboris ea sit non tempor.
            <br />
            <br />
            Reprehenderit sunt non voluptate fugiat et non sit ipsum nostrud
            nostrud excepteur ex amet nisi. Amet minim nulla deserunt proident
            occaecat fugiat elit labore consectetur mollit. Ea officia sunt
            magna veniam quis cupidatat labore.
            <br />
            <br />
            Non laboris officia nulla laborum aliquip dolor. Fugiat laborum
            pariatur id et eu elit id. Consequat excepteur do nulla id
            exercitation esse minim sit incididunt minim sit reprehenderit sint
            cillum.
          </p>
        </section>
      </div>
    </React.Fragment>
  );
};

export default withStyles(muiStyles)(PlaylistInputPage);
