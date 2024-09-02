import React from "react";
import { Spinner } from "@material-tailwind/react";
import "./Loader.scss";

const Loader = () => {
  return (
    <div className="flex align-center justify-center loader-container">
      <Spinner animation="border" />
    </div>
  );
};

export default Loader;
