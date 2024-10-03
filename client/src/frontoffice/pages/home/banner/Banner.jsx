import { React, useState, useRef } from "react";
import { Link } from "react-router-dom"
import { Swiper, SwiperSlide } from "swiper/react";
import Iconify from "../../../../backoffice/components/iconify/iconify";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade';


import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from "swiper/modules";

const Banner = () => {
  const [_, setInit] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative h-[65vh] md:h-[70vh] lg:h-[80vh] xl:h-[85vh] flex">
      <Swiper
        rewind={true}
        autoplay={{
          pauseOnMouseEnter: true,
          delay: 7000,
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
        modules={[Autoplay, Pagination, Navigation, EffectFade, Parallax ]}
        effect="fade"
        className="mySwiper h-full"
      >
        <SwiperSlide>
          <div className="flex items-center justify-center bg-cover bg-center h-full relative"
            style={{ backgroundImage: "url('../../../../../assets/swiper1.webp')" }}>
            <div className="absolute inset-0"></div>
            <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-col items-center md:flex-row md:items-start text-center md:text-left space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <p className="text-white font-semibold text-lg uppercase tracking-widest mb-16">FROM NATURE TO YOUR HOME</p>
                  <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-12">Embrace the Best of Organic Living</h1>
                  <p className="text-white text-lg mb-20">Experience the pure essence of nature with our handpicked products that nurture your wellbeing.</p>
                  <button className="flex bg-[#8DC63F] text-white py-3 px-8 rounded-md justify-center items-center shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">
                    <Link to="/products">Shop Now</Link>
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

        <SwiperSlide>
          <div className="flex items-center justify-center bg-cover bg-center h-full relative"
            style={{ backgroundImage: "url('../../../../../assets/swiper2.webp')" }}>
            <div className="absolute inset-0"></div>
            <div className="container mx-auto px-6 relative z-10">
              <div className="flex flex-col items-center md:flex-row md:items-start text-center md:text-left space-y-4 md:space-y-0">
                <div className="w-full md:w-1/2">
                  <p className="text-white font-semibold text-lg uppercase tracking-widest mb-16">OUR COSMETIC WORLD IS YOURS</p>
                  <h1 className="text-white text-5xl md:text-6xl font-bold leading-tight mb-12">Your Wellbeing is Our Priority</h1>
                  <p className="text-white text-lg mb-20">Discover our range of organic products designed to enhance your beauty and health naturally.</p>
                  <button className="flex bg-[#8DC63F] text-white py-3 px-8 rounded-md shadow-none justify-center items-center transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">
                    <Link to="/products">Shop Now</Link>
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

        <div ref={nextRef} className="absolute top-1/2 right-5 transform -translate-y-1/2 text-white z-10 cursor-pointer hover:opacity-80">
          <Iconify
            icon="material-symbols-light:arrow-circle-right-rounded"
            width={60}
            height={60}
          />
        </div>

        <div ref={prevRef} className="absolute top-1/2 left-5 transform -translate-y-1/2 text-white z-10 cursor-pointer hover:opacity-80">
          <Iconify
            icon="material-symbols-light:arrow-circle-left-rounded"
            width={60}
            height={60}
          />
        </div>
      </Swiper>
    </div>
  );
};

export default Banner;
