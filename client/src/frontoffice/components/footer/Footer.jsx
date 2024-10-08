import React from "react";
import { Link } from "react-router-dom";
import Iconify from "../../../backoffice/components/iconify";

const Footer = () => {
  return (
    <footer className="bg-white mt-auto">
      <div className="container mx-auto pb-8 px-4">
        <hr className="mb-6 border-gray-300" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          <div className="space-y-4">
            <Link to="/" className="flex justify-center md:justify-start">
              <img className="w-32 h-auto bg-cover" src="/assets/logo.webp" alt="logo" />
            </Link>
            <p className="text-gray-600 text-sm w-full max-w-md">
              Moroccan E-Shop provides all kinds of organic goods. Our services are designed to fit your healthy lifestyle.
            </p>
          </div>

          <div className="flex justify-between mx-8 md:mx-0 md:space-y-0 md:space-x-8">
            <div className="space-y-4">
              <h5 className="font-medium capitalize text-lg text-gray-900">Informations</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/about"
                  >
                    <Iconify icon="material-symbols:info-outline" width={16} className="mr-2" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/contact"
                  >
                    <Iconify icon="mdi:contacts-outline" width={16} className="mr-2" />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/refund"
                  >
                    <Iconify icon="mingcute:card-refund-line" width={16} className="mr-2" />
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h5 className="font-medium capitalize text-lg text-gray-900">Customer Services</h5>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/me"
                  >
                    <Iconify icon="ic:outline-account-circle" width={16} className="mr-2" />
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/terms"
                  >
                    <Iconify icon="ic:outline-description" width={16} className="mr-2" />
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/return"
                  >
                    <Iconify icon="ic:outline-undo" width={16} className="mr-2" />
                    Returns & Exchanges
                  </Link>
                </li>
                <li>
                  <Link
                    className="flex items-center justify-center md:justify-start text-gray-600 hover:text-[#8DC63F] transition duration-300"
                    to="/shippingpolicy"
                  >
                    <Iconify icon="mdi:truck-delivery-outline" width={16} className="mr-2" />
                    Shipping & Delivery
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="h-12 bg-gradient-to-r from-[#8DC63F] to-yellow-400 flex items-center justify-center">
        <span className="font-semibold text-center">
          © 2023 GreenVille. All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
