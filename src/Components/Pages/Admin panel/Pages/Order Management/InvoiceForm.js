import moment from "moment";
import Endpoint from "../../../../../Utils/Endpoint";
import BanglaLogo from "./../../../../../assets/images/favicon.png";
import Icons from "../../../../../Utils/Icons";
import firetoast from "../../../../../Helpers/FireToast";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
function setPageSize(cssPageSize) {
  const style = document.createElement("style");
  style.innerHTML = `@page {size: ${cssPageSize}}`;
  style.id = "page-orientation";
  document.head.appendChild(style);
}

function InvoiceForm({
  OrderDeliveryDetails,
  OrderDetails,
  getOrderDetails,
  orientation = "portrait",
  type,
}) {
  const [ByDeliveryDriver, setByDeliveryDriver] = useState([]);
  const [ByDeliveryClient, setByDeliveryClient] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // setPageSize(orientation);
    // return () => {
    //   const child = document.getElementById("invoice");
    //   child.parentNode.removeChild(child);
    // };
    if (OrderDetails) {
      let currentOrders = OrderDetails.ProductDetail;
      let array1 = [];
      let array2 = [];
      let array3 = [];

      for (let i = 0; i < currentOrders.length; i++) {
        console.log(currentOrders[i]);

        if (currentOrders[i].DeliveryDriverID) {
          array1.push(currentOrders[i]);
        } else if (currentOrders[i].ConsignmentId) {
          array2.push(currentOrders[i]);
        }
      }
      setByDeliveryDriver(array1);
      setByDeliveryClient(array2);
    }
  }, [OrderDetails]);
  let getSingleTotal = (status, item) => {
    let product = item;
    let array = item["ProductCombinations"];
    let basePrice = parseFloat(product.BasePrice);
    let variantValues = [];
    var variationsSum = 0;
    for (let i = 0; i < array.length; i++) {
      variationsSum += parseFloat(array[i].ProductCombinationPrice);
      variantValues.push(array[i].OptionValue);
    }
    const totalSingle = basePrice + variationsSum;

    if (status === 0) {
      return totalSingle;
    } else if (status === 1) {
      return parseFloat(item.Quantity) * totalSingle;
    } else {
      return variantValues.join(",");
    }
  };
  let getOverAllTotal = () => {
    var totalCount = 0;
    let indexes = OrderDetails["ProductDetail"];
    for (let i = 0; i < indexes.length; i++) {
      let currentProduct = indexes[i];
      let currentCombination = currentProduct["ProductCombinations"];
      totalCount += parseFloat(currentProduct.BasePrice);
      for (let j = 0; j < currentCombination.length; j++) {
        totalCount += parseFloat(currentCombination[j].ProductCombinationPrice);
      }
      totalCount = totalCount * parseInt(currentProduct.Quantity);
    }
    return totalCount;
  };
  let ChangeOrderStatus = async (Status) => {
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/update-status/${OrderDetails.OrderNumber}`,
        { Status }
      );
      if (response.data.status) {
        {firetoast("Order marked ready", "success", 2000, "top-center")}
        getOrderDetails();
      } else {
        const { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong", "default-error");
    }
  };
  let ChangePickUpStatus = async () => {
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/courier/change-pickupStatus`,
        {
          OrderNumber: OrderDetails.OrderNumber,
        }
      );
      if (response.data.status) {
        firetoast("Order marked ready", "success", 2000, "top-center");
        setTimeout(() => {
          history.push("/panel/order-management");
        }, 2000);
      } else {
        const { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong", "default-error");
    }
  };
  var assignOrder = async () => {
    try {
      //OrderDeliveryDetails.OrderNumber
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/deliveryDriver/assign-driver`,
        {
          OrderNumber: OrderDeliveryDetails.OrderNumber,
        }
      );
      if (response.data.status) {
        firetoast("Order Assigned", "success", 2000, "top-right");
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong while assigning", "default-error");
    }
  };
  var downloadHtml = () => {
    // const input = document.getElementById("invoice");
    // html2canvas(input).then((canvas) => {
    //   const imgData = canvas.toDataURL("image/png");
    //   const pdf = new jsPDF();
    //   pdf.addImage(imgData, "JPEG", 0, 0);
    //   // pdf.output('dataurlnewwindow');
    //   pdf.save("download.pdf");
    // });
  };
  function PrintElem(elem) {
    var mywindow = window.open("", "PRINT", "height=842,width=595");

    mywindow.document.write(
      "<html><head><title>" + document.title + "</title>"
    );
    mywindow.document.write("</head><body >");
    mywindow.document.write("<h1>" + document.title + "</h1>");
    mywindow.document.write(document.getElementById(elem).innerHTML);
    mywindow.document.write("</body></html>");

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    mywindow.print();
    mywindow.close();

    return true;
  }
  return (
    <div className="container">
      {OrderDeliveryDetails && (
        <div className="col-md-12">
          <div className="invoice" id="invoice">
            <div className="invoice-company text-inverse d-flex justify-content-between">
              <div>
                <img src={BanglaLogo} style={{ height: "25px" }} /> BanglaBazar{" "}
              </div>

              <div>
                {OrderDetails.ProcessStatus === "Assigned" && (
                  <span>{Icons.GreenTick} Order Assigned</span>
                )}
                {OrderDetails.AllowAdminPickup === "Y" && 
                  OrderDetails.ReadyPickupForAdmin === "N" && (
                    <button
                      className="btn btn-default"
                      onClick={() => ChangeOrderStatus("1")}
                    >
                      Mark ready to deliver
                    </button>
                    
                  )}
                {OrderDetails.ProcessStatus !== "Assigned" &&
                  OrderDetails.AllowStorePickup === "Y" &&
                  OrderDetails.ReadyPickupForUser === "N" && (
                    <button
                      className="btn btn-default"
                      onClick={() => ChangePickUpStatus()}
                    >
                      Mark ready for user
                    </button>
                  )}
                  {console.log(OrderDetails.DeliveryStatus,"OrderDetails.DeliveryStatus " )}
                {OrderDetails.AllowAdminPickup === "Y" &&
                  OrderDetails.ReadyPickupForAdmin === "Y" && OrderDetails.DeliveryStatus !=="usps" && OrderDetails.DeliveryStatus !=="usps_intl"  &&
                  (OrderDetails.ProcessStatus === "Processing" ||
                    OrderDetails.ProcessStatus === "On the Way" ) && (
                    <button
                      className="btn btn-success btn-md"
                      onClick={() => {
                        if (OrderDetails.DeliveryStatus === "VS") {
                          history.push(
                            `/panel/vendor-delivery/${OrderDetails.OrderNumber}`
                          );
                        } else {
                          assignOrder();
                        }
                      }}
                    >
                      Assign Order
                    </button>
                  )}
                  {console.log(OrderDetails,"OrderDetails")}
                   {
                  OrderDetails.AllowAdminPickup === "Y" &&
                  OrderDetails.ReadyPickupForAdmin === "Y" && OrderDetails.ProcessStatus === "Processing" &&
                   (OrderDetails.DeliveryStatus ==="usps" || OrderDetails.DeliveryStatus ==="usps_intl") && (
                    <p>USPS Orders will be handled & Assigned by Admin</p>
                  )}
                {OrderDetails.AllowStorePickup === "Y" &&
                  OrderDetails.ReadyPickupForUser === "Y" && (
                    <span>{Icons.GreenTick} Ready for user pickup</span>
                  )}
              </div>
            </div>
            <div className="invoice-header">
              <div className="invoice-from">
                <address className="m-t-5 m-b-5">
                  <strong className="text-inverse">from</strong>
                  <br />
                  {OrderDeliveryDetails.Address1}
                  <br />
                  {OrderDeliveryDetails.City}, {OrderDeliveryDetails.ZipCode}
                  <br />
                  Phone: {OrderDeliveryDetails.PhoneNumber}
                </address>
              </div>
              <div className="invoice-to">
                <address className="m-t-5 m-b-5">
                  <strong className="text-inverse">to</strong>
                  <br />
                  {OrderDeliveryDetails.DeliveryAddress1}
                  <br />
                  {OrderDeliveryDetails.DeliveryCity},{" "}
                  {OrderDeliveryDetails.DeliveryZipCode}
                  <br />
                  Phone: {OrderDeliveryDetails.DeliveryPhoneNumber}
                </address>
              </div>
              <div className="invoice-date">
                <small>Invoice</small>
                <div className="date text-inverse m-t-5">
                  {OrderDeliveryDetails.DesireDate &&
                    moment(OrderDeliveryDetails.DesireDate).format(
                      "DD-MM-YYYY"
                    )}
                </div>
                <div className="invoice-detail">
                  Order#: {OrderDeliveryDetails.OrderNumber}
                  <br />
                  TranId#: {OrderDetails.TransactionID}
                </div>
              </div>
            </div>
            <div className="invoice-content">
              <div className="table-responsive">
                <table className="table table-invoice">
                  <thead>
                    <tr>
                      <th className="text-center">PRODUCT</th>
                      <th className="text-center">VARIATIONS</th>
                      <th className="text-center">PRICE</th>
                      <th className="text-center">QUANTITY</th>
                      <th className="text-center">SUBTOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {OrderDetails["ProductDetail"].map((item, index) => (
                      <tr key={index} className="text-center">
                        <td>
                          <div>{item.Title}</div>
                        </td>
                        <td>{getSingleTotal(2, item)}</td>
                        <td>{`${item.Currency} ${getSingleTotal(0, item)}`}</td>
                        <td>
                          {" "}
                          <div className="product-quantity">
                            {item.Quantity}
                          </div>
                        </td>
                        <td>{`${item.Currency} ${getSingleTotal(1, item)}`}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="invoice-price">
                <div className="invoice-price-left">
                  <div className="invoice-price-row">
                    <div className="sub-price">
                      <small>SUBTOTAL</small>
                      <span className="text-inverse">
                        {OrderDetails.ProductDetail[0].Currency}{" "}
                        {getOverAllTotal().toFixed(2)}
                      </span>
                    </div>
                    {/* <div className="sub-price">
                      <i className="fa fa-plus text-muted"></i>
                    </div>
                    <div className="sub-price">
                      <small>Shipment Fee (15%)</small>
                      <span className="text-inverse">
                        {" "}
                        {OrderDetails.ProductDetail[0].Currency}{" "}
                        {getOverAllTotal() * 0.15}
                      </span>
                    </div> */}
                  </div>
                </div>
                <div className="invoice-price-right">
                  <small>TOTAL</small>{" "}
                  <span className="f-w-600">
                    {" "}
                    {OrderDetails.ProductDetail[0].Currency}{" "}
                    {getOverAllTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            {type === "user" && (
              <div className="invoice-note">
                <h5>Your Signature</h5>
                <div
                  className="mt-5 w-25"
                  style={{ borderBottom: "1px solid black" }}
                ></div>
              </div>
            )}
          </div>
          {type === "user" && (
            <button
              onClick={() => window.print()}
              className="btn btn-success btn-sm"
            >
              Download
            </button>
          )}
        </div>
      )}
    </div>
  );
}
export default InvoiceForm;
