import Link from "next/link";
import Iconify from "@/components/shared/iconify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { Button } from "@/components/ui/button";
import {
  fadeInUp,
  fadeInLeft,
  hoverScale,
  staggerContainer,
} from "@/utils/animations";

const defaultCTA2 = {
  heading: {
    en: "Pure Organic. \n Delivered Fresh.",
    fr: "Pur Bio. \n Livré frais.",
    ar: "عضوي نقي. \n يوصل طازج.",
  },
  paragraph: {
    en: "Elevate your lifestyle with our hand-picked organic selections. Straight from the farm to your doorstep with premium care.",
    fr: "Améliorez votre style de vie avec nos sélections biologiques triées sur le volet. Directement de la ferme à votre porte avec un soin premium.",
    ar: "ارتق بأسلوب حياتك مع مختاراتنا العضوية المختارة بعناية. مباشرة من المزرعة إلى عتبة داركم بعناية فائقة.",
  },
  link_text: {
    en: "Explore Catalog",
    fr: "Explorer le catalogue",
    ar: "استكشف الكتالوج",
  },
  link_url: "/products",
  images: [
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/0bca71897aa053232e6c77888dbd8b95",
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/b642bedbad44c86730a61fe43340f1c2",
  ],
};

const CTA2 = () => {
  const { i18n, t } = useTranslation();
  const { data: settings, loading } = useSelector(
    (state) => state.adminSettings,
  );

  const cta2Data = settings?.cta2
    ? {
        heading: settings.cta2.heading || defaultCTA2.heading,
        paragraph: settings.cta2.paragraph || defaultCTA2.paragraph,
        link_text: settings.cta2.link_text || defaultCTA2.link_text,
        link_url: settings.cta2.link_url || defaultCTA2.link_url,
        images:
          settings.cta2.images && settings.cta2.images.length > 0
            ? settings.cta2.images
            : defaultCTA2.images,
      }
    : defaultCTA2;

  const currentLang = i18n.language;

  if (loading) return null;

  return (
    <section className="relative py-24 overflow-hidden select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Visual Side - Image Spotlight */}
          <div className="flex-1 w-full relative">
            <motion.div
              {...fadeInLeft}
              className="relative aspect-square max-w-lg mx-auto"
            >
              {/* Decorative Glows */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 aspect-square bg-primary/20 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute inset-0 bg-linear-to-tr from-primary/10 to-transparent rounded-[3rem] -rotate-6" />

              <motion.div
                {...hoverScale}
                className="relative z-10 w-full h-full flex items-center justify-center pointer-events-auto cursor-pointer"
              >
                <LazyImage
                  className="w-full h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.2)]"
                  src={cta2Data.images[0]}
                  alt="Product Showcase"
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Content Side - Polished Glass Card */}
          <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
            <motion.div
              variants={staggerContainer(0.1, 0.2)}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.span
                variants={fadeInUp}
                className="inline-block px-4 py-1.5 mb-6 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/20"
              >
                {t("New Collection")}
              </motion.span>

              <motion.h2
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-[0.95] tracking-tight mb-8 uppercase whitespace-pre-line"
              >
                {cta2Data.heading?.[currentLang] || cta2Data.heading?.en}
              </motion.h2>

              <motion.p
                variants={fadeInUp}
                className="text-gray-500 text-base md:text-lg font-medium leading-relaxed max-w-xl mx-auto lg:mx-0 mb-10 italic"
              >
                {cta2Data.paragraph?.[currentLang] || cta2Data.paragraph?.en}
              </motion.p>

              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start"
              >
                <Button
                  variant="premium"
                  className="h-16 px-10 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 group"
                  asChild
                >
                  <Link href={cta2Data.link_url || "#"}>
                    <span className="flex items-center gap-3">
                      {cta2Data.link_text?.[currentLang] ||
                        cta2Data.link_text?.en}
                      <Iconify
                        icon="solar:minimalistic-magnifer-bold-duotone"
                        width={20}
                        className="group-hover:rotate-12 transition-transform"
                      />
                    </span>
                  </Link>
                </Button>

                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden"
                    >
                      <img
                        src={`https://i.pravatar.cc/100?u=${i}`}
                        alt="user"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-primary text-white text-[10px] font-black flex items-center justify-center">
                    +2k
                  </div>
                </div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest hidden sm:block">
                  Happy Customers
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA2;
