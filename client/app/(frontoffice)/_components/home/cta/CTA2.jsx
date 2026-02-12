import Link from "next/link";
import Iconify from "@/components/shared/iconify";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import { Button } from "@/components/ui/button";

const defaultCTA2 = {
  heading: {
    en: "Fresh Vegetables. \n Free Shipping!",
    fr: "LÃ©gumes frais. \n Livraison gratuite !",
    ar: "Ø®Ø¶Ø±ÙˆØ§Øª Ø·Ø§Ø²Ø¬Ø©. \n Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ!",
  },
  paragraph: {
    en: "Get fresh and organic vegetables delivered straight to your door with free shipping on all orders over 1500dh. Shop now and enjoy healthy eating made easy!",
    fr: "Obtenez des lÃ©gumes frais et biologiques livrÃ©s directement Ã  votre porte avec livraison gratuite sur toutes les commandes de plus de 1500dh. Achetez maintenant et profitez d'une alimentation saine facilitÃ©e!",
    ar: "Ø§Ø­ØµÙ„ Ø¹Ù„Ù‰ Ø®Ø¶Ø±ÙˆØ§Øª Ø·Ø§Ø²Ø¬Ø© ÙˆØ¹Ø¶ÙˆÙŠØ© ÙŠØªÙ… ØªÙˆØµÙŠÙ„Ù‡Ø§ Ù…Ø¨Ø§Ø´Ø±Ø© Ø¥Ù„Ù‰ Ø¨Ø§Ø¨ Ù…Ù†Ø²Ù„Ùƒ Ù…Ø¹ Ø´Ø­Ù† Ù…Ø¬Ø§Ù†ÙŠ Ø¹Ù„Ù‰ Ø¬Ù…ÙŠØ¹ Ø§Ù„Ø·Ù„Ø¨Ø§Øª Ø§Ù„ØªÙŠ ØªØ²ÙŠØ¯ Ø¹Ù† 1500 Ø¯Ø±Ù‡Ù…. ØªØ³ÙˆÙ‚ Ø§Ù„Ø¢Ù† ÙˆØ§Ø³ØªÙ…ØªØ¹ Ø¨ØªÙ†Ø§ÙˆÙ„ Ø·Ø¹Ø§Ù… ØµØ­ÙŠ Ø¨Ø³Ù‡ÙˆÙ„Ø©!",
  },
  link_text: {
    en: "Order Now",
    fr: "Commander maintenant",
    ar: "Ø§Ø·Ù„Ø¨ Ø§Ù„Ø¢Ù†",
  },
  link_url: "/products/655c721c82ea0f3d8fc1db2d",
  images: [
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/0bca71897aa053232e6c77888dbd8b95",
    "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/b642bedbad44c86730a61fe43340f1c2",
  ],
};

const CTA2 = () => {
  const { i18n } = useTranslation();
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

  if (loading) {
    return (
      <section
        aria-labelledby="cta2-heading"
        className="py-12 flex justify-center"
      >
        <p className="text-gray-500">Loading...</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="cta2-heading">
      <div className="overflow-hidden mt-2 lg:mt-8 mb-4 lg:mb-12 pt-4 mx-2 md:pt-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-gray-200 rounded-xl">
          <div className="relative flex flex-col lg:flex-row items-center gap-8 py-10 px-6 md:py-16">
            <div className="flex-1 text-center lg:text-left rtl:lg:text-right">
              <h2
                id="cta2-heading"
                className="text-3xl sm:text-4xl font-black tracking-tight text-primary md:text-5xl lg:text-6xl uppercase leading-tight"
              >
                {cta2Data.heading?.[currentLang] || cta2Data.heading?.en || ""}
              </h2>
              <p className="mt-6 text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {cta2Data.paragraph?.[currentLang] ||
                  cta2Data.paragraph?.en ||
                  ""}
              </p>
              <div className="mt-10">
                <Button
                  variant="premium"
                  className="h-14 px-8 text-base"
                  asChild
                >
                  <Link href={cta2Data.link_url || "#"}>
                    {cta2Data.link_text?.[currentLang] ||
                      cta2Data.link_text?.en ||
                      ""}
                    <Iconify
                      icon="solar:arrow-right-bold-duotone"
                      width={20}
                      className="ml-2 rtl:mr-2 rtl:rotate-180"
                    />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex-1 flex justify-center items-center w-full">
              {cta2Data.images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="relative w-full max-w-md aspect-square"
                >
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                  <LazyImage
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
                    src={cta2Data.images[0]}
                    alt="Fresh Vegetables"
                  />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA2;
