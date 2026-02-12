"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const MetaData = ({ title, description, keywords, image }) => {
  const { data: settings } = useSelector((state) => state.adminSettings);
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const seo = settings?.seo;
  const siteTitle =
    seo?.meta_title?.[currentLanguage] ||
    settings?.website_title?.[currentLanguage] ||
    "";
  const globalDescription = seo?.meta_description?.[currentLanguage] || "";
  const globalKeywords = seo?.meta_keywords?.[currentLanguage] || "";

  const finalTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const finalDescription = description || globalDescription;
  const finalKeywords = keywords || globalKeywords;
  const finalImage = image || seo?.og_image || "";

  useEffect(() => {
    document.title = finalTitle;

    const metaTags = [
      { name: "description", content: finalDescription },
      { name: "keywords", content: finalKeywords },
      { property: "og:type", content: "website" },
      { property: "og:title", content: finalTitle },
      { property: "og:description", content: finalDescription },
      { property: "og:image", content: finalImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: finalTitle },
      { name: "twitter:description", content: finalDescription },
      { name: "twitter:image", content: finalImage },
    ];

    metaTags.forEach((tag) => {
      let element = tag.name
        ? document.querySelector(`meta[name="${tag.name}"]`)
        : document.querySelector(`meta[property="${tag.property}"]`);

      if (!element) {
        element = document.createElement("meta");
        if (tag.name) element.setAttribute("name", tag.name);
        if (tag.property) element.setAttribute("property", tag.property);
        document.head.appendChild(element);
      }
      element.setAttribute("content", tag.content || "");
    });
  }, [
    finalTitle,
    finalDescription,
    finalKeywords,
    finalImage,
    currentLanguage,
  ]);

  return null;
};

export default MetaData;
