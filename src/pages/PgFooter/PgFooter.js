import React from "react";

import styles from "./styles.module.scss";

const PgFooter = () => (
  <footer className={styles.footer}>
    <div>
      <section>
        <ul>
          <li>Home</li>
          <li>Player</li>
          <li>About</li>
        </ul>
      </section>
    </div>
    <div className={styles.copyright}>&copy; 2019 Andy Tan</div>
  </footer>
);

export default PgFooter;
