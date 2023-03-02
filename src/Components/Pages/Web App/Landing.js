import { AdSectionOne } from "./Layout/AdSectionOne";
import { PopularDepartments } from "./Layout/PopularDepartments";
import { Trending } from "./Layout/Trending";
import TopRatedProducts from "./Layout/TopRatedProducts";
import { Blogs } from "./Layout/Blogs";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import LandingSlider from "./Layout/LandingSlider";
import { Container } from "reactstrap";
import ServiceInfo from "./Layout/ServiceInfo";
import DealOfTheDay from "./Layout/DealOfTheDay";
import { WebsiteHeader } from "./Layout/Header";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getLandingPageData } from "./../../../Actions/LandingActions";
import { CurrentUser } from "./../../../Helpers/Auth";
import UserBrowsing from "./Layout/UserBrowsing";

function Landing() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);
  // const dispatch = useDispatch();
  // const state = useSelector((state) => state);
  // useEffect(() => {
  //   var isUser = localStorage.getItem("user");
  //   if (state.currentIPv4.IP["country_name"]) {
  //     if (isUser) {
  //       dispatch(
  //         getLandingPageData(
  //           state.currentIPv4.IP["country_name"],
  //           CurrentUser.UserID
  //         )
  //       );
  //     } else {
  //       dispatch(getLandingPageData(state.currentIPv4.IP["country_name"], ""));
  //     }
  //   }
  // }, [dispatch, state.currentIPv4.IP["country_name"]]);
  return (
    <>
      <WebsiteHeader />
      <LandingSlider />
      <Container>
        <UserBrowsing />
        <ServiceInfo />
        {/* <DealOfTheDay /> */}
        <AdSectionOne />
        <PopularDepartments />
        <Trending />
        <TopRatedProducts />
        {/* <Blogs /> */}
      </Container>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default Landing;
