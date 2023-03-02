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

function Home() {
  return (
    <>
      <WebsiteHeader />
      <LandingSlider />
      <Container>
        <ServiceInfo />
        <DealOfTheDay />
        <AdSectionOne />
        <PopularDepartments />
        <Trending />
        <TopRatedProducts />
        <Blogs />
      </Container>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default Home;
