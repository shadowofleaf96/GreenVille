import { React, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import CircularLoader from "../../../components/loader/CircularLoader";
import { useTranslation } from "react-i18next";
import LazyImage from "../../../../components/lazyimage/LazyImage";
import Iconify from "../../../../backoffice/components/iconify/iconify";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";

import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion, useAnimation, useMotionValue } from "framer-motion";
import { useSelector } from "react-redux";

import { useSwiper } from "swiper/react";

// Internal component for mobile navigation controls
const MobileNav = () => {
  const swiper = useSwiper();
  return (
    <div className="flex items-center justify-between w-full md:hidden my-6 z-20 relative">
      <div
        onClick={() => swiper.slidePrev()}
        className="text-white hover:text-primary transition-colors cursor-pointer active:scale-90"
      >
        <Iconify
          icon="material-symbols-light:arrow-circle-left-rounded"
          width={40}
          height={40}
          className="drop-shadow-lg"
        />
      </div>
      <div
        onClick={() => swiper.slideNext()}
        className="text-white hover:text-primary transition-colors cursor-pointer active:scale-90"
      >
        <Iconify
          icon="material-symbols-light:arrow-circle-right-rounded"
          width={40}
          height={40}
          className="drop-shadow-lg"
        />
      </div>
    </div>
  );
};

const Banner = () => {
  const { t, i18n } = useTranslation();
  const [_, setInit] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { data: settings, loading } = useSelector(
    (state) => state.adminSettings,
  );

  const slidesData =
    settings?.banner_slides?.length > 0
      ? settings.banner_slides.map((slide, index) => ({
          id: index + 1,
          image: slide.image,
          title: slide.title,
          subtitle: slide.subtitle,
          description: slide.description,
          buttonText: slide.buttonText,
          link: slide.link || "/products",
        }))
      : [];

  const currentLang = i18n.language;
  const isRtl = currentLang === "ar";

  if (loading) {
    return (
      <div className="relative h-[85vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] flex items-center justify-center bg-gray-100">
        <CircularLoader />
      </div>
    );
  }

  return (
    <div className="relative h-[85vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] flex">
      <Swiper
        rewind={true}
        autoplay={{
          pauseOnMouseEnter: true,
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onInit={() => setInit(true)}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        dir={isRtl ? "rtl" : "ltr"}
        key={isRtl ? "rtl" : "ltr"}
        className="mySwiper h-full"
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <LazyImage
                src={slide.image}
                alt={slide.title?.[currentLang] || slide.title?.en}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ position: "absolute" }}
              />
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="container mx-auto px-4 sm:px-6 relative z-10 h-full flex items-center">
                <div className="flex flex-col items-center text-center space-y-0 md:flex-row md:items-start md:text-left rtl:md:items-end rtl:md:text-right w-full pt-10 md:pt-0">
                  <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center md:items-start rtl:md:items-end">
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      className="text-white font-black text-xs sm:text-sm md:text-base uppercase tracking-[0.3em] mb-6 md:mb-4 bg-primary/20 backdrop-blur-sm inline-block px-4 py-1 rounded-full border border-white/10"
                    >
                      {slide.subtitle?.[currentLang] ||
                        slide.subtitle?.en ||
                        ""}
                    </motion.p>
                    <motion.h1
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-black leading-tight tracking-widest my-6 md:mb-8 md:mt-0 uppercase"
                    >
                      {slide.title?.[currentLang] || slide.title?.en || ""}
                    </motion.h1>
                    {/* Mobile Navigation Buttons in flow */}
                    <MobileNav />
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/80 text-sm sm:text-base md:text-lg my-6 md:mb-10 md:mt-0 max-w-xl font-medium leading-relaxed"
                    >
                      {slide.description?.[currentLang] ||
                        slide.description?.en ||
                        ""}
                    </motion.p>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-4 md:mt-0"
                    >
                      <Link
                        className="flex bg-primary w-full sm:w-64 md:w-80 text-white py-4 md:py-5 px-8 rounded-full justify-center items-center shadow-2xl shadow-primary/30 transition-all hover:scale-105 active:scale-95 font-black uppercase tracking-widest text-sm mx-auto md:mx-0"
                        to={slide.link || "#"}
                      >
                        {slide.buttonText?.[currentLang] ||
                          slide.buttonText?.en ||
                          ""}
                        <Iconify
                          icon="solar:arrow-right-bold-duotone"
                          width={24}
                          className="ml-3 rtl:mr-3 rtl:rotate-180"
                        />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        ref={nextRef}
        className="hidden md:block absolute top-1/2 right-4 md:right-5 transform -translate-y-1/2 text-white z-10 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Iconify
          icon="material-symbols-light:arrow-circle-right-rounded"
          width={50}
          height={50}
          className="drop-shadow-lg"
        />
      </div>

      <div
        ref={prevRef}
        className="hidden md:block absolute top-1/2 left-4 md:left-5 transform -translate-y-1/2 text-white z-10 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Iconify
          icon="material-symbols-light:arrow-circle-left-rounded"
          width={50}
          height={50}
          className="drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default Banner;
