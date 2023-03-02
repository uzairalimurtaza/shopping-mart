import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import firetoast from "../../../../Helpers/FireToast";
import Endpoint from "../../../../Utils/Endpoint";
import BanglaBazarApi from "../../../Api/BanglaBazarApi";
import InvoiceForm from "../../Admin panel/Pages/Order Management/InvoiceForm";

export function OrderInvoicePrint() {
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
        `${Endpoint}/api/admin/getVendorOrder/${orderNumber}`
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
      <div className="row m-0">
        <div className="col-10 m-auto">
          <div className="card mt-2">
            <div className="card-body">
              <InvoiceForm
                OrderDeliveryDetails={OrderDeliveryDetails}
                OrderDetails={OrderDetails}
                getOrderDetails={getOrderDetails}
                type={"user"}
              />{" "}
            </div>{" "}
          </div>{" "}
        </div>
      </div>
    </div>
  ) : null;
}
