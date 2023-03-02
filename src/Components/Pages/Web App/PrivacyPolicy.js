import { WebsiteHeader } from "./Layout/Header";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useEffect } from "react";
function PrivacyPolicy() {
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
                Privacy policy
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="text-center">
            <h2 className="text-default">Privacy Policy</h2>
          </div>
          <div className="container mt-3">
            <div>
              <h5>Your Security</h5>
              <p style={{ fontSize: "15px" }}>
                Our Web site encrypts your credit card number prior to
                transmission over the Internet using secure socket layer (SSL)
                encryption technology. This technology works best when the site
                is viewed using Google Chrome. However, no transmission of data
                over the Internet or any other public network can be guaranteed
                to be 100% secure. Although we make reasonable efforts to
                safeguard your personal information once we receive it.
              </p>
            </div>
            <div>
              <h5>IP Address</h5>
              <p style={{ fontSize: "15px" }}>
                BanglaBazar stores the IP (Internet protocol) addresses of its
                all users. This information, which is reported by your browser,
                is stored in our database and can be used for various reasons.
                We can use your IP address to improve technology problems
                reported by our users, compile a statistical database of user
                types, keep track of the type of requests is coming from an IP
                address and etc.
              </p>
            </div>
            <div>
              <h5>Personal Information </h5>
              <p style={{ fontSize: "15px" }}>
                BanglaBazar will not sell or rent your personal information to
                anyone. We, or our business partners, may send you e-mails time
                to time with service update information or to extend special
                offers from other partners your way.
              </p>
            </div>
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default PrivacyPolicy;
