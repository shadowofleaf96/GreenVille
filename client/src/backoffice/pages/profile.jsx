import { Helmet } from 'react-helmet-async';

import { ProfileView } from '../sections/profile/view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Profile | GreenVille </title>
      </Helmet>

      <ProfileView />
    </>
  );
}
