import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import firetoast from "../../../../../Helpers/FireToast";
import Endpoint from "../../../../../Utils/Endpoint";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import InvoiceFormUsps from "./InvoiceFormUsps";

function OrderDetailUsps() {
  const history = useHistory();
  const [OrderDetails, setOrderDetails] = useState(null);
  const [OrderDeliveryDetails, setOrderDeliveryDetails] = useState(null);
  const { orderNumber, type } = useParams();

  useEffect(() => {
    getOrderDetails();
  }, []);
  var getOrderDetails = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/orderDetails/${orderNumber}`
      );
      setOrderDetails(response.data.orderDetails);
      setOrderDeliveryDetails(response.data.orderShippingDetail);
    } catch (e) {
      firetoast(
        "Something went wrong while fetching order details",
        "default-error"
      );
    }
  };

  return OrderDetails ? (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">
          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => history.push("/panel/dashboard")}
          >
            <i className="fas fa-chevron-left">
                 </i>{" "}
          </span>
          Order Details - {OrderDetails.OrderNumber}{" "}
        </h3>{" "}
      </div>{" "}
      <div className="card mt-2">
        <div className="card-body">
          <InvoiceFormUsps
            OrderDeliveryDetails={OrderDeliveryDetails}
            OrderDetails={OrderDetails}
            getOrderDetails={getOrderDetails}
            type={type}
          />{" "}
        </div>{" "}
      </div>{" "}
    </div>
  ) : null;
}
export default OrderDetailUsps;
