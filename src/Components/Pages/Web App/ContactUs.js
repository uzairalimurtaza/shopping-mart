import { WebsiteHeader } from "./Layout/Header";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useEffect, useState } from "react";
import { reCAPTCHA_SITE_KEY } from "./../../../Utils/Captcha";
import ReCAPTCHA from "react-google-recaptcha";
function ContactUs() {
  const [Captcha, setCaptcha] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);
  var handleCaptchaChange = (value) => {
    setCaptcha(value);
  };
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
                Contact Us
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="text-center">
            <h2 className="text-default">Contact Us</h2>
          </div>
          <div className="container mt-3">
            <div className="text-center" style={{ fontSize: "16px" }}>
              <b style={{ color: "#ababab" }}>
                Please get in touch and our expert support team will answer all
                your questions.
              </b>
            </div>
            <div className="row">
              <div className="col-8 m-auto">
                <div className="container mb-3">
                  <div className="row  mt-2">
                    <div className="col-md-10 col-sm-12 m-auto">
                      <label for="exampleInputEmail1"> Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div className="row mt-2 ">
                    <div className="col-md-10 col-sm-12 m-auto">
                      <label for="exampleInputEmail1">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  <div className="row  mt-2">
                    <div className="col-md-10 col-sm-12 m-auto">
                      <label for="exampleInputEmail1">Subject</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-10 col-sm-12 m-auto">
                      <label for="exampleInputEmail1">Message</label>
                      <textarea className="form-control" rows={"5"} />
                      <div className="mt-2">
                        <div className="mt-3">
                          <ReCAPTCHA
                            sitekey={reCAPTCHA_SITE_KEY}
                            onChange={handleCaptchaChange}
                          />
                        </div>

                        <div className="mt-2">
                          <button
                            className="btn btn-success btn-block btn-lg"
                            disabled={!Captcha}
                          >
                            Submit
                          </button>
                        </div>
                        <div className="mt-3">
                          Registered Address:{" "}{localStorage.getItem("region") === "Bangladesh" ? "269/4 Fakirapool 2nd Floor, Dhaka 1000, Bangladesh" : "P.O. Box 2765, Atlanta, GA 30097, USA"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default ContactUs;
