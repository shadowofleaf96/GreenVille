import React from 'react';
import { useTranslation } from 'react-i18next';
import MetaData from '../../components/MetaData';

const ShippingAndDeliveryPolicy = () => {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-10 px-4">
            <MetaData title={t("shippingAndDeliveryPolicy.title")} />
            <h1 className="text-3xl font-bold text-center mb-6">{t("shippingAndDeliveryPolicy.title")}</h1>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t("shippingAndDeliveryPolicy.shippingInformation.title")}</h2>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.shippingInformation.description")}
                </p>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.shippingInformation.orderProcessing")}
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t("shippingAndDeliveryPolicy.deliveryTimes.title")}</h2>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.deliveryTimes.description")}
                </p>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.deliveryTimes.note")}
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t("shippingAndDeliveryPolicy.shippingRates.title")}</h2>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.shippingRates.description")}
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t("shippingAndDeliveryPolicy.orderTracking.title")}</h2>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.orderTracking.description")}
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t("shippingAndDeliveryPolicy.internationalShipping.title")}</h2>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.internationalShipping.description")}
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">{t("shippingAndDeliveryPolicy.contactUs.title")}</h2>
                <p className="text-gray-700 mb-4">
                    {t("shippingAndDeliveryPolicy.contactUs.description", {
                        email: "support@greenville.com",
                        phone: "+212 6 1234 5678"
                    })}
                </p>
            </section>

            <p className="text-center text-lg font-semibold mt-8">{t("shippingAndDeliveryPolicy.thankYou")}</p>
        </div>
    );
};

export default ShippingAndDeliveryPolicy;