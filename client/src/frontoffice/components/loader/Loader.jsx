import React from "react";
import { Spinner } from "@material-tailwind/react";

const Loader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <Spinner className="h-10 w-10" animation="border" />
    </div>
  );
};

export default Loader;
