import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MetaData from "../../components/MetaData";

const ShippingAndDeliveryPolicy = () => {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSelector((state) => state.adminSettings);
  const shippingPolicy = settings?.policies?.shipping;
  const contactPage = settings?.contact_page;

  if (
    (settings?.policies && settings.policies.isActive === false) ||
    shippingPolicy?.isActive === false
  ) {
    return null;
  }

  const currentLang = i18n.language;

  return (
    <div className="container mx-auto px-4 py-8">
      <MetaData title={t("shipping_delivery.title")} />
      <h1 className="text-3xl font-bold mb-6 text-center">
        {t("shipping_delivery.title")}
      </h1>

      <div className="prose max-w-none whitespace-pre-wrap">
        {shippingPolicy?.text?.[currentLang] || (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("shippingAndDeliveryPolicy.shippingInformation.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("shippingAndDeliveryPolicy.shippingInformation.description")}
              </p>
              <p className="text-gray-700 mb-4">
                {t(
                  "shippingAndDeliveryPolicy.shippingInformation.orderProcessing",
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("shippingAndDeliveryPolicy.deliveryTimes.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("shippingAndDeliveryPolicy.deliveryTimes.description")}
              </p>
              <p className="text-gray-700 mb-4">
                {t("shippingAndDeliveryPolicy.deliveryTimes.note")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("shippingAndDeliveryPolicy.shippingRates.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("shippingAndDeliveryPolicy.shippingRates.description")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("shippingAndDeliveryPolicy.orderTracking.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("shippingAndDeliveryPolicy.orderTracking.description")}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("shippingAndDeliveryPolicy.internationalShipping.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t(
                  "shippingAndDeliveryPolicy.internationalShipping.description",
                )}
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                {t("shippingAndDeliveryPolicy.contactUs.title")}
              </h2>
              <p className="text-gray-700 mb-4">
                {t("shippingAndDeliveryPolicy.contactUs.description", {
                  email: contactPage?.email || "",
                  phone: contactPage?.phone || "",
                })}
              </p>
            </section>

            <p className="text-center text-lg font-semibold mt-8">
              {t("shippingAndDeliveryPolicy.thankYou")}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ShippingAndDeliveryPolicy;
