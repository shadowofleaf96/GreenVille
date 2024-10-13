import { React, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
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
    image: "../../../../../assets/swiper1.webp",
    title: "Embrace the Best of Organic Living",
    subtitle: "FROM NATURE TO YOUR HOME",
    description: "Experience the pure essence of nature with our handpicked products that nurture your wellbeing.",
    buttonText: "Shop Now",
    link: "/products"
  },
  {
    id: 2,
    image: "../../../../../assets/swiper2.webp",
    title: "Your Wellbeing is Our Priority",
    subtitle: "OUR COSMETIC WORLD IS YOURS",
    description: "Discover our range of organic products designed to enhance your beauty and health naturally.",
    buttonText: "Buy Now",
    link: "/products"
  },
  {
    id: 3,
    image: "../../../../../assets/swiper3.webp",
    title: "Organic Living, Reimagined for You",
    subtitle: "JOIN THE MOVEMENT",
    description: "Step into a world where sustainability meets style because the future is natural.",
    buttonText: "Explore Now",
    link: "/products"
  }
];

const Banner = () => {
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
                <div className="flex flex-col items-center text-center space-y-6 md:flex-row md:items-start md:text-left md:space-y-0">
                  <div className="w-full md:w-1/2">
                    <p className="text-white font-semibold text-sm md:text-lg uppercase tracking-widest mb-40 md:mb-16">
                      {slide.subtitle}
                    </p>
                    <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-28 md:mb-12">
                      {slide.title}
                    </h1>
                    <p className="text-white text-sm md:text-lg mb-28 md:mb-20">
                      {slide.description}
                    </p>
                    <button className="flex bg-[#8DC63F] text-white py-2 md:py-3 px-6 md:px-8 rounded-md justify-center items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400 mx-auto md:mx-0">
                      <Link to={slide.link}>{slide.buttonText}</Link>
                      <Iconify
                        icon="ep:right"
                        width={20}
                        height={20}
                        className="ml-2"
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
