import React from "react";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  return (
    <div className="flex justify-center mt-5">
      {shipping ? (
        <Link to="/shipping" className="flex items-center space-x-2">
          <div className="triangle2-active w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-green-500"></div>
          <div className="step active-step text-green-500 font-medium">Shipping</div>
          <div className="triangle-active w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-green-500"></div>
        </Link>
      ) : (
        <div className="flex items-center space-x-2 cursor-not-allowed">
          <div className="triangle2-incomplete w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-gray-300"></div>
          <div className="step incomplete text-gray-400">Shipping</div>
          <div className="triangle-incomplete w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-gray-300"></div>
        </div>
      )}

      {confirmOrder ? (
        <Link to="/order/confirm" className="flex items-center space-x-2 mx-4">
          <div className="triangle2-active w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-green-500"></div>
          <div className="step active-step text-green-500 font-medium">Confirm Order</div>
          <div className="triangle-active w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-green-500"></div>
        </Link>
      ) : (
        <div className="flex items-center space-x-2 cursor-not-allowed mx-4">
          <div className="triangle2-incomplete w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-gray-300"></div>
          <div className="step incomplete text-gray-400">Confirm Order</div>
          <div className="triangle-incomplete w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-gray-300"></div>
        </div>
      )}

      {payment ? (
        <Link to="/payment" className="flex items-center space-x-2">
          <div className="triangle2-active w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-green-500"></div>
          <div className="step active-step text-green-500 font-medium">Payment</div>
          <div className="triangle-active w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-green-500"></div>
        </Link>
      ) : (
        <div className="flex items-center space-x-2 cursor-not-allowed">
          <div className="triangle2-incomplete w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-b-[24px] border-b-gray-300"></div>
          <div className="step incomplete text-gray-400">Payment</div>
          <div className="triangle-incomplete w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-gray-300"></div>
        </div>
      )}
    </div>
  );
};

export default CheckoutSteps;
