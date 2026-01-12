import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
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

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {finalImage && <meta property="og:image" content={finalImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />
      {finalImage && <meta property="twitter:image" content={finalImage} />}
    </Helmet>
  );
};

export default MetaData;
