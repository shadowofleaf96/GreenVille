"use client";

import Link from "next/link";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const TermsAndConditions = () => {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSelector((state) => state.adminSettings);
  const termsPolicy = settings?.policies?.terms;

  if (
    (settings?.policies && settings.policies.isActive === false) ||
    termsPolicy?.isActive === false
  ) {
    return null;
  }

  const currentLang = i18n.language;

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {t("termsAndConditions.header")}
        </h1>

        <div className="prose max-w-none whitespace-pre-wrap">
          {termsPolicy?.text?.[currentLang] || (
            <>
              <p>{t("termsAndConditions.welcome")}</p>

              {/* Introduction Section */}
              <h2 className="text-xl font-semibold mt-5">
                {t("termsAndConditions.introduction.header")}
              </h2>
              <p>{t("termsAndConditions.introduction.content")}</p>

              {/* Intellectual Property Section */}
              <h2 className="text-xl font-semibold mt-5">
                {t("termsAndConditions.intellectualProperty.header")}
              </h2>
              <p>{t("termsAndConditions.intellectualProperty.content")}</p>

              {/* User Accounts Section */}
              <h2 className="text-xl font-semibold mt-5">
                {t("termsAndConditions.userAccounts.header")}
              </h2>
              <p>{t("termsAndConditions.userAccounts.content")}</p>

              {/* Limitation of Liability Section */}
              <h2 className="text-xl font-semibold mt-5">
                {t("termsAndConditions.limitationOfLiability.header")}
              </h2>
              <p>{t("termsAndConditions.limitationOfLiability.content")}</p>

              {/* Links to Other Sites Section */}
              <h2 className="text-xl font-semibold mt-5">
                {t("termsAndConditions.linksToOtherSites.header")}
              </h2>
              <p>{t("termsAndConditions.linksToOtherSites.content")}</p>

              {/* Changes to Terms Section */}
              <h2 className="text-xl font-semibold mt-5">
                {t("termsAndConditions.changesToTerms.header")}
              </h2>
              <p>{t("termsAndConditions.changesToTerms.content")}</p>

              {/* Governing Law Section */}
              <h2 className="text-xl font-semibold mt-5">
                {t("termsAndConditions.governingLaw.header")}
              </h2>
              <p>{t("termsAndConditions.governingLaw.content")}</p>
            </>
          )}
        </div>

        {/* Contact Us Section */}
        <p className="mt-5">{t("termsAndConditions.contactUs")}</p>
        <Link href="/contact" className="text-blue-500 underline">
          {t("Contact us")}
        </Link>
      </div>
    </>
  );
};

export default TermsAndConditions;
