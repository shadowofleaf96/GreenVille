import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../../redux/frontoffice/productSlice";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import Loader from "../../components/loader/Loader";
import MetaData from "../../components/MetaData";
import CTA from "../../../frontoffice/pages/home/cta/CTA";
import Banner from "./banner/Banner";
import Category from "./category/Category";
import Promo from "./promo/Promo";
import Benefits from "./benefits/Benefits";

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector((state) => state.products);

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
  const [promoRef, promoInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [benefitsRef, benefitsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <Fragment>
      <MetaData title={"Home"} />

      <motion.div
        ref={bannerRef}
        initial="hidden"
        animate={bannerInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <Banner />
      </motion.div>

      <motion.div
        ref={categoryRef}
        initial="hidden"
        animate={categoryInView ? "visible" : "hidden"}
        variants={slideIn}
      >
        <Category />
      </motion.div>

      <hr />

      <motion.div
        ref={ctaRef}
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <CTA />
      </motion.div>

      <hr />

      {loading ? (
        <Loader />
      ) : (
        <motion.div
          ref={promoRef}
          initial="hidden"
          animate={promoInView ? "visible" : "hidden"}
          variants={fadeIn}
        >
          <Promo products={products} />
        </motion.div>
      )}

      <hr />

      <motion.div
        ref={benefitsRef}
        initial="hidden"
        animate={benefitsInView ? "visible" : "hidden"}
        variants={slideIn}
      >
        <Benefits />
      </motion.div>
    </Fragment>
  );
};

export default Home;
