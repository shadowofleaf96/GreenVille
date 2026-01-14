import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Iconify from "../../../../backoffice/components/iconify";
import { useSelector } from "react-redux";
import LazyImage from "../../../../components/lazyimage/LazyImage";
import { Button } from "@/components/ui/button";

const defaultCTA = {
  logo_image:
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/1f1c7b42092395de1674162dbc636e86",
  title_part1: { en: "Discover", fr: "Découvrez", ar: "اكتشف" },
  title_part2: {
    en: "the Power of Organic Living at",
    fr: "le pouvoir de la vie bio chez",
    ar: "قوة الحياة العضوية في",
  },
  description: {
    en: "",
    fr: "",
    ar: "",
  },
  primary_button_text: {
    en: "Shop Organic Now",
    fr: "Acheter bio maintenant",
    ar: "تسوق عضوي الآن",
  },
  secondary_button_text: {
    en: "Learn More",
    fr: "En savoir plus",
    ar: "معرفة المزيد",
  },
  primary_button_link: "products",
  secondary_button_link: "about",
};

export default function CTA() {
  const { i18n } = useTranslation();
  const { data: settings, loading } = useSelector(
    (state) => state.adminSettings,
  );

  const ctaData = settings?.cta
    ? {
        logo_image: settings.cta.logo_image || defaultCTA.logo_image,
        title_part1: settings.cta.title_part1 || defaultCTA.title_part1,
        title_part2: settings.cta.title_part2 || defaultCTA.title_part2,
        description: settings.cta.description || defaultCTA.description,
        primary_button_text:
          settings.cta.primary_button_text || defaultCTA.primary_button_text,
        secondary_button_text:
          settings.cta.secondary_button_text ||
          defaultCTA.secondary_button_text,
        primary_button_link:
          settings.cta.primary_button_link || defaultCTA.primary_button_link,
        secondary_button_link:
          settings.cta.secondary_button_link ||
          defaultCTA.secondary_button_link,
      }
    : defaultCTA;

  const currentLang = i18n.language;

  if (loading) {
    return (
      <section className="px-4 mt-6 mb-6 flex justify-center mx-4 md:mx-0 py-12">
        <p className="text-gray-500">Loading...</p>
      </section>
    );
  }

  return (
    <section className="px-4 mt-6 mb-6 flex justify-center mx-4 md:mx-0">
      <div className="w-full mx-auto text-left md:w-11/12 xl:w-9/12 md:text-center">
        <div className="flex flex-col justify-center items-center mb-6 text-3xl font-extrabold leading-tight tracking-normal text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl md:tracking-tight">
          <div className="flex flex-col w-full justify-center items-center">
            <span className="block text-center text-transparent bg-clip-text bg-linear-to-r from-primary to-secondary">
              <span className="text-black mr-2">
                {ctaData.title_part1?.[currentLang] ||
                  ctaData.title_part1?.en ||
                  ""}
              </span>
              {ctaData.title_part2?.[currentLang] ||
                ctaData.title_part2?.en ||
                ""}
            </span>

            <span className="flex justify-center items-center mt-4">
              <LazyImage
                className="h-12 w-auto bg-cover mx-2 sm:h-16 md:h-24 md:mx-4"
                src={ctaData.logo_image}
                alt="Logo"
              />
            </span>
          </div>
        </div>
        <p className="px-0 mb-6 text-base text-gray-600 sm:text-lg md:text-xl lg:px-24">
          {ctaData.description?.[currentLang] || ctaData.description?.en || ""}
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-0 md:space-x-4 md:flex-row md:mb-8">
          <Button variant="premium" className="h-14 px-8 text-base" asChild>
            <Link to={ctaData.primary_button_link || "#"}>
              {ctaData.primary_button_text?.[currentLang] ||
                ctaData.primary_button_text?.en ||
                ""}
              <Iconify
                icon="ep:right"
                width={20}
                height={20}
                className="ml-2 rtl:mr-2 rtl:rotate-180"
              />
            </Link>
          </Button>

          <Button variant="premium" className="h-14 px-8 text-base" asChild>
            <Link to={ctaData.secondary_button_link || "#"}>
              {ctaData.secondary_button_text?.[currentLang] ||
                ctaData.secondary_button_text?.en ||
                ""}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
