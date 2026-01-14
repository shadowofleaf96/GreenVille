import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import MetaData from "../../components/MetaData";
import LazyImage from "../../../components/lazyimage/LazyImage";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const About = () => {
  const { t, i18n } = useTranslation();
  const { data: settings } = useSelector((state) => state.adminSettings);
  const aboutPage = settings?.about_page;

  const currentLang = i18n.language;

  const abouts =
    aboutPage?.items?.length > 0
      ? aboutPage.items.map((item) => ({
          icon: (
            <Iconify
              icon={item.icon || "material-symbols-light:eco-outline-rounded"}
              width={60}
              height={60}
            />
          ),
          title: item.title?.[currentLang] || "",
          description: item.description?.[currentLang] || "",
        }))
      : [
          {
            icon: (
              <Iconify
                icon="material-symbols-light:eco-outline-rounded"
                width={60}
                height={60}
              />
            ),
            title: t("about.fastDelivery"),
            description: t("about.fastDeliveryDesc"),
          },
          {
            icon: (
              <Iconify
                icon="material-symbols-light:verified-user-outline-rounded"
                width={60}
                height={60}
              />
            ),
            title: t("about.cashBack"),
            description: t("about.cashBackDesc"),
          },
          {
            icon: (
              <Iconify
                icon="material-symbols-light:temp-preferences-eco-outline-rounded"
                width={60}
                height={60}
              />
            ),
            title: t("about.premiumQuality"),
            description: t("about.premiumQualityDesc"),
          },
          {
            icon: (
              <Iconify
                icon="material-symbols-light:support-agent-rounded"
                width={60}
                height={60}
              />
            ),
            title: t("about.customerSupport"),
            description: t("about.customerSupportDesc"),
          },
        ];

  const { ref: aboutRef, inView: aboutInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const { ref: whyUsRef, inView: whyUsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Fragment>
      <MetaData title={t("about.title")} description={t("about.description")} />

      {/* Hero / Intro Section */}
      <section
        className="py-20 md:py-32 bg-white overflow-hidden"
        ref={aboutRef}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            {/* Image Side */}
            <motion.div
              className="w-full md:w-1/2 relative"
              variants={fadeInVariants}
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 aspect-4/3 group">
                <LazyImage
                  src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/60f4d65bbc8d4b945becdec497945657"
                  alt="About Us"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
              </div>
              {/* Floating Decoration */}
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
            </motion.div>

            {/* Content Side */}
            <motion.div
              className="w-full md:w-1/2 text-center md:text-left rtl:md:text-right"
              variants={fadeInVariants}
              initial="hidden"
              animate={aboutInView ? "visible" : "hidden"}
            >
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight uppercase mb-6">
                {aboutPage?.title?.[currentLang] || t("about.title")}
              </h2>

              <div className="flex items-center justify-center md:justify-start rtl:md:justify-end gap-3 mb-8">
                <h3 className="text-xl lg:text-2xl font-bold text-gray-500 uppercase tracking-widest">
                  {aboutPage?.subtitle?.[currentLang] +
                    " " +
                    settings?.website_title?.[currentLang]}
                </h3>
              </div>

              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10">
                {aboutPage?.description?.[currentLang] ||
                  t("about.description")}
              </p>

              <Button
                size="lg"
                className="rounded-2xl h-14 px-10 text-base uppercase font-black tracking-widest shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
                asChild
              >
                <Link to="/contact">{t("about.contactButton")}</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-gray-50/50" ref={whyUsRef}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={fadeInVariants}
            initial="hidden"
            animate={whyUsInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tight uppercase mb-4">
              {t("about.whyUsTitle")}
            </h2>
            <div className="w-24 h-1.5 bg-primary rounded-full mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {abouts.map((about, index) => (
              <motion.div
                key={index}
                variants={fadeInVariants}
                initial="hidden"
                animate={whyUsInView ? "visible" : "hidden"}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-4xl p-8 shadow-lg shadow-gray-100/50 border border-gray-100 flex flex-col items-center text-center group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <span className="transform scale-110">{about.icon}</span>
                </div>
                <h5 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-3">
                  {about.title}
                </h5>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {about.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default About;
