import React, { Fragment } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import Navbar from "../../components/header/Navbar";
import Footer from "../../components/footer/Footer";
import MetaData from "../../components/MetaData";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const Contact = () => {
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [infoRef, infoInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Fragment>
      <MetaData title={"Contact"} />
      <div className="font-[sans-serif] max-w-6xl mx-auto relative overflow-hidden">

        <motion.div
          className="grid md:grid-cols-2 gap-8 py-8 px-6"
          variants={fadeInVariants}
          initial="hidden"
          animate={formInView ? "visible" : "hidden"}
          ref={formRef}
        >
          <div className="text-center flex flex-col items-center justify-center">
            <img
              src="../../../../assets/contact.webp"
              className="shrink-0 w-5/6"
            />
          </div>

          <form className="rounded-tl-3xl rounded-bl-3xl">
            <h2 className="text-2xl underline decoration-green-400 decoration-4 underline-offset-8 font-semibold text-center mb-6">
              Contact us
            </h2>
            <div className="max-w-md mx-auto space-y-3 relative">
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent"
              />
              <input
                type="email"
                placeholder="Phone No."
                className="w-full bg-gray-100 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent"
              />
              <textarea
                placeholder="Message"
                rows="6"
                className="w-full bg-gray-100 rounded-md px-4 text-sm pt-3 outline-green-400 focus-within:bg-transparent"
              ></textarea>
              <input
                id="checkbox1"
                type="checkbox"
                className="w-4 h-4 mr-3 accent-green-400"
              />
              <label
                htmlFor="checkbox1"
                className="text-sm text-gray-600"
              >
                I agree to the{" "}
                <Link to="" className="underline">Terms and Conditions</Link> and{" "}
                <Link to="" className="underline">Privacy Policy</Link>
              </label>
              <button
                type="button"
                className="text-white w-full relative bg-[#8DC63F] shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400 rounded-md text-sm px-6 py-3 !mt-6"
              >
                Send Message
              </button>
            </div>
          </form>
        </motion.div>

        <hr className="m-4" />

        <motion.div
          className="my-8 py-6 grid md:grid-cols-2 items-center overflow-hidden max-w-6xl mx-auto font-[sans-serif]"
          variants={fadeInVariants}
          initial="hidden"
          animate={infoInView ? "visible" : "hidden"}
          ref={infoRef}
        >
          <div className="p-8">
            <h2 className="text-2xl font-semibold underline decoration-green-400 decoration-4 underline-offset-8">
              Get In Touch
            </h2>
            <p className="text-sm text-gray-600 mt-4 leading-relaxed">
              Moroccan E-shop provides all kinds of organic goods, and our services are designed and made to fit into your healthy lifestyles.
            </p>
            <ul className="mt-8 mb-6 md:mb-0">
              <li className="flex">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#8DC63F] text-gray-50">
                  <Iconify icon="eva:pin-outline" className="h-6 w-6" />
                </div>
                <div className="ml-4 mb-4">
                  <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900">Our Address</h3>
                  <p className="text-gray-600">Centre ville, Casablanca</p>
                  <p className="text-gray-600">Morocco</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#8DC63F] text-gray-50">
                  <Iconify icon="eva:phone-outline" className="h-6 w-6" />
                </div>
                <div className="ml-4 mb-4">
                  <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900">Contact</h3>
                  <p className="text-gray-600">Mobile: 0608345687</p>
                  <p className="text-gray-600">Mail: contact@greenville.ma</p>
                </div>
              </li>
              <li className="flex">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#8DC63F] text-gray-50">
                  <Iconify icon="eva:clock-outline" className="h-6 w-6" />
                </div>
                <div className="ml-4 mb-4">
                  <h3 className="mb-2 text-lg font-medium leading-6 text-gray-900">Working hours</h3>
                  <p className="text-gray-600">Monday - Friday: 08:00 - 19:00</p>
                  <p className="text-gray-600">Saturday &amp; Sunday: 08:00 - 12:00</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="z-10 relative h-full">
            <iframe
              src="https://maps.google.com/maps?q=casablanca&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="left-0 top-0 h-full w-full max-w-lg rounded-lg"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default Contact;
