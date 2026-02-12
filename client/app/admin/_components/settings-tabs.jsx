"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Iconify from "@/components/shared/iconify/iconify";
import { useTranslation } from "react-i18next";

const SettingsTabs = ({
  activeTab,
  onTabChange,
  unsavedChanges = false,
  vertical = false,
}) => {
  const { t } = useTranslation();

  const tabs = [
    {
      id: "general",
      label: t("General"),
      icon: "solar:settings-bold-duotone",
      description: t("Logo, title, theme"),
    },
    {
      id: "content",
      label: t("Content"),
      icon: "solar:document-text-bold-duotone",
      description: t("Banner, benefits, CTA"),
    },
    {
      id: "pages",
      label: t("Pages"),
      icon: "solar:file-text-bold-duotone",
      description: t("About, contact, policies"),
    },
    {
      id: "ecommerce",
      label: t("E-commerce"),
      icon: "solar:cart-large-2-bold-duotone",
      description: t("Shipping, tax, payment"),
    },
    {
      id: "seo",
      label: t("SEO"),
      icon: "solar:graph-up-bold-duotone",
      description: t("Meta tags, analytics"),
    },
    {
      id: "advanced",
      label: t("Advanced"),
      icon: "solar:code-bold-duotone",
      description: t("Auth, translations"),
    },
  ];

  if (vertical) {
    return (
      <div className="flex flex-col gap-2 p-1 bg-gray-50/50 rounded-3xl border border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 text-left group ${
              activeTab === tab.id
                ? "bg-white shadow-md text-primary"
                : "text-gray-500 hover:bg-white/50 hover:text-gray-900"
            }`}
          >
            <div
              className={`p-2.5 rounded-xl transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10"
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}
            >
              <Iconify icon={tab.icon} className="w-6 h-6" />
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold tracking-tight">
                  {tab.label}
                </span>
                {unsavedChanges && activeTab === tab.id && (
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                )}
              </div>
              <p className="text-[10px] text-gray-400 font-medium truncate uppercase tracking-widest mt-0.5">
                {tab.description}
              </p>
            </div>
            {activeTab === tab.id && (
              <Iconify
                icon="solar:alt-arrow-right-bold-duotone"
                className="w-5 h-5 opacity-40"
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Tabs */}
      <div className="hidden lg:block">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-6 h-auto p-1 bg-gray-100/50 rounded-2xl">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-2 py-4 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-xl transition-all"
              >
                <Iconify icon={tab.icon} className="w-6 h-6" />
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{tab.label}</span>
                  {unsavedChanges && activeTab === tab.id && (
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>
                <span className="text-[10px] text-gray-500 font-medium hidden xl:block">
                  {tab.description}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Mobile Dropdown */}
      <div className="block lg:hidden">
        <select
          value={activeTab}
          onChange={(e) => onTabChange(e.target.value)}
          className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white font-bold text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {tabs.map((tab) => (
            <option key={tab.id} value={tab.id}>
              {tab.label} - {tab.description}
            </option>
          ))}
        </select>
        {unsavedChanges && (
          <div className="flex items-center gap-2 mt-2 text-xs text-orange-600 font-medium">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            {t("Unsaved changes")}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsTabs;
