import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../../components/MetaData";
import { useTranslation } from 'react-i18next';

const TermsAndConditions = () => {
    const { t } = useTranslation();

    return (
        <>
            <MetaData title={t("title")} />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6 text-center">{t("termsAndConditions.header")}</h1>
                <p>{t("termsAndConditions.welcome")}</p>

                {/* Introduction Section */}
                <h2 className="text-xl font-semibold mt-5">{t("termsAndConditions.introduction.header")}</h2>
                <p>{t("termsAndConditions.introduction.content")}</p>

                {/* Intellectual Property Section */}
                <h2 className="text-xl font-semibold mt-5">{t("termsAndConditions.intellectualProperty.header")}</h2>
                <p>{t("termsAndConditions.intellectualProperty.content")}</p>

                {/* User Accounts Section */}
                <h2 className="text-xl font-semibold mt-5">{t("termsAndConditions.userAccounts.header")}</h2>
                <p>{t("termsAndConditions.userAccounts.content")}</p>

                {/* Limitation of Liability Section */}
                <h2 className="text-xl font-semibold mt-5">{t("termsAndConditions.limitationOfLiability.header")}</h2>
                <p>{t("termsAndConditions.limitationOfLiability.content")}</p>

                {/* Links to Other Sites Section */}
                <h2 className="text-xl font-semibold mt-5">{t("termsAndConditions.linksToOtherSites.header")}</h2>
                <p>{t("termsAndConditions.linksToOtherSites.content")}</p>

                {/* Changes to Terms Section */}
                <h2 className="text-xl font-semibold mt-5">{t("termsAndConditions.changesToTerms.header")}</h2>
                <p>{t("termsAndConditions.changesToTerms.content")}</p>

                {/* Governing Law Section */}
                <h2 className="text-xl font-semibold mt-5">{t("termsAndConditions.governingLaw.header")}</h2>
                <p>{t("termsAndConditions.governingLaw.content")}</p>

                {/* Contact Us Section */}
                <p className="mt-5">{t("termsAndConditions.contactUs")}</p>
                <Link to="/contact" className="text-blue-500 underline">{t("Contact us")}</Link>
            </div>
        </>
    );
};

export default TermsAndConditions;
