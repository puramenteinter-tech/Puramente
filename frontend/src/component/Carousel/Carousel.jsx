import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "./styles.css";

export default function Carousel() {
  const altTexts = [
    "wholesale jewellery suppliers in India",
    "imitation jewellery manufacturers in India",
    "best wholesale jewelry suppliers in India",
    "fashion and custom jewellery wholesaler",
    "trusted imitation jewellery in Jaipur",
    "premium costume jewellery suppliers India",
  ];

  return (
    <Swiper
      spaceBetween={0}
      centeredSlides={true}
      autoplay={{
        delay: 1500,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      className="w-full h-[30vh] sm:h-[35vh] md:h-[60vh] lg:h-[90vh]"
    >
      {["2", "3", "1", "4", "5", "6"].map((img, index) => (
        <SwiperSlide key={index}>
          <img
            className="w-full h-full object-cover"
            src={`/POSTERS/${img}.JPG`}
            alt={altTexts[index] || `Puramente Jewel Banner ${index + 1}`}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
