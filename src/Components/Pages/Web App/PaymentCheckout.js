import { useHistory, useLocation } from "react-router-dom";
import SuccessTrasaction from "../../../assets/images/success-transaction.svg";
import CancelTrasaction from "../../../assets/images/cancel-transaction.svg";
import FailedTrasaction from "../../../assets/images/failed-transaction.svg";
import { Spinner } from "reactstrap";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { SetPaymentStatus } from "./../../../Actions/PaymentAction";
import firetoast from "./../../../Helpers/FireToast";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Endpoint from "./../../../Utils/Endpoint";
function PaymentCheckout() {
  const history = useHistory();
  const dispatch = useDispatch();
  const search = useLocation().search;
  const name = new URLSearchParams(search).get("status");
  const paymentType = new URLSearchParams(search).get("paymentType");
  const failure_message = new URLSearchParams(search).get("failure_message");
  let clearOrderDetails = async (orderStatus) => {
    var orderNumber = localStorage.getItem("o_n");
    try {
      const response = await BanglaBazarApi.delete(
        `${Endpoint}/api/payment/clear-payment/${orderNumber}/${orderStatus}`
      );
      if (response.data.status) {
        localStorage.removeItem("pC_detail");
        localStorage.removeItem("u_d");
        // localStorage.removeItem("o_n");
        localStorage.removeItem("p_detail");
      } else {
        var { message, error } = response.data;
        firetoast(error || message, "default-error");
      }
    } catch (e) {
      firetoast("Unable to clear order details", "default-error");
    }
  };
  var isMobile = {
    Android: function () {
      return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
      return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
      return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
      return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
      return (
        navigator.userAgent.match(/IEMobile/i) ||
        navigator.userAgent.match(/WPDesktop/i)
      );
    },
    any: function () {
      return (
        isMobile.Android() ||
        isMobile.BlackBerry() ||
        isMobile.iOS() ||
        isMobile.Opera() ||
        isMobile.Windows()
      );
    },
  };
  useEffect(async () => {
    const isAnyMobile = isMobile.any();

    if (!isAnyMobile) {
      if (name === "failed" || name === "cancel") {
        await clearOrderDetails(name);
        setTimeout(() => {
          window.location.href = "/my-cart";
        }, 3000);
      } else if (name === "success" || name === "pending") {
        dispatch(SetPaymentStatus(name));
        history.push(`/my-cart/order-details/${name}/${paymentType}`);
      }
    }
  }, []);

  return (
    <div style={{ height: "100vh" }}>
      <div className="row m-0">
        <div className="col-lg-6 col-md-8 col-sm-10 m-auto ">
          {name === "success" && (
            <div className="text-center mt-5">
              <h4 className="text-default">Your Transaction was successful!</h4>
              <img src={SuccessTrasaction} className="h-50 w-50" />
            </div>
          )}
          {name === "cancel" && (
            <div className="text-center mt-5">
              <h4 className="text-danger">
                <Spinner color="danger" size="md" /> Transaction was cancelled
                by user!
              </h4>
              <img src={CancelTrasaction} className="h-50 w-50" />
            </div>
          )}
          {name === "failed" && (
            <div className="text-center mt-5">
              <h4 className="text-danger">{failure_message}</h4>
              <img src={FailedTrasaction} className="h-50 w-50" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default PaymentCheckout;
