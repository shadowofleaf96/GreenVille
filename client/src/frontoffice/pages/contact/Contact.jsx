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
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import LazyImage from "../../../components/lazyimage/LazyImage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const fadeInVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Contact = () => {
  const [formRef, formInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  const [infoRef, infoInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      agreeToTerms: false,
    },
  });

  const [loading, setLoading] = useState(false);
  const agreeToTerms = watch("agreeToTerms");
  const { t, i18n } = useTranslation();
  const { data: settings } = useSelector((state) => state.adminSettings);
  const contactPage = settings?.contact_page;
  const currentLang = i18n.language;

  const formatPhone = (phone) => {
    let sanitized = phone.replace(/\D/g, "");
    if (sanitized.startsWith("00212")) {
      sanitized = "0" + sanitized.slice(5);
    } else if (sanitized.startsWith("212")) {
      sanitized = "0" + sanitized.slice(3);
    }
    if (sanitized && !sanitized.startsWith("0")) {
      sanitized = "0" + sanitized;
    }
    return sanitized;
  };

  const onSubmit = async (data) => {
    if (!agreeToTerms) {
      toast.error(t("You must agree to the terms and conditions"));
      return;
    }

    setLoading(true);

    const sanitizedData = {
      name: DOMPurify.sanitize(data.name),
      email: DOMPurify.sanitize(data.email),
      phone_number: DOMPurify.sanitize(formatPhone(data.phone_number)),
      message: DOMPurify.sanitize(data.message),
    };

    try {
      const axiosInstance = createAxiosInstance("customer");
      await axiosInstance.post("/contact", sanitizedData);
      toast.success(t("Message sent successfully!"));
      reset();
    } catch (error) {
      toast.error(t("Failed to send message. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <MetaData
        title={t("contactTitle") || "Contact Us"}
        description={
          t("contactDescription") ||
          "Get in touch with Greenville luxury selection."
        }
      />

      <div className="min-h-screen bg-gray-50/50 xs:pt-6 sm:pt-8 md:pt-12 lg:pt-16 xs:pb-8 sm:pb-12 md:pb-16 lg:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          {/* Hero & Form Section */}
          <motion.div
            ref={formRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <div className="relative group text-center lg:text-left space-y-8 order-2 lg:order-1">
              <div className="absolute -inset-10 bg-primary/5 blur-3xl rounded-full scale-150 -z-10 animate-pulse" />
              <div className="space-y-4">
                <Badge className="bg-primary/5 text-primary font-black text-[10px] uppercase tracking-[0.2em] px-4 py-1.5 border-none">
                  {t("Connect With Us")}
                </Badge>
                <h1 className="text-5xl font-black text-gray-900 tracking-tight uppercase leading-[1.1]">
                  {t("Have a specific request?")}
                </h1>
                <p className="text-lg font-bold text-gray-400 italic max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  {t(
                    "Discover our exceptional customer service tailored to your most distinguished expectations.",
                  )}
                </p>
              </div>

              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <LazyImage
                  src="https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/0795f22ca97561d128ebfe91961e1384"
                  className="w-full max-w-md mx-auto relative z-10 transition-transform duration-700 group-hover:scale-105"
                  alt="Contact"
                />
              </div>
            </div>

            <Card className="order-1 lg:order-2 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
              <CardContent className="p-10 md:p-12 space-y-10">
                <div className="space-y-2 text-center">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight uppercase">
                    {t("Contact us")}
                  </h2>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    {t("Response within 24 distinguished hours")}
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        {t("Full Name")}
                      </Label>
                      <Input
                        placeholder={t("Your Name")}
                        {...register("name", {
                          required: t("Name is required"),
                        })}
                        className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                          errors.name ? "border-red-500" : ""
                        }`}
                      />
                      {errors.name && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                          {t("Email")}
                        </Label>
                        <Input
                          type="email"
                          placeholder={t("Your Email")}
                          {...register("email", {
                            required: t("Email is required"),
                          })}
                          className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                            errors.email ? "border-red-500" : ""
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                          {t("Phone")}
                        </Label>
                        <Input
                          placeholder={t("Phone No.")}
                          {...register("phone_number", {
                            required: t("Phone is required"),
                            onChange: (e) => {
                              e.target.value = e.target.value.replace(
                                /\D/g,
                                "",
                              );
                            },
                          })}
                          className={`h-14 rounded-2xl border-gray-100 bg-gray-50/50 px-6 focus:bg-white focus:ring-primary/20 transition-all font-medium ${
                            errors.phone_number ? "border-red-500" : ""
                          }`}
                        />
                        {errors.phone_number && (
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                            {errors.phone_number.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">
                        {t("Message")}
                      </Label>
                      <Textarea
                        placeholder={t(
                          "How can we assist your distinguished needs?",
                        )}
                        rows={6}
                        {...register("message", {
                          required: t("Message is required"),
                        })}
                        className={`rounded-2xl border-gray-100 bg-gray-50/50 p-6 focus:bg-white focus:ring-primary/20 transition-all font-medium italic resize-none ${
                          errors.message ? "border-red-500" : ""
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mt-1 ml-1">
                          {errors.message.message}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 px-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) =>
                          setValue("agreeToTerms", !!checked)
                        }
                        className="rounded-lg w-6 h-6 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label
                        htmlFor="agreeToTerms"
                        className="text-[10px] font-black text-gray-500 uppercase tracking-widest leading-relaxed cursor-pointer select-none"
                      >
                        {t("I agree to the")}{" "}
                        <Link
                          to="/terms"
                          className="text-primary hover:underline"
                        >
                          {t("Terms and Conditions")}
                        </Link>
                      </Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-16 rounded-4xl bg-gray-900 text-white font-black text-base uppercase tracking-widest shadow-2xl shadow-gray-200 hover:bg-black transition-all gap-4 border-none"
                  >
                    {loading ? (
                      <>
                        <Iconify icon="svg-spinners:ring-resize" width={24} />
                        {t("Sending...")}
                      </>
                    ) : (
                      <>
                        <Iconify icon="solar:letter-bold-duotone" width={24} />
                        {t("Send Message")}
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info & Map Section */}
          <motion.div
            ref={infoRef}
            variants={fadeInVariants}
            initial="hidden"
            animate={infoInView ? "visible" : "hidden"}
            className="grid lg:grid-cols-2 gap-16"
          >
            <div className="p-10 md:p-12 bg-white rounded-[3rem] shadow-xl border border-gray-100 space-y-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                  {t("Get In Touch")}
                </h2>
                <p className="text-sm font-bold text-gray-400 leading-relaxed italic">
                  {t(
                    "Our dedicated consultants are at your disposal for any professional inquiry or selection assistance.",
                  )}
                </p>
              </div>

              <div className="space-y-10">
                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <Iconify icon="solar:map-point-bold-duotone" width={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                      {t("Our Address")}
                    </h3>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest space-y-1 italic">
                      <p>
                        {contactPage?.address?.[currentLang] ||
                          t("Luxury Boulevard, Dist. 1")}
                      </p>
                      <p>
                        {contactPage?.address_city?.[currentLang] ||
                          t("Casablanca, Morocco")}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <Iconify
                      icon="solar:phone-calling-bold-duotone"
                      width={32}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                      {t("Contact Direct")}
                    </h3>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest space-y-1 italic">
                      <p>
                        <span className="text-primary/60 not-italic font-black pr-2">
                          M.
                        </span>{" "}
                        {contactPage?.phone || "+212 608 345 687"}
                      </p>
                      <p>
                        <span className="text-primary/60 not-italic font-black pr-2">
                          E.
                        </span>{" "}
                        {contactPage?.email || "support@greenville.ma"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-8 group">
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
                    <Iconify
                      icon="solar:clock-circle-bold-duotone"
                      width={32}
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
                      {t("Concierge Hours")}
                    </h3>
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-widest space-y-2 italic">
                      <div className="flex justify-between w-full max-w-xs gap-4">
                        <span>{t("Mon - Fri")}</span>
                        <span className="text-gray-900 not-italic font-black">
                          {contactPage?.working_hours?.mon_fri ||
                            "08:00 - 19:00"}
                        </span>
                      </div>
                      <div className="flex justify-between w-full max-w-xs gap-4">
                        <span>{t("Sat & Sun")}</span>
                        <span className="text-gray-900 not-italic font-black">
                          {contactPage?.working_hours?.sat_sun ||
                            "08:00 - 12:00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden relative min-h-[500px] lg:min-h-full">
              <iframe
                src={
                  contactPage?.google_maps_link ||
                  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.8463510594!2d-7.6322!3d33.5898!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM1JzIzLjMiTiA3wrAzNyc1NS45Ilc!5e0!3m2!1sen!2sma!4v1700000000000!5m2!1sen!2sma"
                }
                width="100%"
                height="100%"
                style={{
                  border: 0,
                  filter: "grayscale(1) contrast(1.2) opacity(0.8)",
                }}
                allowFullScreen
                loading="lazy"
                className="absolute inset-0"
                title="Google Map"
              ></iframe>
              <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-white via-white/80 to-transparent flex items-end justify-center pb-10">
                <div className="flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100">
                  <Iconify
                    icon="solar:map-point-hospital-bold-duotone"
                    width={20}
                    className="text-primary"
                  />
                  <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
                    {t("HQ: Casablanca Selection")}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Fragment>
  );
};

export default Contact;
