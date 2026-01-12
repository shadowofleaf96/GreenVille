import { Helmet } from "react-helmet-async";

import { ReviewView } from "../sections/review/view";

// ----------------------------------------------------------------------

export default function ReviewPage() {
  return (
    <>
      <Helmet>
        <title> Review | GreenVille </title>
      </Helmet>

      <ReviewView />
    </>
  );
}
