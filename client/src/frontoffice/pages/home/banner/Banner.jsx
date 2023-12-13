import { React, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import Iconify from "../../../../backoffice/components/iconify/iconify";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

import styles from "./Banner.module.scss";

const Banner = () => {
  const [_, setInit] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div className={styles.banner}>
      <Swiper
        autoplay={{
          pauseOnMouseEnter: true,
          delay: 4000,
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
          <div className={styles.swiper1}>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className={styles.slider_text}>
                    <p>FROM NATURE TO YOUR HOME</p>
                    <h1>BECAUSE YOU DESERVE THE BEST OF IT</h1>
                    <div>
                      <Link to="/products">Shop now</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.slider_image}></div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={styles.swiper2}>
            <div className="container">
              <div className="row">
                <div className="col-md-6">
                  <div className={styles.slider_text}>
                    <p>OUR COSMETIC WORLD IS YOURS</p>
                    <h1>BECAUSE YOUR WELLBEING MATTERS</h1>
                    <div>
                      <Link to="/products">Shop now</Link>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className={styles.slider_image}></div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <div ref={nextRef} className={styles.mynextbutton}>
          <Iconify
            icon="material-symbols-light:arrow-circle-right-rounded"
            width={60}
            height={60}
          />
        </div>
        <div ref={prevRef} className={styles.myprevbutton}>
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
