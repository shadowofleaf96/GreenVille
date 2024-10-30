import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const CheckoutSteps = ({ shipping, confirmOrder, payment }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center mt-4 md:mt-0">
      <nav>
        <ol className="flex flex-row md:space-x-4">
          {shipping ? (
            <Link to="/shipping">
              <li className="md:flex-1 w-24">
                <div
                  className="group cursor-pointer flex flex-col items-center py-2 px-4 md:pb-0 md:pt-4 border-l-4 border-[#8DC63F] md:border-l-0 md:border-t-4 w-full text-center"
                  aria-current="step"
                >
                  <span className="text-sm font-medium text-[#8DC63F]">{t("Step 1")}
                  </span>
                  <span className="text-sm font-medium">{t("Shipping")}</span>
                </div>
              </li>
            </Link>
          ) : (
            <li className="md:flex-1 w-24">
              <div
                className="group cursor-pointer flex flex-col items-center py-2 px-4 md:pb-0 md:pt-4 border-l-4 border-gray-200 md:border-l-0 md:border-t-4 w-full text-center"
                aria-current="step"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {t("Step 1")}
                </span>
                <span className="text-sm font-medium">
                  {t("Shipping")}
                </span>
              </div>
            </li>
          )}

          {/* Step 2: Confirm Order */}
          {confirmOrder ? (
            <Link to="/confirm">
              <li className="md:flex-1 w-24">
                <div
                  className="group cursor-pointer flex flex-col items-center py-2 px-4 md:pb-0 md:pt-4 border-l-4 border-[#8DC63F] md:border-l-0 md:border-t-4 w-full text-center"
                >
                  <span className="text-sm font-medium text-[#8DC63F]">
                    {t("Step 2")}
                  </span>
                  <span className="text-sm font-medium">
                    {t("Confirm Order")}
                  </span>
                </div>
              </li>
            </Link>
          ) : (
            <li className="md:flex-1 w-24">
              <div
                className="group cursor-pointer flex flex-col items-center py-2 px-4 md:pb-0 md:pt-4 border-l-4 border-gray-200 hover:border-gray-300 md:border-l-0 md:border-t-4 w-full text-center"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {t("Step 2")}
                </span>
                <span className="text-sm font-medium">
                  {t("Confirm Order")}
                </span>
              </div>
            </li>
          )}

          {/* Step 3: Payment */}
          {payment ? (
            <Link to="/payment">
              <li className="md:flex-1 w-24">
                <div
                  className="group cursor-pointer flex flex-col items-center py-2 px-4 md:pb-0 md:pt-4 border-l-4 border-[#8DC63F] md:border-l-0 md:border-t-4 w-full text-center"
                >
                  <span className="text-sm font-medium text-[#8DC63F]">
                    {t("Step 3")}
                  </span>
                  <span className="text-sm font-medium">
                    {t("Payment")}
                  </span>
                </div>
              </li>
            </Link>
          ) : (
            <li className="md:flex-1 w-24">
              <div
                className="group cursor-pointer flex flex-col items-center py-2 px-4 md:pb-0 md:pt-4 border-l-4 border-gray-200 hover:border-gray-300 md:border-l-0 md:border-t-4 w-full text-center"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {t("Step 3")}
                </span>
                <span className="text-sm font-medium">
                  {t("Payment")}
                </span>
              </div>
            </li>
          )}
        </ol>
      </nav>
    </div>
  );
};

export default CheckoutSteps;