import { Helmet } from 'react-helmet-async';

import { CouponView } from '../sections/coupon/view';

// ----------------------------------------------------------------------

export default function SubCategoryPage() {
  return (
    <>
      <Helmet>
        <title> Coupon | GreenVille </title>
      </Helmet>

      <CouponView />
    </>
  );
}