import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./styles.css";

export default function Carousel() {
  return (
    <div className="w-full h-[30vh] sm:h-[35vh] md:h-[60vh] lg:h-[90vh]">
      <video
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        src="/headerBannerPuramente.mp4"
        type="video/mp4"
      />
    </div>
  );
}
