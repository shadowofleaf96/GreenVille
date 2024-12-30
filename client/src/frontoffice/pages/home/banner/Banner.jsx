import { React, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { useTranslation } from "react-i18next";
import Iconify from "../../../../backoffice/components/iconify/iconify";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';

import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";

const slidesData = [
  {
    id: 1,
    image: "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/public/images/5abad3e4c5ae1384ec8069cfd9908b72",
    titleKey: "slider.slide1.title",
    subtitleKey: "slider.slide1.subtitle",
    descriptionKey: "slider.slide1.description",
    buttonTextKey: "slider.slide1.buttonText",
    link: "/products"
  },
  {
    id: 2,
    image: "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/public/images/7ab333861bbc00e07cd2f5f056593b84",
    titleKey: "slider.slide2.title",
    subtitleKey: "slider.slide2.subtitle",
    descriptionKey: "slider.slide2.description",
    buttonTextKey: "slider.slide2.buttonText",
    link: "/products"
  },
  {
    id: 3,
    image: "https://res.cloudinary.com/donffivrz/image/upload/f_auto,q_auto/v1/greenville/public/images/bcaa0b503122b27a955ee8e87cc7e6c2",
    titleKey: "slider.slide3.title",
    subtitleKey: "slider.slide3.subtitle",
    descriptionKey: "slider.slide3.description",
    buttonTextKey: "slider.slide3.buttonText",
    link: "/products"
  }
];

const Banner = () => {
  const { t } = useTranslation();
  const [_, setInit] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

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
        className="mySwiper h-full"
      >
        {slidesData.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="flex items-center justify-center bg-cover bg-center h-full relative"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0"></div>
              <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center space-y-6 md:flex-row md:items-start md:text-left rtl:md:items-end rtl:md:text-right md:space-y-0">
                  <div className="w-full md:w-1/2">
                    <p className="text-white font-semibold text-sm md:text-lg uppercase tracking-widest mb-40 md:mb-16">
                      {t(slide.subtitleKey)}
                    </p>
                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-28 md:mb-12">
                      {t(slide.titleKey)}
                    </h1>
                    <p className="text-white text-sm md:text-lg mb-28 md:mb-20">
                      {t(slide.descriptionKey)}
                    </p>
                    <button className="flex bg-[#8DC63F] text-white py-2 md:py-3 px-6 md:px-8 rounded-md justify-center items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400 mx-auto md:mx-0">
                      <Link to={slide.link}>{t(slide.buttonTextKey)}</Link>
                      <Iconify
                        icon="ep:right"
                        width={20}
                        height={20}
                        className="ml-2 rtl:rotate-180 rtl:mr-2"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div
          ref={nextRef}
          className="absolute top-1/2 right-4 md:right-5 transform -translate-y-1/2 text-white z-10 cursor-pointer hover:opacity-80"
        >
          <Iconify
            icon="material-symbols-light:arrow-circle-right-rounded"
            width={50}
            height={50}
          />
        </div>

        <div
          ref={prevRef}
          className="absolute top-1/2 left-4 md:left-5 transform -translate-y-1/2 text-white z-10 cursor-pointer hover:opacity-80"
        >
          <Iconify
            icon="material-symbols-light:arrow-circle-left-rounded"
            width={50}
            height={50}
          />
        </div>
      </Swiper>
    </div>
  );
};

export default Banner;
