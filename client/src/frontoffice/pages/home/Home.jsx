import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Loader from "../../components/loader/Loader";
import MetaData from "../../components/MetaData";
import CTA from "../../../frontoffice/pages/home/cta/CTA";
import CTA2 from "../../../frontoffice/pages/home/cta/CTA2";
import Banner from "./banner/Banner";
import Category from "./category/Category";
import FlashSales from "./promo/FlashSales";
import TopDeals from "./promo/TopDeals";
import Benefits from "./benefits/Benefits";
import Testimonials from "./testimonials/Testimonials";
import { useTranslation } from "react-i18next";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);
  const { t } = useTranslation()

  useEffect(() => {
    if (products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, alert, error]);

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const slideIn = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  };

  const [bannerRef, bannerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [categoryRef, categoryInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [cta2Ref, cta2InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [fsRef, fsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [tdRef, tdInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Fragment>
      <MetaData
        title={t("HomeSEO")}
        description={t("HomeDescription")}
      />
      <motion.div
        ref={bannerRef}
        initial="hidden"
        animate={bannerInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <Banner />
      </motion.div>

      <motion.div
        ref={benefitsRef}
        initial="hidden"
        animate={benefitsInView ? "visible" : "hidden"}
        variants={slideIn}
      >
        <Benefits />
      </motion.div>

      <hr />

      <motion.div
        ref={categoryRef}
        initial="hidden"
        animate={categoryInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <Category />
      </motion.div>

      <hr />

      <motion.div
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={slideIn}
      >
        <CTA />
      </motion.div>

      <hr />

      {loading ? (
        <Loader />
      ) : (
        <motion.div
          ref={fsRef}
          initial="hidden"
          animate={fsInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <FlashSales products={products} />
        </motion.div>
      )}

      <hr />

      <motion.div
        ref={cta2Ref}
        initial="hidden"
        animate={cta2InView ? "visible" : "hidden"}
        variants={slideIn}
      >
        <CTA2 />
      </motion.div>

      <hr />

      {loading ? (
        <Loader />
      ) : (
        <motion.div
          ref={tdRef}
          initial="hidden"
          animate={tdInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <TopDeals products={products} />
        </motion.div>
      )}

      <hr />

      <motion.div
        ref={testimonialsRef}
        initial="hidden"
        animate={testimonialsInView ? "visible" : "hidden"}
        variants={slideIn}
      >
        <Testimonials />

      </motion.div>
    </Fragment>
  );
};

export default Home;
