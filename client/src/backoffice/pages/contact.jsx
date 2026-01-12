import { Helmet } from "react-helmet-async";

import { ContactView } from "../sections/contact/view";

// ----------------------------------------------------------------------

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title> Contact | GreenVille </title>
      </Helmet>

      <ContactView />
    </>
  );
}
