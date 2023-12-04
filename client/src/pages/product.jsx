import { Helmet } from 'react-helmet-async';

import { ProductView } from '../sections/product/view';

// ----------------------------------------------------------------------

export default function ProductPage() {
  return (
    <>
      <Helmet>
        <title> Product | GreenVille </title>
      </Helmet>

      <ProductView />
    </>
  );
}
