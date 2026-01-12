import { Helmet } from "react-helmet-async";

import { NotificationView } from "../sections/notification/view";

// ----------------------------------------------------------------------

export default function NotificationPage() {
  return (
    <>
      <Helmet>
        <title> Notification | GreenVille </title>
      </Helmet>

      <NotificationView />
    </>
  );
}
