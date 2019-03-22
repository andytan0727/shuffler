import React from "react";
import { connect } from "react-redux";

import styles from "./styles.module.scss";

const SongChips = props => {
  return (
    <div className={styles.songChipsDiv}>
      <p>testing</p>
      <p>chips</p>
    </div>
  );
};

const mapStateToProps = ({ ytapi }) => ({
  ytapi
});

export default connect(
  mapStateToProps,
  {}
)(SongChips);