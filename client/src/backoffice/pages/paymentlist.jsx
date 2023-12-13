import { Helmet } from 'react-helmet-async';

import { PaymentListView } from '../sections/paymentlist/view';

// ----------------------------------------------------------------------

export default function PaymentListPage() {
  return (
    <>
      <Helmet>
        <title> Payment List | GreenVille </title>
      </Helmet>

      <PaymentListView />
    </>
  );
}
