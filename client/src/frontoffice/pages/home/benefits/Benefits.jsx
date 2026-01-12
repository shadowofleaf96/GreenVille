import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "../../../../backoffice/components/iconify";
import { useSelector } from "react-redux";

const Benefits = () => {
  const { i18n } = useTranslation();
  const { data: settings, loading } = useSelector(
    (state) => state.adminSettings,
  );
  const benefits = settings?.benefits?.length > 0 ? settings.benefits : [];

  const currentLang = i18n.language;

  if (loading) {
    return (
      <div className="bg-gray-50 py-12 flex justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 sm:px-2 lg:px-4">
        <div className="max-w-2xl mx-auto px-4 grid grid-cols-1 gap-y-10 gap-x-8 lg:max-w-none lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="text-center sm:flex sm:text-left rtl:sm:text-center lg:block lg:text-center"
            >
              <div className="sm:shrink-0">
                <div className="flow-root">
                  <Iconify
                    icon={benefit.icon}
                    className="w-auto h-auto mx-auto text-2xl text-primary font-medium rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:text-secondary"
                    width={60}
                    height={60}
                  />
                </div>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-6 rtl:sm:ml-0 rtl:sm:mr-6 lg:mt-6 lg:ml-0 lg:rtl:mr-0">
                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                  {benefit.title?.[currentLang] || benefit.title?.en || ""}
                </h3>
                <p className="mt-2 text-sm text-gray-500 font-medium leading-relaxed">
                  {benefit.description?.[currentLang] ||
                    benefit.description?.en ||
                    ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benefits;
