import { WebsiteHeader } from "./Layout/Header";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { useHistory, useParams, Link } from "react-router-dom";
import chatIcon from "../../../assets/images/chat-icon.png";
import { useEffect, useState } from "react";
import firetoast from "../../../Helpers/FireToast";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Endpoint from "./../../../Utils/Endpoint";
import moment from "moment";
import ODByONProductItem from "./Order Detail Component/ODByONProductItem";
import CapitalizeFirstWord from "../../../Utils/CapitalizeFirstWord";
function OrderDetailByOrderNumber() {
  const history = useHistory();
  const { orderNumber } = useParams();
  const [OrderDetails, setOrderDetails] = useState(null);
  const [DeliveryDetails, setDeliveryDetails] = useState(null);
  const [OrderShippingDetail, setOrderShippingDetail] = useState(null);
  const [ProductDetails, setProductDetails] = useState(null);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [StatusList, setStatusList] = useState(null);
  const [DriverDeliveryDetails, setDriverDeliveryDetails] = useState(null);
  const [PickUpUserDetails, setPickUpByUserDetails] = useState(null);
  useEffect(() => {
    getOrderDetails(orderNumber);
  }, []);

  let getOrderDetails = async (orderNumber) => {
    try {
      const response = await BanglaBazarApi(
        `${Endpoint}/api/admin/orderDetails/${orderNumber}`
      );
      console.log(response);
      setOrderDetails(response.data.orderDetails);
      setProductDetails(response.data.orderDetails.ProductDetail);
      setOrderShippingDetail(response.data.orderShippingDetail);
      setDriverDeliveryDetails(response.data.deliveryDriverDetails);
      setPickUpByUserDetails(response.data.getStorePickupDetails);

      let total_products = response.data.orderDetails.ProductDetail;
      let productPrice = 0;
      for (let i = 0; i < total_products.length; i++) {
        let currentCombinations = total_products[i].ProductCombinations;
        console.log(currentCombinations);

        let combinationSum = 0;
        productPrice += parseFloat(total_products[i].BasePrice);
        for (let j = 0; j < currentCombinations.length; j++) {
          combinationSum += parseFloat(
            currentCombinations[j].ProductCombinationPrice
          );
        }
        productPrice += combinationSum;
      }
      setTotalPrice(productPrice);
      setStatusList(
        response.data.orderDetails.StatusHistory
          ? JSON.parse(response.data.orderDetails.StatusHistory)
          : null
      );
    } catch (e) {
      console.log(e);
      firetoast("Something went wrong", "default-error");
    }
  };
  let messageBlock = (status_list) => {
    let order = OrderDetails;

    if (order.ProcessStatus === "Processing") {
      return (
        <>
          <div className="col-1"></div>
          <div className="col-5">
            <div id="chat">
              <div className="you">
                <div className="triangle"></div>
                <div className="message">
                  <div className="text-light-grey">
                    Placed Date :{" "}
                    {moment(status_list[0]).format("dddd, MMMM Do YYYY")}
                  </div>
                  Thank you for shopping at BanglaBazar. Your order is being
                  verified.
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (order.ProcessStatus === "Assigned") {
      return (
        <>
          <div className="col-4"></div>
          <div className="col-5">
            <div id="chat">
              <div className="you">
                <div className="triangle"></div>
                <div className="message">
                  <div className="text-light-grey">
                    Placed Date :{" "}
                    {moment(status_list[1]).format("dddd, MMMM Do YYYY")}
                  </div>
                  Your order is ready to dispatch!
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (
      order.ProcessStatus === "Picked" ||
      order.ProcessStatus === "Shipped" ||
      order.ProcessStatus === "On the Way"
    ) {
      return (
        <>
          <div className="col-3"></div>
          <div className="col-5">
            <div id="chat">
              <div className="you" style={{ position: "relative" }}>
                <div
                  className="triangle"
                  style={{ position: "absolute", top: "-10px", right: "20px" }}
                ></div>
                <div className="message" style={{ position: "relative" }}>
                  <div className="text-light-grey">
                    Placed Date :{" "}
                    {moment(status_list[2]).format("dddd, MMMM Do YYYY")}
                  </div>
                  Your order is on the way!
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (order.ProcessStatus === "Delivered") {
      return (
        <>
          <div className="col-6"></div>
          <div className="col-5">
            <div id="chat">
              <div className="you" style={{ position: "relative" }}>
                <div
                  className="triangle"
                  style={{ position: "absolute", top: "-10px", right: "20px" }}
                ></div>
                <div className="message" style={{ position: "relative" }}>
                  <div className="text-light-grey">
                    Placed Date :{" "}
                    {moment(status_list[3]).format("dddd, MMMM Do YYYY")}
                  </div>
                  Your order is delivered! Thank you for shopping on banglabazar
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      return null;
    }
  };
  let getDeliveryInformation = () => {
    let order = OrderDetails;
    if (order) {
      if (order.DeliveryStatus === "pathao") {
        return (
          <div className="card mt-3">
            <div className="card-body">
              <h5>Delivery Details</h5>
              <div className="mt-2">
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fas fa-truck-couch text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    {" "}
                    <div>
                      Courier delivery by{" "}
                      <span
                        className="text-default"
                        style={{ fontSize: "13px" }}
                      >
                        {CapitalizeFirstWord(order.DeliveryStatus)}
                      </span>
                    </div>{" "}
                  </div>
                </div>
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fas fa-sticky-note text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <div>
                      Tracking #{" "}
                      <span
                        className="text-default"
                        style={{ fontSize: "13px" }}
                      >
                        {order.ConsignmentId
                          ? order.ConsignmentId
                          : "Order not assigned yet"}
                      </span>
                    </div>{" "}
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <h5>
                    <div style={{ marginLeft: "10px" }}>
                      Track your order ,{" "}
                      <a
                        href={`https://merchant.pathao.com/tracking?consignment_id=${
                          order.ConsignmentId
                        }&phone=${
                          OrderShippingDetail &&
                          OrderShippingDetail.DeliveryPhoneNumber
                        }`}
                        className="td-none text-default"
                        target="_blank"
                      >
                        {" "}
                        here!
                      </a>
                    </div>
                  </h5>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (order.DeliveryStatus === "dd" && DriverDeliveryDetails) {
        return (
          <div className="card mt-3">
            <div className="card-body">
              <h5>Delivery Details</h5>
              <div className="mt-2">
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fas fa-truck-couch text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    {" "}
                    <div>
                      Courier delivery by{" "}
                      <span
                        className="text-default"
                        style={{ fontSize: "13px" }}
                      >
                        BanglaBazar Delivery Driver
                      </span>
                    </div>{" "}
                  </div>
                </div>
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fad fa-user text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    Driver Name :{" "}
                    <span className="text-default" style={{ fontSize: "13px" }}>
                      {DriverDeliveryDetails.UserName}
                    </span>
                  </div>
                </div>
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fas fa-phone-alt text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    Driver Contact :{" "}
                    <span className="text-default" style={{ fontSize: "13px" }}>
                      {DriverDeliveryDetails.PhoneNumber}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (order.DeliveryStatus === "dd" && PickUpUserDetails) {
        return (
          <div className="card mt-3">
            <div className="card-body">
              <h5>Pick up details</h5>
              <div className="mt-2">
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fas fa-truck-couch text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    {" "}
                    <div>Courier to be picked by user</div>{" "}
                  </div>
                </div>
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fad fa-user text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    Vendor Business :{" "}
                    <span className="text-default" style={{ fontSize: "13px" }}>
                      {PickUpUserDetails.CompanyName}
                    </span>
                  </div>
                </div>
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fas fa-map-marked text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    Store Address :{" "}
                    <span className="text-default" style={{ fontSize: "13px" }}>
                      {PickUpUserDetails.Address1}
                    </span>
                  </div>
                </div>
                <div className="mt-3 d-flex ">
                  <div>
                    <i class="fas fa-phone-alt text-default fa-2x"></i>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    Store Contact :{" "}
                    <span className="text-default" style={{ fontSize: "13px" }}>
                      {PickUpUserDetails.StorePhone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  };
  return (
    <>
      <WebsiteHeader />

      <div className="container">
        <>
          <div className="pt-2 pb-0">
            <Breadcrumb listTag="div">
              <BreadcrumbItem
                onClick={() => history.push("/order-details")}
                className="td-none"
                style={{ color: "#B1B1B1", cursor: "pointer" }}
              >
                Home
              </BreadcrumbItem>
              <BreadcrumbItem
                // href="/order-details"
                // tag=""
                onClick={() => history.push("/order-details")}
                className="td-none"
                style={{ color: "#787878", cursor: "pointer" }}
              >
                Order
              </BreadcrumbItem>
              <BreadcrumbItem
                onClick={() => history.push(`/order-details/${orderNumber}`)}
                className="td-none"
                style={{ color: "#787878", cursor: "pointer" }}
              >
                {orderNumber}
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <h4 className="text-default ftw-400">Order Details</h4>
          <div className="mt-4">
            <div className="row">
              <div className="col-8">
                <div className="card">
                  <div className="card-header bg-white">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="ftw-400">
                          Order :{" "}
                          <Link className="td-none" to="#">
                            {orderNumber}
                          </Link>
                        </h6>
                        <div>
                          <p className="mb-0 pb-0">
                            Placed Date:{" "}
                            {OrderDetails &&
                              moment(OrderDetails.OrderDate).format(
                                "dddd, MMMM Do YYYY"
                              )}{" "}
                          </p>
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/order-invoice/${orderNumber}`}
                          className="text-default td-none"
                        >
                          View Invoice
                        </Link>
                      </div>
                      <div>
                        <span>
                          <img src={chatIcon} className="img-fluid h-50 w-25" />{" "}
                          Chat now
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <div style={{ marginTop: "50px" }}>
                      <div
                        className="container"
                        style={{ position: "relative" }}
                      >
                        <div className="steps-wizard"></div>
                        <div
                          className="row m-0 w-100"
                          style={{
                            position: "absolute",
                            top: "-20px",
                            left: "1px",
                          }}
                        >
                          <div
                            className="col-3"
                            style={{ position: "relative" }}
                          >
                            <div
                              className={
                                OrderDetails &&
                                OrderDetails.ProcessStatus === "Processing"
                                  ? "step-circle"
                                  : "step-circle-white"
                              }
                            >
                              <div className="step-circle-count">1</div>
                            </div>
                            <div
                              className="text-center mt-2"
                              style={{ fontSize: "14px" }}
                            >
                              Processing
                            </div>
                          </div>
                          <div
                            className="col-3 "
                            style={{ position: "relative" }}
                          >
                            <div
                              className={
                                OrderDetails &&
                                OrderDetails.ProcessStatus === "Assigned"
                                  ? "step-circle"
                                  : "step-circle-white"
                              }
                            >
                              <div className="step-circle-count">2</div>
                            </div>
                            <div
                              className="text-center mt-2"
                              style={{ fontSize: "14px" }}
                            >
                              Assigned
                            </div>
                          </div>
                          <div
                            className="col-3"
                            style={{ position: "relative" }}
                          >
                            <div
                              className={
                                OrderDetails &&
                                (OrderDetails.ProcessStatus === "Picked" ||
                                  OrderDetails.ProcessStatus === "Shipped" ||
                                  OrderDetails.ProcessStatus === "On the Way")
                                  ? "step-circle"
                                  : "step-circle-white"
                              }
                            >
                              <div className="step-circle-count">3</div>
                            </div>
                            <div
                              className="text-center mt-2"
                              style={{ fontSize: "14px" }}
                            >
                              Picked / Shipped
                            </div>
                          </div>
                          <div
                            className="col-3"
                            style={{ position: "relative" }}
                          >
                            <div
                              className={
                                OrderDetails &&
                                OrderDetails.ProcessStatus === "Delivered"
                                  ? "step-circle"
                                  : "step-circle-white"
                              }
                            >
                              <div className="step-circle-count">4</div>
                            </div>
                            <div
                              className="text-center mt-2"
                              style={{ fontSize: "14px" }}
                            >
                              Delivered
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {ProductDetails && (
                      <div className="row " style={{ marginTop: "70px" }}>
                        {messageBlock(ProductDetails)}
                      </div>
                    )}
                    <div style={{ marginTop: "50px" }}>
                      <h5 style={{ marginLeft: "5px" }}> Product</h5>
                      {ProductDetails &&
                        ProductDetails.map((product, index) => (
                          <div key={index}>
                            <ODByONProductItem product={product} />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="card">
                  <div className="card-body">
                    <h5>Shipping & Billing</h5>
                    <div className="mt-2">
                      <div className="mt-3 d-flex ">
                        <div>
                          <i className="fas fa-map-marker-alt text-default fa-2x"></i>
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          {" "}
                          <div>
                            {OrderShippingDetail &&
                              OrderShippingDetail.DeliveryName}
                          </div>{" "}
                          <p>
                            {OrderShippingDetail &&
                              OrderShippingDetail.DeliveryAddress1}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 d-flex ">
                        <div>
                          <i className="fas fa-phone-alt text-default fa-2x"></i>
                        </div>
                        <div style={{ marginLeft: "10px" }}>
                          {OrderShippingDetail &&
                            OrderShippingDetail.DeliveryPhoneNumber}
                        </div>
                      </div>
                      {OrderShippingDetail && OrderShippingDetail.DesireDate && (
                        <div className="mt-3 d-flex ">
                          <div>
                            <i className="fas fa-truck-loading text-default fa-2x"></i>
                          </div>
                          <div style={{ marginLeft: "10px" }}>
                            {moment(OrderShippingDetail.DesireDate).format(
                              "dddd, MMMM Do YYYY"
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {getDeliveryInformation()}
                <div className="card mt-3">
                  <div className="card-body">
                    <h5>Order Summary</h5>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between">
                        <div>
                          <p
                            className="text-secondary"
                            style={{ fontSize: "13px" }}
                          >
                            Subtotal
                          </p>
                        </div>
                        <div>
                          {" "}
                          <p
                            className="text-secondary"
                            style={{ fontSize: "13px" }}
                          >
                            {ProductDetails && ProductDetails[0].Currency}{" "}
                            {TotalPrice &&
                              TotalPrice !== "" &&
                              TotalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h5>Total</h5>
                        </div>
                        <div>
                          {" "}
                          <h5>
                            {" "}
                            {ProductDetails && ProductDetails[0].Currency}{" "}
                            {TotalPrice &&
                              TotalPrice !== "" &&
                              TotalPrice.toFixed(2)}
                          </h5>
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
export default OrderDetailByOrderNumber;
