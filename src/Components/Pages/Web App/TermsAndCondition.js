import { WebsiteHeader } from "./Layout/Header";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useEffect } from "react";
function TermsAndCondition() {
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
                Terms and conditions
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="text-center">
            <h2 className="text-default">Terms & Conditions</h2>
          </div>
          <div className="container mt-3">
            <div>
              <h5>Age Restriction</h5>
              <p style={{ fontSize: "15px" }}>
                BanglaBazar cannot prohibit minors from visiting this site. We
                must rely on parents, guardians and those responsible for
                supervising children under the age of 18 to decide which
                materials are appropriate for such children to view and/or
                purchase. No one should use this site under the age of 18
                without the parent's or guardian's permission.
              </p>
            </div>
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
              <h5>IP Address </h5>
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
            <div>
              <h5>Entire Agreement </h5>
              <p style={{ fontSize: "15px" }}>
                These Terms of Service constitute the entire agreement between
                the parties with respect to the subject matter hereof and
                supersedes and replaces all prior or contemporaneous
                understandings or agreements, written or oral, regarding such
                subject matter. We have the right to change this policy at any
                time. Any new changes will be posted on this page. Registered
                users will receive an email notification.
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
export default TermsAndCondition;
