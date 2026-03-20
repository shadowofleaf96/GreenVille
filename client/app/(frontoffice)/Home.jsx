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
import { fadeInUp, premiumTransition } from "@/utils/animations";

export default function Home() {
  const { i18n, t } = useTranslation();

  const { data: productsData, isLoading: loading } = useProducts({
    limit: 50,
    status: "true",
  });
  const products = productsData?.data || [];

  // Standardized variants will be imported

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
          variants={fadeInUp}
          initial="initial"
          animate={bannerInView ? "animate" : "initial"}
        >
          <Banner />
        </motion.div>
      )}

      {settings?.benefits_active !== false && (
        <motion.div
          ref={benefitsRef}
          variants={fadeInUp}
          initial="initial"
          animate={benefitsInView ? "animate" : "initial"}
        >
          <Benefits />
        </motion.div>
      )}

      {settings?.home_categories_active !== false && (
        <>
          <hr />
          <motion.div
            ref={categoryRef}
            variants={fadeInUp}
            initial="initial"
            animate={categoryInView ? "animate" : "initial"}
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
            variants={fadeInUp}
            initial="initial"
            animate={ctaInView ? "animate" : "initial"}
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
          variants={fadeInUp}
          initial="initial"
          animate={fsInView ? "animate" : "initial"}
        >
          <FlashSales products={products} />
        </motion.div>
      )}

      <hr />

      {settings?.cta2?.isActive !== false && (
        <>
          <motion.div
            ref={cta2Ref}
            variants={fadeInUp}
            initial="initial"
            animate={cta2InView ? "animate" : "initial"}
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
            variants={fadeInUp}
            initial="initial"
            animate={testimonialsInView ? "animate" : "initial"}
          >
            <Testimonials />
          </motion.div>
        </>
      )}
    </Fragment>
  );
}
