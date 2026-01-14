import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";

const Announcement = () => {
  const { data: settings } = useSelector((state) => state.adminSettings);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const announcement = settings?.announcement;
  const shippingConfig = settings?.shipping_config;

  const hasAnnouncement =
    announcement &&
    announcement.isActive &&
    announcement.text?.[currentLanguage];
  const hasFreeShipping =
    shippingConfig && shippingConfig.free_shipping_enabled;

  if (!hasAnnouncement && !hasFreeShipping) {
    return null;
  }

  return (
    <div className="flex bg-linear-to-r from-primary to-secondary justify-center p-3">
      <span className="text-md sm:text-lg font-black text-white tracking-tight uppercase text-center">
        {hasAnnouncement ? (
          announcement?.text?.[currentLanguage]
        ) : (
          <>
            {t("FREE STANDARD SHIPPING ON ORDERS OVER")}{" "}
            {shippingConfig.free_shipping_threshold} DH
          </>
        )}
      </span>
    </div>
  );
};

export default Announcement;
