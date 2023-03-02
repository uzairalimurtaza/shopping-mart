import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Endpoint from "./../../../../Utils/Endpoint";
import { Link, useHistory } from "react-router-dom";
import AddProductClick from "./../../../../Helpers/AddProductClick";
import RatingStars from "./../../../../Helpers/RatingStars";
import Loading from "../../../../Utils/Loading";
import firetoast from "../../../../Helpers/FireToast";
import ProductSkeleton from "./../../../../Utils/ProductSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay, Pagination, Navigation } from "swiper";
import voidImg from "../../../../assets/images/void.svg";
import ProductImage from "./../../../../Utils/ProductImage";

SwiperCore.use([Autoplay, Pagination, Navigation]);
export function PopularDepartments() {
  const history = useHistory();
  const [width, setWidth] = useState(window.innerWidth);
  const breakpoint = 620;
  const [ActiveSection, newActiveSection] = useState(1);
  const [NewArrivals, setNewArrival] = useState([]);
  const [MostPopular, setMostPopular] = useState([]);
  const [BestVendor, setBestVendor] = useState([]);
  const state = useSelector((state) => state);
  const { currentIPv4 } = state;
  useEffect(() => {
    if (!state.landingPage.loading) {
      if (state.landingPage.error) {
        setNewArrival([]);
        setMostPopular([]);
        setBestVendor([]);
        firetoast(
          "Something went wrong! Please contact Admin",
          "default-error"
        );
      } else {
        setNewArrival(state.landingPage.data.newArrivalProducts);
        setMostPopular(state.landingPage.data.mostPopularProducts);
        setBestVendor(state.landingPage.data.bestSellerVendor);
      }
    }
  }, [state.landingPage.data]);
  useEffect(() => {
    window.addEventListener("resize", () => setWidth(window.innerWidth));
  }, [window.innerWidth]);
  return (
    <div className="mt-5 mb-3">
      <div className="text-center">
        <h2 className="ftw-400">Popular Departments</h2>
      </div>
      <div className="row mt-5">
        <div className="col-lg-8 col-md-10 col-sm-12 m-auto">
          <div className="row" style={{ padding: "0px 5px" }}>
            <button
              className={`btn ${
                ActiveSection === 1
                  ? "popular-head-btn-active"
                  : "popular-head-btn"
              } col-lg-3 col-md-4 col-xs-12 m-auto mt-2`}
              onClick={() => newActiveSection(1)}
            >
              New Arrivals
            </button>

            <button
              className={`btn ${
                ActiveSection === 2
                  ? "popular-head-btn-active"
                  : "popular-head-btn"
              } col-lg-3 col-md-4 col-xs-12 m-auto mt-2`}
              onClick={() => newActiveSection(2)}
            >
              Best Sellers
            </button>

            <button
              className={`btn ${
                ActiveSection === 3
                  ? "popular-head-btn-active"
                  : "popular-head-btn"
              } col-lg-3 col-md-4  col-xs-12 m-auto mt-2`}
              onClick={() => newActiveSection(3)}
            >
              Most Popular
            </button>

            {/* <button
              className={`btn ${
                ActiveSection === 4
                  ? "popular-head-btn-active"
                  : "popular-head-btn"
              } col-3`}
              onClick={() => newActiveSection(4)}
            >
              Featured
            </button> */}
          </div>
        </div>
      </div>
      {state.landingPage.loading ? (
        <ProductSkeleton />
      ) : (
        <div className="mt-5">
          {ActiveSection === 1 ? (
            NewArrivals.length > 0 ? (
              <Swiper
                slidesPerView={1}
                spaceBetween={5}
                loop={true}
                navigation={true}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                }}
                // pagination={{
                //   clickable: true,
                // }}
                className="mySwiper"
                breakpoints={{
                  640: {
                    slidesPerView:
                      NewArrivals.length >= 2 ? 2 : NewArrivals.length,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView:
                      NewArrivals.length >= 3 ? 3 : NewArrivals.length,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView:
                      NewArrivals.length >= 5 ? 5 : NewArrivals.length,
                    spaceBetween: NewArrivals.length >= 5 ? 50 : 20,
                  },
                }}
              >
                {NewArrivals.map((item, index) => (
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
                  No Product Found
                </div>
              </div>
            )
          ) : null}
          {ActiveSection === 2 && (
            <div className="row m-auto">
              {BestVendor.length > 0 ? (
                BestVendor.map((item, index) => (
                  <div className="col-lg-3 col-md-4 col-sm-6 " key={index}>
                    <div className="card  mt-2">
                      <img
                        className="card-img-top img-fluid"
                        style={{ height: "150px", cursor: "pointer" }}
                        src={`${Endpoint}/${item.CompanyLogo}`}
                        alt="Card image cap"
                        onClick={() => {
                          var pageUrl = item.CompanyName.split(" ").join("_");
                          history.push(`/store/${pageUrl}`);
                        }}
                      />
                      <div className="card-body">
                        <Link
                          to="#"
                          className="td-none"
                          onClick={() => {
                            var pageUrl = item.CompanyName.split(" ").join("_");
                            history.push(`/store/${pageUrl}`);
                          }}
                        >
                          <h5 className="text-default">{item.CompanyName}</h5>
                        </Link>
                        <p className="card-text">
                          <span className="dotd-rate">
                            {RatingStars(
                              item.AVG_Rating ? parseInt(item.AVG_Rating) : 0
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <img src={voidImg} style={{ height: "120px" }} />
                  <div
                    className="text-default mt-2"
                    style={{ fontSize: "24px" }}
                  >
                    No Data to display
                  </div>
                </div>
              )}
            </div>
          )}
          {ActiveSection === 3 ? (
            MostPopular.length > 0 ? (
              <Swiper
                slidesPerView={1}
                spaceBetween={5}
                loop={true}
                navigation={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                breakpoints={{
                  640: {
                    slidesPerView:
                      MostPopular.length >= 2 ? 2 : MostPopular.length,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView:
                      MostPopular.length >= 3 ? 3 : MostPopular.length,
                    spaceBetween: 20,
                  },
                  1024: {
                    slidesPerView:
                      MostPopular.length >= 5 ? 5 : MostPopular.length,
                    spaceBetween: MostPopular.length >= 5 ? 50 : 20,
                  },
                }}
                // pagination={{
                //   clickable: true,
                // }}
                className="mySwiper"
              >
                {MostPopular.map((item, index) => (
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
                  No Product Found
                </div>
              </div>
            )
          ) : null}
        </div>
      )}
    </div>
  );
}
