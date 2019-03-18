import React from "react";
import TopBar from "../../TopBar";
import PlaylistInput from "../../PlaylistInput";
import styles from "./styles.module.scss";

const MainPage = () => {
  return (
    <div className={styles.mainPgDiv}>
      <header>
        <TopBar />
      </header>
      <div className={styles.mainPgContent1}>
        <p>Randomize your YouTube Playlist</p>
      </div>
      <div className={styles.mainPgContent2}>
        <p>Try to "real" random</p>
        <PlaylistInput />
      </div>
      <div className={styles.mainPgContent3}>
        <p>Unleash your passion</p>
      </div>
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
    </div>
  );
};

export default MainPage;
