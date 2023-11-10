import { Helmet } from 'react-helmet-async';

import { UserView } from '../sections/customer/view';

// ----------------------------------------------------------------------

export default function UserPage() {
  return (
    <>
      <Helmet>
        <title> Customer | Minimal UI </title>
      </Helmet>

      <UserView />
    </>
  );
}