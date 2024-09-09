import { React, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Iconify from "../../../../backoffice/components/iconify/iconify";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

const Banner = () => {
  const [_, setInit] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="relative h-4/6 flex">
      <Swiper
        rewind={true}
        autoplay={{
          pauseOnMouseEnter: true,
          delay: 3000,
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
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="flex items-center justify-center bg-cover bg-center h-full"
            style={{ backgroundImage: "url('../../../../../assets/swiper1.webp')" }}>
            <div className="container my-auto px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2">
                  <div className="text-center md:text-left mt-8">
                    <p className="text-[#FEFAE1] font-bold tracking-wide p-2 rounded-lg">FROM NATURE TO YOUR HOME</p>
                    <h1 className="text-[#FEFAE1] text-4xl md:text-5xl font-bold leading-tight tracking-wide mt-4 p-2 rounded-lg border border-transparent">BECAUSE YOU DESERVE THE BEST OF IT</h1>
                    <div className="mt-8">
                      <Link to="/products" className="inline-block bg-[#8DC63F] text-white py-3 px-6 font-medium rounded-lg uppercase no-underline shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">Shop now</Link>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="slider_image"></div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div className="flex items-center justify-center bg-cover bg-center h-full"
            style={{ backgroundImage: "url('../../../../../assets/swiper2.webp')" }}>
            <div className="container mx-auto px-4">
              <div className="flex flex-wrap">
                <div className="w-full md:w-1/2">
                  <div className="text-center md:text-left mt-8">
                    <p className="text-[#FEFAE1] font-bold tracking-wide p-2 rounded-lg">OUR COSMETIC WORLD IS YOURS</p>
                    <h1 className="text-[#FEFAE1] text-4xl md:text-5xl font-bold leading-tight tracking-wide mt-4 p-2 rounded-lg border border-transparent">BECAUSE YOUR WELLBEING MATTERS</h1>
                    <div className="mt-8">
                      <Link to="/products" className="inline-block bg-[#8DC63F] text-white py-3 px-6 font-medium rounded-lg uppercase no-underline shadow-none transition-shadow duration-300 cursor-pointer hover:shadow-lg hover:shadow-yellow-400">Shop now</Link>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="slider_image"></div>
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
