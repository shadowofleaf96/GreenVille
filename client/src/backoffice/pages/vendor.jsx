import { Helmet } from "react-helmet-async";

import { VendorView } from "../sections/vendor/view";

// ----------------------------------------------------------------------

export default function VendorPage() {
  return (
    <>
      <Helmet>
        <title> Vendor | GreenVille </title>
      </Helmet>

      <VendorView />
    </>
  );
}
