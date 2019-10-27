import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { selectAppLatestThreeUpdates } from "store/appGeneral/selector";

import { Backdrop, Button, Fade, Modal } from "@material-ui/core";

import styles from "./styles.module.scss";

const ChangelogModal: React.FC = () => {
  const latestThreeUpdates = useSelector(selectAppLatestThreeUpdates);
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <React.Fragment>
      <Button variant="outlined" size="small" onClick={handleOpen}>
        Changelog
      </Button>
      <Modal
        aria-labelledby="Changelog"
        aria-describedby="Show changes per version of shuffler"
        className={styles.changelogModal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={styles.modalContent}>
            <h2>Changelog</h2>
            <ul className={styles.outerList}>
              {latestThreeUpdates.map((update) => (
                <li key={update.version}>
                  <h3>{update.version}</h3>
                  <ul className={styles.innerList}>
                    {update.changes.map((change, cIdx) => (
                      <li key={cIdx}>{change}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </Fade>
      </Modal>
    </React.Fragment>
  );
};

export default ChangelogModal;
