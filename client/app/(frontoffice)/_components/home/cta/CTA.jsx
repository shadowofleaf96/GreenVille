import Link from "next/link";
import { useTranslation } from "react-i18next";
import Iconify from "@/components/shared/iconify";
import { useSelector } from "react-redux";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  fadeInUp,
  staggerContainer,
  scaleIn,
  hoverScale,
} from "@/utils/animations";

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
    en: "Experience nature's finest selections, crafted with care for your health and the environment.",
    fr: "Découvrez les meilleures sélections de la nature, élaborées avec soin pour votre santé et l'environnement.",
    ar: "جرب أرقى مختارات الطبيعة ، المصنوعة بعناية لصحتك وبيئتك.",
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
  const { i18n, t } = useTranslation();
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

  if (loading) return null;

  return (
    <section className="relative py-24 overflow-hidden select-none">
      {/* Background Aesthetic: Mesh Gradient Mesh */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--color-primary-rgb),0.05)_0%,transparent_70%)] opacity-60" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] -ml-48 -mb-48" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center text-center">
          {/* Logo Container - Floating Glass */}
          <motion.div {...scaleIn} className="relative mb-12">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex items-center justify-center p-4 sm:p-6 overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <LazyImage
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                src={ctaData.logo_image}
                alt="Logo"
              />
            </div>
          </motion.div>

          {/* Typography: Visionary Header */}
          <motion.h2
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.2 }}
            className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-gray-900 leading-[0.95] tracking-tight mb-8 uppercase"
          >
            <span className="text-gray-400">
              {ctaData.title_part1?.[currentLang] || ctaData.title_part1?.en}
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-primary/60">
              {ctaData.title_part2?.[currentLang] || ctaData.title_part2?.en}
            </span>
          </motion.h2>

          {/* Description */}
          <motion.p
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.4 }}
            className="text-gray-500 text-sm sm:text-lg lg:text-xl font-medium max-w-2xl mb-14 leading-relaxed italic"
          >
            "{ctaData.description?.[currentLang] || ctaData.description?.en}"
          </motion.p>

          {/* Actions: High-End CTAs */}
          <motion.div
            {...fadeInUp}
            transition={{ ...fadeInUp.transition, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <Button
              variant="premium"
              className="h-16 sm:h-20 px-10 sm:px-12 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:scale-105 active:scale-95 transition-all group overflow-hidden"
              asChild
            >
              <Link href={`/${ctaData.primary_button_link}` || "#"}>
                <span className="relative z-10 flex items-center gap-3">
                  {ctaData.primary_button_text?.[currentLang] ||
                    ctaData.primary_button_text?.en}
                  <Iconify
                    icon="solar:arrow-right-bold-duotone"
                    width={22}
                    className="group-hover:translate-x-1 transition-transform rtl:rotate-180"
                  />
                </span>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-16 sm:h-20 px-10 sm:px-12 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-[0.2em] border-2 border-gray-100 bg-white/50 backdrop-blur-sm hover:bg-gray-50 hover:border-gray-200 hover:scale-105 transition-all"
              asChild
            >
              <Link href={`/${ctaData.secondary_button_link}` || "#"}>
                {ctaData.secondary_button_text?.[currentLang] ||
                  ctaData.secondary_button_text?.en}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
