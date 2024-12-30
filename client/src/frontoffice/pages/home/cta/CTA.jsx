import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Iconify from "../../../../backoffice/components/iconify";

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="px-4 mt-6 mb-6 flex justify-center mx-4 md:mx-0">
      <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
        <div className="flex flex-col justify-center items-center mb-6 text-3xl font-extrabold leading-tight tracking-normal text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl md:tracking-tight">
          <div className="flex flex-col w-full justify-center items-center">
            <span className="block text-center text-transparent bg-clip-text bg-gradient-to-r from-[#8DC63F] to-yellow-500">
              <span className="text-black mr-2">{t("discover")} </span>
              {t("organic_living")}
            </span>

            <span className="flex justify-center items-center mt-4">
              <img
                className="h-12 w-auto bg-cover mx-2 sm:h-16 md:h-24 md:mx-4 animate-pulse"
                src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/1f1c7b42092395de1674162dbc636e86"
                alt="GreenVille logo"
              />
            </span>
          </div>
        </div>
        <p className="px-0 mb-6 text-base text-gray-600 sm:text-lg md:text-xl lg:px-24">
          {t("description")}
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-0 md:space-x-4 md:flex-row md:mb-8">
          <Link
            className="inline-flex items-center justify-center w-full p-3 rtl:ml-3 px-4 mb-2 md:mb-0 md:w-auto btn rounded-md btn-primary btn-lg bg-[#8DC63F] text-white shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
            to="/products"
          >
            {t("shop_now")}
            <Iconify
              icon="ep:right"
              width={20}
              height={20}
              className="ml-2 rtl:mr-2 rtl:rotate-180"
            />
          </Link>
          <Link
            className="inline-flex items-center justify-center w-full p-3 px-4 md:w-auto rounded-md btn btn-light btn-lg border border-green-600 text-[#8DC63F] shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
            to="/about"
          >
            {t("learn_more")}
          </Link>
        </div>
      </div>
    </section>
  );
}