"use client";

import { Fragment } from "react";
import { useSelector } from "react-redux";
import { useProducts } from "@/services/api/product.queries";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Loader from "./_components/loader/Loader";

import Banner from "./_components/home/banner/Banner";
import Category from "./_components/home/category/Category";
import FlashSales from "./_components/home/promo/FlashSales";
import Benefits from "./_components/home/benefits/Benefits";
import Testimonials from "./_components/home/testimonials/Testimonials";
import CTA from "./_components/home/cta/CTA";
import CTA2 from "./_components/home/cta/CTA2";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { i18n, t } = useTranslation();

  const { data: productsData, isLoading: loading } = useProducts({
    limit: 50,
    status: "true",
  });
  const products = productsData?.data || [];

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
  };

  const slideIn = (isRTL) => ({
    hidden: { x: isRTL ? 100 : -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 1 } },
  });

  const [bannerRef, bannerInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [categoryRef, categoryInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [ctaRef, ctaInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [cta2Ref, cta2InView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [fsRef, fsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [benefitsRef, benefitsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { data: settings } = useSelector((state) => state.adminSettings);

  return (
    <Fragment>
      {settings?.banner_active !== false && (
        <motion.div
          ref={bannerRef}
          initial="hidden"
          animate={bannerInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <Banner />
        </motion.div>
      )}

      {settings?.benefits_active !== false && (
        <motion.div
          ref={benefitsRef}
          initial="hidden"
          animate={benefitsInView ? "visible" : "hidden"}
          variants={slideIn}
        >
          <Benefits />
        </motion.div>
      )}

      {settings?.home_categories_active !== false && (
        <>
          <hr />
          <motion.div
            ref={categoryRef}
            initial="hidden"
            animate={categoryInView ? "visible" : "hidden"}
            variants={fadeIn}
          >
            <Category />
          </motion.div>
        </>
      )}

      {settings?.cta?.isActive !== false && (
        <>
          <hr />
          <motion.div
            ref={ctaRef}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={slideIn}
          >
            <CTA />
          </motion.div>
        </>
      )}

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

      {settings?.cta2?.isActive !== false && (
        <>
          <motion.div
            ref={cta2Ref}
            initial="hidden"
            animate={cta2InView ? "visible" : "hidden"}
            variants={slideIn}
          >
            <CTA2 />
          </motion.div>
          <hr />
        </>
      )}
      {settings?.testimonials_active !== false && (
        <>
          <hr />
          <motion.div
            ref={testimonialsRef}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={slideIn(i18n.language === "ar")}
          >
            <Testimonials />
          </motion.div>
        </>
      )}
    </Fragment>
  );
}
