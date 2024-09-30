import { Helmet } from 'react-helmet-async';

import { PaymentView } from '../sections/payment/view';

// ----------------------------------------------------------------------

export default function PaymentPage() {
  return (
    <>
      <Helmet>
        <title> Payments | GreenVille </title>
      </Helmet>

      <PaymentView
       />
    </>
  );
}
