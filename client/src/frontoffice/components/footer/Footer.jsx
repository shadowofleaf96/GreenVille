import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Iconify from "../../../backoffice/components/iconify";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white mt-auto">
      <div className="container mx-auto pb-8 px-4">
        <hr className="mb-6 border-gray-300" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left rtl:md:text-right">
          <div className="space-y-4">
            <Link to="/" className="flex justify-center md:justify-start rtl:md:justify-start">
              <img className="w-32 h-auto bg-cover" src="/assets/logo.webp" alt="logo" />
            </Link>
            <p className="text-gray-600 text-sm w-full max-w-md">
              {t("footer.description")}
            </p>
          </div>

          <div className="flex justify-between mx-8 md:mx-0 md:space-y-0 md:space-x-8">
            <div className="space-y-4">
              <h5 className="font-medium capitalize text-lg text-gray-900">{t("footer.informations")}</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/about"
                  >
                    <Iconify icon="material-symbols:info-outline" width={16} className="mr-2 rtl:ml-2" />
                    {t("footer.about_us")}
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/contact"
                  >
                    <Iconify icon="mdi:contacts-outline" width={16} className="mr-2 rtl:ml-2" />
                    {t("footer.contact")}
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/refund"
                  >
                    <Iconify icon="mingcute:card-refund-line" width={16} className="mr-2 rtl:ml-2" />
                    {t("footer.refund_policy")}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium capitalize text-lg text-gray-900">{t("footer.customer_services")}</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/profile/update"
                  >
                    <Iconify icon="ic:outline-account-circle" width={16} className="mr-2 rtl:ml-2" />
                    {t("footer.my_account")}
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/terms"
                  >
                    <Iconify icon="ic:outline-description" width={16} className="mr-2 rtl:ml-2" />
                    {t("footer.terms_conditions")}
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/return"
                  >
                    <Iconify icon="ic:outline-undo" width={16} className="mr-2 rtl:ml-2" />
                    {t("footer.returns_exchanges")}
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/shippingpolicy"
                  >
                    <Iconify icon="mdi:truck-delivery-outline" width={16} className="mr-2 rtl:ml-2" />
                    {t("footer.shipping_delivery")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="h-12 bg-gradient-to-r from-[#8DC63F] to-yellow-400 flex items-center justify-center">
        <span className="font-semibold text-center">
          {t("footer.copyright")}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
