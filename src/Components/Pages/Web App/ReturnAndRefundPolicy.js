import { WebsiteHeader } from "./Layout/Header";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useEffect } from "react";
function RefundAndReturnPolicy() {
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
                Refund and return
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="text-center">
            <h2 className="text-default">Refund & Return Policy</h2>
          </div>
          <div className="container mt-3">
            <p style={{ fontSize: "15px" }}>
              Our return policy is simple and hassle-free. You may return any item for an exchange, as long as the product is in its original resalable condition. Refund process will be done within 10 working days after receiving refund request from customer. Please contact us to coordinate the return shipment of the product.
            </p>
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default RefundAndReturnPolicy;
