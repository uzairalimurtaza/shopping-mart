import { WebsiteHeader } from "./Layout/Header";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"
import BanglaTin from "../../../assets/images/bangla_tin.jpg"
import { Modal, ModalBody, ModalHeader } from "reactstrap"
function AboutUs() {
  const [ShowModal, setShowModal] = useState(false)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  return (
    <>
      <WebsiteHeader />

      <div className="container">
        <>
          <div className="pt-2 pb-0">
            <Breadcrumb listTag="div">
              <BreadcrumbItem
                href="/"
                tag="a"
                className="td-none"
                style={{ color: "#B1B1B1" }}
              >
                Home
              </BreadcrumbItem>
              <BreadcrumbItem
                href="#"
                tag="a"
                className="td-none"
                style={{ color: "#787878" }}
              >
                About Us
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="text-center">
            <h2 className="text-default">About Us</h2>
          </div>
          <div className="container mt-3">
            <p style={{ fontSize: "15px" }}>
              BanglaBazar is committed to serving Deshi customers globally or
              nationwide with quality products and services. Our mission is to
              bring Deshi products within your reach.{" "}
            </p>
            <p className="mt-2" style={{ fontSize: "15px" }}>
              BanglaBazar was operated initially from USA. Now we are starting
              our operation from Bangladesh. We are very hopeful to start our
              new journey from here with first and foremost customer
              satisfaction. If you have any problem with any of our products or
              not satisfied with our services, please contact us. We will do our
              best to satisfy your needs. Your thoughtful suggestions and ideas
              are also welcome.
            </p>
            <p className="mt-2" style={{ fontSize: "15px" }}>
              We have further improved our site and made it more user friendly.
              New features and products are being added regularly. Please be
              sure to download our Mobile App.
            </p>
            <p className="mt-2" style={{ fontSize: "15px" }}>
              Thank you for your support and for being our customer.
            </p>
            {localStorage.getItem("region") === "Bangladesh" && <p className="mt-2" style={{ fontSize: "15px" }}>
              Bangladesh Trade License: TRAD/DSCC/003746/2020
            </p>}
            {localStorage.getItem("region") === "Bangladesh" && <Link to="#" onClick={() => setShowModal(!ShowModal)}>
              Click here to see Bangladesh TIN certificate.
            </Link>}

            <p className="mt-2" style={{ fontSize: "15px" }}>
              Registered Address :{" "}{localStorage.getItem("region") === "Bangladesh" ? "269/4 Fakirapool 2nd Floor, Dhaka 1000, Bangladesh" : "P.O. Box 2765, Atlanta, GA 30097, USA"}
            </p>
          </div>

        </div>
      </div>
      <NewsLetter />
      <Footer />
      <Modal
        isOpen={ShowModal}
        toggle={() => setShowModal(!ShowModal)}
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={() => setShowModal(!ShowModal)} className="landing-signin"></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xl-11 col-lg-11 col-md-12 col-sm-12 m-auto">
              <div className="text-center">
                <img className="img-fluid" src={BanglaTin} />
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
}
export default AboutUs;
