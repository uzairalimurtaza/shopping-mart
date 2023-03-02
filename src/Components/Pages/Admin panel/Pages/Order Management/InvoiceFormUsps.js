import moment from "moment";
import Endpoint from "../../../../../Utils/Endpoint";
import BanglaLogo from "./../../../../../assets/images/favicon.png";
import Icons from "../../../../../Utils/Icons";
import firetoast from "../../../../../Helpers/FireToast";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
  } from "reactstrap";

function setPageSize(cssPageSize) {
  const style = document.createElement("style");
  style.innerHTML = `@page {size: ${cssPageSize}}`;
  style.id = "page-orientation";
  document.head.appendChild(style);
}

function InvoiceFormUsps({
  OrderDeliveryDetails,
  OrderDetails,
  getOrderDetails,
  orientation = "portrait",
  type,
}) {
    const [isModalOpenState, setIsModalOpenState] = useState(false);
    const toggle = () => setIsModalOpenState(!isModalOpenState);
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
    } catch (e) {
      firetoast("Something went wrong", "default-error");
    }
  };
  let MarkOrderBooked =async (BookingNumber,TrackingNumber)=>
  {
    const response = await BanglaBazarApi.post(
        `${Endpoint}/api/usps/mark-assigned`,
        { BookingNumber:BookingNumber,
          TrackingNumber:TrackingNumber,
        OrderNumber:OrderDeliveryDetails.OrderNumber }
      );
      if (response.data.status) {
        getOrderDetails();
        toggle();
      } else {
        const { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
  }
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
  return (
    <div className="container">
      {OrderDeliveryDetails && (
        <div className="col-md-12">
          <div className="invoice" id="invoice">
            <div className="invoice-company text-inverse d-flex justify-content-between">
              <div>
                <img src={BanglaLogo} style={{ height: "25px" }} /> BanglaBazar{" "}
              </div>
              {console.log(OrderDetails ,"OrderDetails.UspsOrderStatus")}
              <div>
                {OrderDetails.ProcessStatus === "Processing" && OrderDetails.UspsOrderStatus === "On Panel" &&(
                  <span>{Icons.GreenTick} Order Placed on USPS Panel</span>
                )}
                 {OrderDetails.ProcessStatus === "Assigned" && OrderDetails.UspsOrderStatus === "Booked" && (
                  <span>{Icons.GreenTick} Order Assigned</span>
                )}
               {OrderDetails.AllowAdminPickup === "Y" &&
                  OrderDetails.ReadyPickupForAdmin === "Y" && (OrderDetails.DeliveryStatus ==="usps" || OrderDetails.DeliveryStatus ==="usps_intl" )
                   && OrderDetails.UspsOrderStatus === "NULL" &&
                  (OrderDetails.ProcessStatus === "Processing" ||
                    OrderDetails.ProcessStatus === "On the Way" ) && (
                    <button
                      className="btn btn-success btn-md"
                      onClick={() => {
                          assignOrder();
                      }}
                    >
                      Assign Order
                    </button>
                  )}
                {/* {OrderDetails.UspsOrderStatus === "NULL" && OrderDetails.DeliveryStatus === "usps" && (
                    <button
                      className="btn btn-default"
                      onClick={() => toggle()}
                    >
                      Mark Order Booked for USPS
                    </button>
                  )} */}
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
      <div>
      {/* <Modal isOpen={isModalOpenState} toggle={toggle} size="lg" centered>
          <ModalHeader toggle={toggle}>USPS BookingNumber</ModalHeader>
          <ModalBody>
           <p className="text-dark">
              Enter USPS Booking Number for OrderNumber
            </p>
            <div className="col-md-6 col-sm-12">
                  <label>
                    Booking Number
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter Order Booking Number"
                    name="BookingNumber"
                    id = "bookingNumber"
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>
                  Tracking Number 
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter USPS Order Tracking Number"
                    name="TrackingNumber"
                    id = "trackingNumber"
                  />
                </div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-default" onClick={() => {
                var bookingNumber = document.getElementById("bookingNumber").value
                var trackingNumber = document.getElementById("trackingNumber").value

                if(!bookingNumber){
                    firetoast("BookingNumber is required ","default-error")
                }
                else if(!trackingNumber){
                  firetoast("TrackingNumber is required ","default-error")
                }
                else{
                    MarkOrderBooked(bookingNumber,trackingNumber)
                }
                }}>
              Assign
            </Button>
          </ModalFooter>
        </Modal> */}
      </div>
    </div>
    
  );
}
export default InvoiceFormUsps;
