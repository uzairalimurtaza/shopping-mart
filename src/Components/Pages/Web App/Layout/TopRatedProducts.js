import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddProductClick from "./../../../../Helpers/AddProductClick";
import RatingStars from "./../../../../Helpers/RatingStars";
import { Link, useHistory } from "react-router-dom";
import Loading from "../../../../Utils/Loading";

import Endpoint from "./../../../../Utils/Endpoint";
import firetoast from "../../../../Helpers/FireToast";
import ProductSkeleton from "./../../../../Utils/ProductSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import ProductImage from "./../../../../Utils/ProductImage";
import voidImg from "../../../../assets/images/void.svg";
SwiperCore.use([Autoplay, Pagination, Navigation]);
function TopRatedProducts() {
  const history = useHistory();
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;
  const [TopRated, setTopRated] = useState([]);
  const state = useSelector((state) => state);
  const { currentIPv4 } = state;
  useEffect(() => {
    if (!state.landingPage.loading) {
      if (state.landingPage.error) {
        firetoast("Something went wrong!", "default-error");
        setTopRated([]);
      } else {
        setTopRated(state.landingPage.data.topRatedProducts);
      }
    }
  }, [state.landingPage.data]);
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, [window.innerWidth]);
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 2,
  };
  return state.landingPage.loading ? (
    <ProductSkeleton />
  ) : (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h4 className="ftw-400">Top Rated Products</h4>
        <div>
          <Link className="td-none text-dark" to="/top-rated/products">
            Top Rated Products{" "}
            <i className="fas fa-long-arrow-alt-right text-default"></i>
          </Link>
        </div>
      </div>
      {TopRated.length > 0 ? (
        <Swiper
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: TopRated.length >= 2 ? 2 : TopRated.length,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: TopRated.length >= 3 ? 3 : TopRated.length,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: TopRated.length >= 5 ? 5 : TopRated.length,
              spaceBetween: TopRated.length >= 5 ? 50 : 20,
            },
          }}
          spaceBetween={5}
          loop={true}
          navigation={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          // pagination={{
          //   clickable: true,
          // }}
          className="mySwiper"
        >
          {/* <Slider {...settings}> */}
          {TopRated.map((item, index) => (
            <div key={index}>
              <SwiperSlide>
                <ProductImage item={item} type="general" />
              </SwiperSlide>
            </div>
          ))}
          {/* </Slider> */}
        </Swiper>
      ) : (
        <div className="text-center">
          <img src={voidImg} style={{ height: "120px" }} />
          <div className="text-default mt-2" style={{ fontSize: "24px" }}>
            No Data to display
          </div>
        </div>
      )}
    </div>
  );
}
export default TopRatedProducts;
