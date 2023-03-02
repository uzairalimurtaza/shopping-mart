import ad from "../../../../assets/images/ad33.png";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Endpoint from "./../../../../Utils/Endpoint";
import { Link, useHistory } from "react-router-dom";
import AddProductClick from "./../../../../Helpers/AddProductClick";
import RatingStars from "./../../../../Helpers/RatingStars";
import Loading from "../../../../Utils/Loading";
import firetoast from "../../../../Helpers/FireToast";
import ProductSkeleton from "../../../../Utils/ProductSkeleton";
// import Loading from "../../../../Utils/Loading";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import ProductImage from "./../../../../Utils/ProductImage";
import voidImg from "../../../../assets/images/void.svg";
SwiperCore.use([Autoplay, Pagination, Navigation]);
export function Trending(props) {
  const history = useHistory();
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;
  const [Trending, setTrending] = useState([]);
  const state = useSelector((state) => state);
  const { currentIPv4 } = state;
  useEffect(() => {
    if (!state.landingPage.loading) {
      if (state.landingPage.error) {
        firetoast(
          "Something went wrong, Please contact Admin",
          "default-error"
        );
        setTrending([]);
      } else {
        setTrending(state.landingPage.data.trendingForYouProducts);
      }
    }
  }, [state.landingPage.data]);
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, [window.innerWidth]);
  return state.landingPage.loading ? (
    <ProductSkeleton />
  ) : (
    <div>
      <div className="d-flex justify-content-between">
        <h4 className="ftw-400">Trending for you</h4>
        <div>
          <Link className="td-none text-dark" to="/trending-for-you">
            More Products{" "}
            <i className="fas fa-long-arrow-alt-right text-default"></i>
          </Link>
        </div>
      </div>
      <div className="row">
        {/* {props.loc && props.loc === "product" ? null : (
          <div className="col-3">
            <img src={ad} className="img-fluid" style={{ heigth: "75vh" }} />
          </div>
        )} */}
        <div className="col-12">
          {Trending.length > 0 ? (
            <Swiper
              slidesPerView={1}
              spaceBetween={5}
              loop={true}
              navigation={true}
              autoplay={{
                delay: 3500,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: {
                  slidesPerView: Trending.length >= 2 ? 2 : Trending.length,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: Trending.length >= 3 ? 3 : Trending.length,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: Trending.length >= 5 ? 5 : Trending.length,
                  spaceBetween: Trending.length >= 5 ? 50 : 20,
                },
              }}
              // pagination={{
              //   clickable: true,
              // }}
              className="mySwiper"
            >
              {Trending.map((item, index) => (
                <div key={index}>
                  <SwiperSlide>
                    <ProductImage item={item} type="general" />
                  </SwiperSlide>
                </div>
              ))}
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
      </div>
    </div>
  );
}
