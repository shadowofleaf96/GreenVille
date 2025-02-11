import React, { Fragment } from "react";
import { useTranslation } from 'react-i18next';
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import MetaData from "../../components/MetaData";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const About = () => {
  const { t } = useTranslation();

  const abouts = [
    {
      icon: <Iconify icon="material-symbols-light:local-shipping-outline-rounded" width={60} height={60} />,
      title: t('about.fastDelivery'),
      description: t('about.fastDeliveryDesc'),
    },
    {
      icon: <Iconify icon="material-symbols-light:currency-exchange" width={60} height={60} />,
      title: t('about.cashBack'),
      description: t('about.cashBackDesc'),
    },
    {
      icon: <Iconify icon="material-symbols-light:workspace-premium-outline-rounded" width={60} height={60} />,
      title: t('about.premiumQuality'),
      description: t('about.premiumQualityDesc'),
    },
    {
      icon: <Iconify icon="material-symbols-light:perm-phone-msg-outline-rounded" width={60} height={60} />,
      title: t('about.customerSupport'),
      description: t('about.customerSupportDesc'),
    },
  ];

  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: whyUsRef, inView: whyUsInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Fragment>
      <MetaData title={t('about.title')} description={t('about.description')} />
      <div className="py-8">
        <div className="container mx-auto px-8">
          <motion.div
            ref={aboutRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 my-8"
          >
            <div className="flex justify-center md:justify-start">
              <motion.img
                src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/60f4d65bbc8d4b945becdec497945657"
                alt="About"
                className="max-w-xs md:max-w-md"
                variants={fadeInVariants}
              />
            </div>
            <motion.div className="my-auto flex flex-col items-center md:items-start" variants={fadeInVariants}>
              <h3 className="text-2xl font-semibold py-4 underline decoration-green-400 decoration-4 underline-offset-8">
                {t('about.title')}
              </h3>
              <h4 className="flex items-center font-medium text-xl tracking-wide">
                {t('about.subtitle')}{" "}
                <img
                  className="w-28 ml-1 h-auto"
                  src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/1f1c7b42092395de1674162dbc636e86"
                  alt="Logo"
                />
              </h4>

              <p className="font-medium tracking-wide text-gray-600 mt-4">
                {t('about.description')}
              </p>
              <Link to="/contact">
                <motion.button
                  className="mt-6 py-3 px-6 bg-[#8DC63F] text-white font-medium rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                  variants={fadeInVariants}
                >
                  {t('about.contactButton')}
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <hr className="m-4" />

          <motion.div
            ref={whyUsRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={whyUsInView ? "visible" : "hidden"}
            className="mt-12 mb-12"
          >
            <h3 className="text-center text-2xl font-semibold underline underline-offset-8 decoration-4 decoration-green-400 mb-8">
              {t('about.whyUsTitle')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {abouts.map((about, index) => (
                <motion.div
                  key={index}
                  ref={whyUsRef}
                  variants={fadeInVariants}
                  initial="hidden"
                  animate={whyUsInView ? "visible" : "hidden"}
                  className="p-4 text-center border-b-2 border-white hover:border-yellow-400 hover:shadow-lg transition rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="flex justify-center mb-4 text-[#8DC63F]">
                    {about.icon}
                  </span>
                  <h5 className="font-semibold mt-4">{about.title}</h5>
                  <p className="font-medium text-gray-600 mt-2">{about.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Fragment>
  );
};

export default About;
