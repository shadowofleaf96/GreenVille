import React from "react";
import { Spinner } from "react-bootstrap";
import "./Loader.scss";

const Loader = () => {
  return (
    <div className="d-flex align-items-center justify-content-center loader-container">
      <Spinner animation="border" />
    </div>
  );
};

export default Loader;
