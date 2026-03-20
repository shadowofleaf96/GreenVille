"use client";

import { useRef, useState } from "react";
import Iconify from "@/components/shared/iconify";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Product from "@/frontoffice/_components/products/Product";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import { fadeInUp, premiumTransition } from "@/utils/animations";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

const FlashSales = ({ products }) => {
  const { t, i18n } = useTranslation();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const flashSalesProducts = products?.filter(
    (product) => product.on_sale === true,
  );

  const noProductsAvailable = !products || products.length === 0;

  if (noProductsAvailable) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-center">
        <Iconify
          className="mb-4 text-gray-200"
          icon="solar:box-minimalistic-linear"
          width={100}
        />
        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight mb-2">
          {t("Error Loading Products")}
        </h3>
        <Button
          className="bg-primary text-white rounded-2xl font-bold px-8"
          onClick={() => window.location.reload()}
        >
          {t("Reload")}
        </Button>
      </div>
    );
  }

  if (!flashSalesProducts || flashSalesProducts.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto relative py-12 overflow-hidden select-none">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Aesthetic matching Single Product */}
        <div className="flex items-center justify-between gap-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 uppercase tracking-tight">
              {t("Flash Sales")}
            </h2>
            <span className="text-primary font-black text-[10px] sm:text-xs uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {t("Limited Time")}
            </span>
          </div>

          <div className="h-0.5 flex-1 bg-gray-100 rounded-full hidden md:block" />

          <div className="flex items-center gap-3 shrink-0">
            {/* Swiper Controls */}
            <div className="flex items-center gap-2 mr-2 sm:mr-4">
              <button
                ref={prevRef}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-gray-100 bg-white text-gray-500 hover:text-primary hover:border-primary/20 transition-all shadow-sm flex items-center justify-center group"
              >
                <Iconify
                  icon="solar:alt-arrow-left-bold-duotone"
                  width={20}
                  className="group-hover:-translate-x-0.5 transition-transform rtl:rotate-180"
                />
              </button>
              <button
                ref={nextRef}
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-gray-100 bg-white text-gray-500 hover:text-primary hover:border-primary/20 transition-all shadow-sm flex items-center justify-center group"
              >
                <Iconify
                  icon="solar:alt-arrow-right-bold-duotone"
                  width={20}
                  className="group-hover:translate-x-0.5 transition-transform rtl:rotate-180"
                />
              </button>
            </div>

            <Button
              variant="premium"
              className="h-10 sm:h-12 px-6 sm:px-8 text-[10px] sm:text-xs uppercase font-black tracking-widest rounded-2xl shadow-xl shadow-primary/10"
              asChild
            >
              <Link href="/products?sales">
                {t("See all")}
                <Iconify
                  icon="solar:arrow-right-bold-duotone"
                  width={18}
                  className="ml-2 rtl:mr-2 rtl:rotate-180"
                />
              </Link>
            </Button>
          </div>
        </div>

        {/* Swiper Carousel - Contained Start, Screen Edge Overflow */}
        <div className="products-carousel relative pt-4">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={"auto"}
            freeMode={true}
            grabCursor={true}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            breakpoints={{
              640: { spaceBetween: 24 },
              1024: { spaceBetween: 24 },
              1280: { spaceBetween: 32 },
            }}
            className="overflow-visible!"
          >
            {flashSalesProducts.map((product, index) => (
              <SwiperSlide
                key={product._id || index}
                className="w-65! sm:w-70! lg:w-80! h-auto"
              >
                <motion.div
                  variants={fadeInUp}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true }}
                  transition={{ ...fadeInUp.transition, delay: index * 0.1 }}
                  className="h-full pb-8"
                >
                  <Product product={product} onQuickView={() => {}} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default FlashSales;
