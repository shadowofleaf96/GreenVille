import { Helmet } from 'react-helmet-async';

import ResetPasswordPage from '../sections/user/view/reset-password';

// ----------------------------------------------------------------------

export default function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title> Reset Password </title>
      </Helmet>

      <ResetPasswordPage />
    </>
  );
}
