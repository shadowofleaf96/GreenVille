"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { OrderView, DeliveryView } from "./index";
import { setError } from "@/store/slices/admin/orderSlice";
import Loader from "@/frontoffice/_components/loader/Loader";

export default function OrderViewWrapper() {
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

  return <>{isDeliveryBoy ? <DeliveryView /> : <OrderView />}</>;
}
