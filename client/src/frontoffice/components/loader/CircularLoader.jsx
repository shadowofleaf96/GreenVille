import React from "react";
import Iconify from "../../../backoffice/components/iconify";

const CircularLoader = () => {
  return (
    <div className="flex items-center justify-center h-screen w-full bg-white/90 fixed inset-0 z-9999">
      <div className="relative">
        {/* Outer Glow */}
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />

        {/* Main Spinner */}
        <Iconify
          icon="svg-spinners:180-ring-with-bg"
          width={64}
          className="text-primary relative z-10"
        />
      </div>
    </div>
  );
};

export default CircularLoader;
