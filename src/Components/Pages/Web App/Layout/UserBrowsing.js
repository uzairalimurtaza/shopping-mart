import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import ProductSkeleton from "../../../../Utils/ProductSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import ProductImage from "./../../../../Utils/ProductImage";
import UserBrowsingProducts from "./../../../../Utils/UserBrowsingProducts";
import BanglaBazarApi from "../../../Api/BanglaBazarApi";
import Endpoint from "../../../../Utils/Endpoint";
import { CurrentUser } from "../../../../Helpers/Auth";
import firetoast from "../../../../Helpers/FireToast";
import { getLandingPageData } from "../../../../Actions/LandingActions";
SwiperCore.use([Autoplay, Pagination, Navigation]);
function UserBrowsing() {
  const dispatch = useDispatch();
  // const history = useHistory();
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;
  const [UserHistory, setUserHistory] = useState([]);
  const state = useSelector((state) => state);
  // const { currentIPv4 } = state;
  useEffect(() => {
    var localUserBrowsing = localStorage.getItem("uBH");

    if (!state.landingPage.loading) {
      if (state.landingPage.error) {
        if (localUserBrowsing && localUserBrowsing.length > 0) {
          setUserHistory(JSON.parse(localUserBrowsing));
        } else {
          setUserHistory([]);
        }
      } else {
        if (state.landingPage.data.recentlyViewedProducts.length > 0) {
          setUserHistory(state.landingPage.data.recentlyViewedProducts);
        } else if (localUserBrowsing && localUserBrowsing.length > 0) {
          setUserHistory(JSON.parse(localUserBrowsing));
        } else {
          setUserHistory([]);
        }
      }
    }
  }, [state.landingPage.data, dispatch]);
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, [window.innerWidth]);
  const RemoveFromBrowsing = async (index, item) => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/landing-page/updateRecentlyViewed`,
        {
          UserID: CurrentUser.UserID,
          ProductID: item.ProductID,
        }
      );
      if (response.data.status) {
        var temp = [];
        for (let i = 0; i < UserHistory.length; i++) {
          if (i !== index) {
            temp.push(UserHistory[i]);
          }
        }
        setUserHistory(temp);
      } else {
        return firetoast(
          response.data.message || response.data.error,
          "default-error"
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  return state.landingPage.loading ? (
    <ProductSkeleton />
  ) : (
    UserHistory.length > 0 && (
      <div className="mt-5" id="userBrowsing">
        <div className="d-flex justify-content-between">
          <h4 className="ftw-400">Recently Viewed</h4>
          <div>
            <Link className="td-none text-dark" to="/recently-viewed/products">
              View More{" "}
              <i className="fas fa-long-arrow-alt-right text-default"></i>
            </Link>
          </div>
        </div>
        <Swiper
          slidesPerView={1}
          spaceBetween={5}
          // loop={true}
          navigation={true}
          // autoplay={{
          //   delay: 2500,
          //   disableOnInteraction: false,
          // }}
          // pagination={{
          //   clickable: true,
          // }}
          className="mySwiper"
          breakpoints={{
            640: {
              slidesPerView: UserHistory.length >= 2 ? 2 : UserHistory.length,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: UserHistory.length >= 3 ? 3 : UserHistory.length,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: UserHistory.length >= 5 ? 5 : UserHistory.length,
              spaceBetween: UserHistory.length >= 5 ? 50 : 20,
            },
          }}
        >
          {UserHistory.map((item, index) => (
            <div key={index}>
              <SwiperSlide>
                <UserBrowsingProducts
                  item={item}
                  index={index}
                  type="recent"
                  RemoveFromBrowsing={RemoveFromBrowsing}
                />
              </SwiperSlide>
            </div>
          ))}
        </Swiper>
      </div>
    )
  );
}
export default UserBrowsing;
