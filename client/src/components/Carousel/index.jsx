import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "./styles.scss";

function CarouselComponent() {
  return (
    <Swiper
      navigation={true}
      modules={[Navigation, Pagination, Autoplay]}
      className="mySwiper"
      pagination={{
        dynamicBullets: true,
      }}
      loop={true}
      autoplay={{
        delay: 15000,
        disableOnInteraction: false,
      }}
    >
      <SwiperSlide>
        <div className="outerbox">
          <div className="box btc">
            <span>
              <img
                src="images/dashboard/bitcoin.svg"
                alt="btc"
                width={20}
                height={20}
              />
              <h4>BTC ALPHA</h4>
            </span>
            <span>
              <h5>Up to</h5>
              <h4>8% in 30 days</h4>
            </span>
          </div>
          <div className="box eth">
            <span>
              <img
                src="images/dashboard/ethereum.svg"
                alt="eth"
                width={20}
                height={20}
              />
              <h4>ETH ALPHA</h4>
            </span>
            <span>
              <h5>Up to</h5>
              <h4>8% in 30 days</h4>
            </span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="outerbox">
          <div className="box bnb">
            <span>
              <img
                src="images/dashboard/bnb.svg"
                alt="bnb"
                width={20}
                height={20}
              />
              <h4>BNB ALPHA</h4>
            </span>
            <span>
              <h5>Up to</h5>
              <h4>6% in 30 days</h4>
            </span>
          </div>
          <div className="box usdc">
            <span>
              <img
                src="images/dashboard/usdc.svg"
                alt="usdc"
                width={20}
                height={20}
              />
              <h4>UDSC ALPHA</h4>
            </span>
            <span>
              <h5>Up to</h5>
              <h4>9% in 30 days</h4>
            </span>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="outerbox">
          <div className="box usdt">
            <span>
              <img
                src="images/dashboard/usdt.svg"
                alt="usdt"
                width={20}
                height={20}
              />
              <h4>USDT ALPHA</h4>
            </span>
            <span>
              <h5>Up to</h5>
              <h4>9% in 30 days</h4>
            </span>
          </div>
          <div className="box ebct">
            <span>
              <img
                src="images/dashboard/ebct.svg"
                alt="ebct"
                width={20}
                height={20}
              />
              <h4>EBCT ALPHA</h4>
            </span>
            <span>
              <h5>Up to</h5>
              <h4>4% in 30 days</h4>
            </span>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  );
}

export default CarouselComponent;
