import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { OrderView, DeliveryView } from "../sections/order/view";
import { setError } from "../../redux/backoffice/orderSlice";
import Loader from "../../frontoffice/components/loader/Loader";
import { Helmet } from "react-helmet-async";

// ----------------------------------------------------------------------

export default function OrderPage() {
  const dispatch = useDispatch();
  const { admin } = useSelector((state) => state.adminAuth);
  const isDeliveryBoy = admin?.role === "delivery_boy";

  useEffect(() => {
    dispatch(setError(null));

    return () => {
      dispatch(setError(null));
    };
  }, [dispatch]);

  if (!admin) {
    return <Loader />;
  }

  return (
    <>
      <Helmet>
        <title> {isDeliveryBoy ? "Deliveries" : "Orders"} | GreenVille </title>
      </Helmet>

      {isDeliveryBoy ? <DeliveryView /> : <OrderView />}
    </>
  );
}
