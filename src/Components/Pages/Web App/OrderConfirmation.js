import { WebsiteHeader } from "./Layout/Header";
import { useEffect } from "react";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
// import { BreadcrumbItem, Breadcrumb } from "reactstrap";
import ConfirmOrder from "../../../assets/images/order-confimation.svg";
import { useParams, useHistory } from "react-router-dom";
function OrderConfirmation() {
  const history = useHistory();
  const { orderID } = useParams();
  useEffect(() => {
    localStorage.removeItem("pC_detail");
    localStorage.removeItem("p_detail");
    localStorage.removeItem("pp");
    localStorage.removeItem("u_d");
  }, []);
  return (
    <>
      <WebsiteHeader />

      <div className="container">
        <div className="mt-4">
          <div className="row">
            <div className="col-lg-6 col-md-8 col-sm-10 m-auto">
              <div className="text-center">
                <img src={ConfirmOrder} className=" h-50 w-50" />
                <h5 className="text-secondary mt-1">
                  {" "}
                  Order Number : {orderID}
                </h5>
                <p style={{ margin: "0px 40px" }}>
                  <b>
                    Thank you for placing your order! Your order is now complete
                    and we already started processing it.
                  </b>
                </p>
                <div className="mt-2">
                  <div className="d-flex" style={{ justifyContent: "center" }}>
                    <div style={{ marginRight: "15px" }}>
                      <button
                        className="btn btn-default-outline"
                        onClick={() => history.push("/order-details")}
                      >
                        View Order
                      </button>
                    </div>
                    <div>
                      <button
                        className="btn btn-success"
                        style={{ padding: "7px 12px" }}
                        onClick={() => history.push("/")}
                      >
                        Continue Shopping
                      </button>
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
export default OrderConfirmation;
