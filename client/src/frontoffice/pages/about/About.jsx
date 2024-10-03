import React, { Fragment } from "react";
import Iconify from "../../../backoffice/components/iconify";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/header/Navbar";
import { Link } from "react-router-dom";
import MetaData from "../../components/MetaData";
import { motion } from "framer-motion";
import { useInView } from 'react-intersection-observer';

const fadeInVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const About = () => {
  const abouts = [
    {
      icon: <Iconify icon="material-symbols-light:local-shipping-outline-rounded" width={60} height={60} />,
      title: "Fast Delivery",
      description: "Enjoy swift and complimentary delivery services.",
    },
    {
      icon: <Iconify icon="material-symbols-light:currency-exchange" width={60} height={60} />,
      title: "100% Cash Back Guarantee",
      description: "Shop with confidence knowing you're eligible for a full cash refund.",
    },
    {
      icon: <Iconify icon="material-symbols-light:workspace-premium-outline-rounded" width={60} height={60} />,
      title: "Premium Quality Products",
      description: "Discover excellence with our top-tier, quality-assured products.",
    },
    {
      icon: <Iconify icon="material-symbols-light:perm-phone-msg-outline-rounded" width={60} height={60} />,
      title: "24/7 Customer Support",
      description: "We're here for you around the clock. Contact us anytime for assistance.",
    },
  ];

  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: whyUsRef, inView: whyUsInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  
  return (
    <Fragment>
      <MetaData title={"About"} />
      <div className="py-8">
        <div className="container mx-auto px-4">
          <motion.div
            ref={aboutRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={aboutInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 my-8"
          >
            <div className="flex justify-center md:justify-start">
              <motion.img
                src="../../../../assets/about.webp"
                alt="About"
                className="max-w-md"
                variants={fadeInVariants}
              />
            </div>
            <motion.div className="my-auto" variants={fadeInVariants}>
              <div className="container mx-auto py-4">
                <h3 className="text-2xl font-semibold underline decoration-green-400 decoration-4 underline-offset-8">
                  About Us
                </h3>
              </div>
              <h4 className="flex items-end font-medium text-xl tracking-wide">
                We are{" "}
                <img
                  className="w-28 ml-1 h-auto flex items-start"
                  src="../../../../assets/logo-text.webp"
                />
              </h4>
              <p className="font-medium tracking-wide text-gray-600 mt-4">
                A collective of young entrepreneurs making their way to the world of E-commerce, promoting our local products, and working in depth with our community.
              </p>
              <Link to="/contact">
                <motion.button
                  className="mt-6 py-3 px-6 bg-[#8DC63F] text-white font-medium rounded-lg shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400"
                  variants={fadeInVariants}
                >
                  Contact Us
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <hr className="m-4" />

          {/* Why Us Section */}
          <motion.div
            ref={whyUsRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={whyUsInView ? "visible" : "hidden"}
            className="mt-12 mb-12"
          >
            <h3 className="text-center text-2xl font-semibold underline underline-offset-8 decoration-4 decoration-green-400 mb-8">
              Why Us?
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
                  <span className="flex justify-center mb-4 text-green-500">
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
