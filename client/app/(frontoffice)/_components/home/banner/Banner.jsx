"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import CircularLoader from "@/frontoffice/_components/loader/CircularLoader";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LazyImage from "@/components/shared/lazyimage/LazyImage";
import Iconify from "@/components/shared/iconify/iconify";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useSwiper } from "swiper/react";
import { fadeInUp, scaleIn, premiumTransition } from "@/utils/animations";

const Banner = () => {
  const { t, i18n } = useTranslation();
  const [init, setInit] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const { data: settings, loading } = useSelector(
    (state) => state.adminSettings,
  );

  const slidesData =
    settings?.banner_slides?.length > 0
      ? settings.banner_slides.map((slide, index) => ({
          ...slide,
          id: index,
          link: slide.link || "/products",
        }))
      : [];

  const currentLang = i18n.language;
  const isRtl = currentLang === "ar";

  if (loading) {
    return (
      <div className="h-[80vh] bg-black flex items-center justify-center">
        <CircularLoader />
      </div>
    );
  }

  return (
    <div className="relative h-[75vh] sm:h-[80vh] lg:h-[85vh] w-full bg-black overflow-hidden select-none">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(var(--color-primary-rgb),0.3)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_70%,rgba(59,130,246,0.2)_0%,transparent_50%)]" />
      </div>

      <Swiper
        speed={1000}
        rewind={true}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        pagination={{
          clickable: true,
          el: ".custom-pagination",
          renderBullet: (index, className) =>
            `<span class="${className} custom-bullet"></span>`,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onInit={(swiper) => {
          swiper.navigation.init();
          swiper.navigation.update();
          setInit(true);
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="h-full w-full"
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="relative h-full w-full">
                <div className="absolute inset-0 z-0">
                  <motion.div
                    initial={{ scale: 1.1 }}
                    animate={isActive ? { scale: 1 } : { scale: 1.1 }}
                    transition={{ duration: 6, ease: "linear" }}
                    style={{ willChange: "transform" }}
                    className="w-full h-full"
                  >
                    <LazyImage
                      src={slide.image}
                      className="w-full h-full object-cover"
                      wrapperClassName="w-full h-full relative"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-black/40 z-10" />
                  <div className="absolute inset-0 bg-linear-to-r from-black/80 via-transparent to-transparent z-10 rtl:bg-linear-to-l" />
                </div>

                <div className="relative z-20 h-full container mx-auto px-6 sm:px-12 lg:px-20 flex flex-col justify-center items-center lg:items-start text-center lg:text-left rtl:lg:items-end rtl:lg:text-right">
                  <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate={isActive ? "animate" : "initial"}
                    transition={{ ...fadeInUp.transition, delay: 0.2 }}
                    style={{ willChange: "transform, opacity" }}
                  >
                    <span className="inline-block px-5 py-2 mb-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] sm:text-xs font-black uppercase tracking-[0.4em] shadow-lg">
                      {slide.subtitle?.[currentLang] || slide.subtitle?.en}
                    </span>
                  </motion.div>

                  <motion.h1
                    variants={fadeInUp}
                    initial="initial"
                    animate={isActive ? "animate" : "initial"}
                    transition={{ ...fadeInUp.transition, delay: 0.4 }}
                    style={{ willChange: "transform, opacity" }}
                    className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-[0.95] tracking-tight mb-8 uppercase max-w-4xl"
                  >
                    {slide.title?.[currentLang] || slide.title?.en}
                  </motion.h1>

                  <motion.p
                    variants={fadeInUp}
                    initial="initial"
                    animate={isActive ? "animate" : "initial"}
                    transition={{ ...fadeInUp.transition, delay: 0.6 }}
                    style={{ willChange: "transform, opacity" }}
                    className="text-gray-300 text-sm sm:text-lg lg:text-xl font-medium max-w-2xl mb-12 leading-relaxed"
                  >
                    {slide.description?.[currentLang] || slide.description?.en}
                  </motion.p>

                  <motion.div
                    variants={scaleIn}
                    initial="initial"
                    animate={isActive ? "animate" : "initial"}
                    transition={{ ...scaleIn.transition, delay: 0.8 }}
                    className="w-full sm:w-auto"
                  >
                    <Link
                      href={slide.link}
                      className="group relative flex h-16 sm:h-20 w-full sm:w-72 items-center justify-center rounded-2xl bg-primary text-white font-black uppercase tracking-widest text-xs sm:text-sm shadow-[0_20px_40px_-10px_rgba(var(--color-primary-rgb),0.5)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        {slide.buttonText?.[currentLang] ||
                          slide.buttonText?.en}
                        <Iconify
                          icon="solar:arrow-right-line-duotone"
                          width={22}
                          className="group-hover:translate-x-1 transition-transform rtl:rotate-180"
                        />
                      </span>
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </Link>
                  </motion.div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation & Controls */}
      <div className="absolute bottom-16 right-12 z-40 hidden lg:flex gap-4">
        <button
          ref={prevRef}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-2xl border border-white/20 text-white hover:bg-primary transition-all group z-50 shadow-xl"
        >
          <Iconify
            icon="solar:alt-arrow-left-line-duotone"
            width={28}
            className="group-hover:-translate-x-1 transition-transform"
          />
        </button>
        <button
          ref={nextRef}
          className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-2xl border border-white/20 text-white hover:bg-primary transition-all group z-50 shadow-xl"
        >
          <Iconify
            icon="solar:alt-arrow-right-line-duotone"
            width={28}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>

      <div className="absolute bottom-12 left-6 sm:left-12 lg:left-20 z-40">
        <div className="flex gap-3 custom-pagination"></div>
      </div>
    </div>
  );
};

export default Banner;
