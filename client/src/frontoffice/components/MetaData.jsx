import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

const MetaData = ({ title, description }) => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>{`${title} - GreenVille`}</title>
        <meta name="description" content={description} />
      </Helmet>
    </HelmetProvider>
  );
};

export default MetaData;
