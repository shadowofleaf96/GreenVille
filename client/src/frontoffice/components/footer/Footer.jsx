import React from "react";
import { Link } from "react-router-dom";
import Iconify from "../../../backoffice/components/iconify";

const Footer = () => {
  return (
    <div className="bg-yellow-100 mt-auto">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
          <div className="max-w-xs space-y-4">
            <Link to="/">
              <img className="w-24 h-auto bg-cover" src="/assets/logo.webp" alt="logo" />
            </Link>
            <p className="text-gray-600 text-sm">
              Moroccan E shop provides all kinds of organic goods. Our services are designed and made to fit your healthy lifestyles.
            </p>
          </div>
          <div className="max-w-xs space-y-4">
            <h5 className="font-medium uppercase text-lg">Information</h5>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/about">About Us</Link>
              </li>
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/contact">Contact</Link>
              </li>
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/refund">Refund Policy</Link>
              </li>
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/cookie">Cookie Policy</Link>
              </li>
            </ul>
          </div>
          <div className="max-w-xs space-y-4">
            <h5 className="font-medium uppercase text-lg">Customer Service</h5>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/me">My Account</Link>
              </li>
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/terms">Terms & Conditions</Link>
              </li>
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/return">Returns & Exchanges</Link>
              </li>
              <li className="text-gray-600">
                <Link className="text-gray-600" to="/shipping">Shipping & Delivery</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="h-12 bg-gradient-to-r bg-green-300  flex items-center justify-center">
        <span className="font-semibold">© 2023 GreenVille. All Rights Reserved.</span>
      </div>
    </div>
  );
};

export default Footer;
