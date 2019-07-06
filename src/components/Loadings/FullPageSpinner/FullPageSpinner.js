import React from "react";
import { CircularProgress } from "@material-ui/core";

const FullPageSpinner = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflowY: "hidden",
      }}
    >
      <CircularProgress color="secondary" size={72} />
    </div>
  );
};

export default FullPageSpinner;
