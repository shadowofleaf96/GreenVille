import React, { Fragment } from "react";
import MetaData from "../../../components/MetaData";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Success = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gray-100 py-3 md:py-6">
      <MetaData title={"GreenVille - Payment Success"} />
      <div className="flex flex-col items-center py-8 my-4 md:my-8 px-4 justify-center">
        <div className="flex flex-col items-center py-6 w-full max-w-lg mx-auto">
          <div className="relative flex items-center justify-center mb-8">
            <svg
              className="w-32 h-32 text-green-500 animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                className="transition-all duration-1000 ease-in-out"
                fill="#5bb543"
                cx="24"
                cy="24"
                r="22"
              />
              <path
                className="transition-all duration-1000 ease-in-out"
                fill="none"
                stroke="#FFF"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14 27l5.917 4.917L34 17"
              />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            {t("orderSuccessMessage")}
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-center">
            {t("orderSuccessDescription")}
          </p>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Link
              to="/products"
              className="px-6 py-3 bg-[#8DC63F] text-white font-medium rounded-md shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
            >
              {t("continueShopping")}
            </Link>
            <Link
              to="/profile/orders"
              className="px-6 py-3 bg-gray-300 text-gray-800 font-medium rounded-md shadow text-center hover:bg-gray-400 transition-all duration-300"
            >
              {t("viewOrders")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
