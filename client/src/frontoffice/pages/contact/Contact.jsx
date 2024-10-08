import React, { Fragment, useState } from "react";
import Iconify from "../../../backoffice/components/iconify";
import { Link } from "react-router-dom";
import MetaData from "../../components/MetaData";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useForm } from "react-hook-form";
import createAxiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";
import { LoadingButton } from "@mui/lab";

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } },
};

const Contact = () => {
  const [formRef, formInView] = useInView({ triggerOnce: true, threshold: 0.2 });
  const [infoRef, infoInView] = useInView({ triggerOnce: true, threshold: 0.2 });

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const agreeToTerms = watch("agreeToTerms");

  const onSubmit = async (data) => {
    if (!agreeToTerms) {
      toast.error("You must agree to the terms and conditions");
      return;
    }

    setLoading(true);

    const sanitizedData = {
      name: DOMPurify.sanitize(data.name),
      email: DOMPurify.sanitize(data.email),
      phone_number: DOMPurify.sanitize(data.phone_number),
      message: DOMPurify.sanitize(data.message),
    };

    try {
      const axiosInstance = createAxiosInstance("customer");
      const response = await axiosInstance.post("/contact", sanitizedData);
      toast.success("Message sent successfully!");
      reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
              alt="Contact"
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-tl-3xl rounded-bl-3xl">
            <h2 className="text-2xl underline decoration-green-400 decoration-4 underline-offset-8 font-semibold text-center mb-6">
              Contact us
            </h2>
            <div className="max-w-md mx-auto space-y-3 relative">
              <input
                type="text"
                placeholder="Name"
                {...register("name", { required: "Name is required" })}
                className="w-full bg-gray-200 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

              <input
                type="email"
                placeholder="Email"
                {...register("email", { required: "Email is required" })}
                className="w-full bg-gray-200 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              <input
                type="text"
                placeholder="Phone No."
                {...register("phone_number", { required: "Phone number is required" })}
                className="w-full bg-gray-200 rounded-md py-3 px-4 text-sm outline-green-400 focus-within:bg-transparent"
              />
              {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number.message}</p>}

              <textarea
                placeholder="Message"
                rows="6"
                {...register("message", { required: "Message is required" })}
                className="w-full bg-gray-200 rounded-md px-4 text-sm pt-3 outline-green-400 focus-within:bg-transparent"
              ></textarea>
              {errors.message && <p className="text-red-500 text-sm">{errors.message.message}</p>}

              <div className="flex items-center">
                <input
                  id="checkbox1"
                  type="checkbox"
                  {...register("agreeToTerms")}
                  className="w-4 h-4 mr-3 accent-green-400"
                />
                <label htmlFor="checkbox1" className="text-sm text-gray-600">
                  I agree to the
                  <Link to="/terms" className="underline"> Terms and Conditions</Link>
                </label>
              </div>

              <LoadingButton
                type="submit"
                fullWidth
                loading={loading}
                variant="contained"
                sx={{ fontWeight: 500, fontSize: 15 }}
                className="bg-[#8DC63F] text-white rounded-md text-sm px-6 !py-3 mt-6"
                loadingPosition="center"
              >
                {loading ? "Sending..." : "Send Message"}
              </LoadingButton>
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

          <div className="p-8">
            <iframe
              src="https://maps.google.com/maps?q=casablanca&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-md"
              title="Google Map of Casablanca"
            ></iframe>
          </div>
        </motion.div>
      </div>
    </Fragment>
  );
};

export default Contact;
