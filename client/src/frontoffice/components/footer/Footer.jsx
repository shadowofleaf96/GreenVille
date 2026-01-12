import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Iconify from "../../../backoffice/components/iconify";
import LazyImage from "../../../components/lazyimage/LazyImage";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { data: settings } = useSelector((state) => state.adminSettings);

  const footer = settings?.footer_settings;

  if (footer && footer.isActive === false) {
    return null;
  }
  return (
    <footer className="bg-white border-t border-gray-100 rounded-t-[3rem] sm:rounded-t-[4rem] relative z-10 -mt-10 overflow-hidden shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32">
          {/* Brand Section */}
          <div className="space-y-8 flex flex-col items-center lg:items-start">
            <Link
              to="/"
              className="group transition-transform duration-500 hover:scale-105"
            >
              <LazyImage
                className="w-40 h-auto grayscale hover:grayscale-0 transition-all duration-700"
                src={
                  settings?.logo_url ||
                  "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/8fbac764fe0d88e3ff18944c621294d5"
                }
                alt="logo"
              />
            </Link>

            <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm text-center lg:text-left rtl:lg:text-right italic">
              {footer?.description?.[currentLanguage] ||
                t("footer.description")}
            </p>

            <div className="flex gap-4">
              {[
                {
                  icon: "simple-icons:facebook",
                  href: settings?.social_links?.facebook,
                  label: "Facebook",
                },
                {
                  icon: "simple-icons:instagram",
                  href: settings?.social_links?.instagram,
                  label: "Instagram",
                },
                {
                  icon: "simple-icons:x",
                  href: settings?.social_links?.twitter,
                  label: "Twitter/X",
                },
              ]
                .filter((social) => social.href && social.href.trim() !== "")
                .map((social, i) => (
                  <Link
                    key={i}
                    to={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 group"
                    aria-label={social.label}
                  >
                    <Iconify
                      icon={social.icon}
                      width={20}
                      className="group-hover:scale-110 transition-transform"
                    />
                  </Link>
                ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 sm:gap-12">
            <div className="space-y-8">
              <h5 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">
                {t("footer.informations")}
              </h5>
              <ul className="space-y-4">
                {[
                  {
                    to: "/about",
                    label: t("footer.about_us"),
                    icon: "solar:info-circle-bold-duotone",
                  },
                  {
                    to: "/contact",
                    label: t("footer.contact"),
                    icon: "solar:phone-calling-bold-duotone",
                  },
                  ...(settings?.policies?.isActive !== false &&
                  settings?.policies?.refund?.isActive !== false
                    ? [
                        {
                          to: "/refund",
                          label: t("footer.refund_policy"),
                          icon: "solar:card-recive-bold-duotone",
                        },
                      ]
                    : []),
                  {
                    to: "/vendor/register",
                    label: t("footer.become_vendor"),
                    icon: "solar:shop-bold-duotone",
                  },
                ].map((item, i) => (
                  <li key={i}>
                    <Link
                      className="group flex items-center gap-3 text-sm font-bold text-gray-500 hover:text-primary transition-all duration-300"
                      to={item.to}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <Iconify icon={item.icon} width={16} />
                      </div>
                      <span className="tracking-tight">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em]">
                {t("footer.customer_services")}
              </h5>
              <ul className="space-y-4">
                <li>
                  <Link
                    className="group flex items-center gap-3 text-sm font-bold text-gray-500 hover:text-primary transition-all duration-300"
                    to="/profile"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                      <Iconify
                        icon="solar:user-circle-bold-duotone"
                        width={16}
                      />
                    </div>
                    <span className="tracking-tight">
                      {t("footer.my_account")}
                    </span>
                  </Link>
                </li>
                {settings?.policies?.isActive !== false && (
                  <>
                    {[
                      {
                        to: "/terms",
                        label: t("footer.terms_conditions"),
                        icon: "solar:document-text-bold-duotone",
                        active: settings?.policies?.terms?.isActive,
                      },
                      {
                        to: "/return",
                        label: t("footer.returns_exchanges"),
                        icon: "solar:refresh-bold-duotone",
                        active: settings?.policies?.returns?.isActive,
                      },
                      {
                        to: "/shippingpolicy",
                        label: t("footer.shipping_delivery"),
                        icon: "solar:delivery-bold-duotone",
                        active: settings?.policies?.shipping?.isActive,
                      },
                    ]
                      .filter((p) => p.active !== false)
                      .map((item, i) => (
                        <li key={i}>
                          <Link
                            className="group flex items-center gap-3 text-sm font-bold text-gray-500 hover:text-primary transition-all duration-300"
                            to={item.to}
                          >
                            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                              <Iconify icon={item.icon} width={16} />
                            </div>
                            <span className="tracking-tight">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="py-8 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-center px-8 gap-4">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] text-center sm:text-left rtl:sm:text-right">
          {footer?.copyright?.[currentLanguage] || t("footer.copyright")}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
