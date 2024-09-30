import React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

const Loader = () => {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  };
  return (
    <Stack style={containerStyle}>
      <CircularProgress />
    </Stack>
  );
};

export default Loader;
