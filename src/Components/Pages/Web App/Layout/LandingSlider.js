import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from "reactstrap";
import sliderImage from "../../../../assets/images/sliderImage.png";
import sliderImage2 from "../../../../assets/images/iyged.png";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
function LandingSlider() {
  const items = [
    {
      src: sliderImage,
      altText: "Slide 1",
      caption: "Slide 1",
    },
    {
      src: sliderImage,
      altText: "Slide 1",
      caption: "Slide 1",
    },
  ];
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.src}
      >
        <img
          src={sliderImage}
          alt={"sliderImage"}
          style={{ width: "100%", height: "500px", objectFit: "cover" }}
        />
        {/* <CarouselCaption
          captionText={item.caption}
          captionHeader={item.caption}
        /> */}
      </CarouselItem>
    );
  });
  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination, Navigation]}
      className="mySwiper"
      navigation={true}
      autoplay={{
        delay: 2000,
        disableOnInteraction: false,
      }}
    >
      <SwiperSlide>
        {" "}
        <img
          src={sliderImage}
          alt={"sliderImage"}
          style={{ width: "100%", height: "500px", objectFit: "cover" }}
        />
      </SwiperSlide>
      <SwiperSlide>
        {" "}
        <img
          src={sliderImage2}
          alt={"sliderImage"}
          style={{ width: "100%", height: "500px", objectFit: "cover" }}
        />
      </SwiperSlide>
    </Swiper>
  );
}
export default LandingSlider;
