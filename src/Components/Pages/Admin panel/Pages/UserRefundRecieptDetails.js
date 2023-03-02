import { useState, useEffect, memo, useRef } from "react";
import moment from "moment";
import { useDispatch } from "react-redux";
import html2canvas from "html2canvas";
import { Footer } from "../../Web App/Layout/Footer";
import { WebsiteHeader } from "../../Web App/Layout/Header";
import { NewsLetter } from "../../Web App/Layout/NewsLetter";
import { Breadcrumb } from "reactstrap";
import { BreadcrumbItem } from "reactstrap";
import { RefundedProductsTable } from "./Refund Details Components/RefundedProductsTable";
import { RefundOrderSummary } from "./Refund Details Components/RefundOrderSummary";
import { RefundDetailCard } from "./Refund Details Components/RefundDetailCards";
import { BasicRefundCard } from "./Refund Details Components/BasicRefundCard";
import Loading from "./../../../../Utils/Loading";
import Void from "../../../../assets/images/void.svg";
import BanglaBazarApi from "../../../Api/BanglaBazarApi";
import { useParams, useHistory, Link } from "react-router-dom";
import Endpoint from "../../../../Utils/Endpoint";
import firetoast from "../../../../Helpers/FireToast";

import {
  getRefundByOrderNumber,
  NotifyUserAndVendors,
} from "../../../../Actions/RefundAction";
export function UserRefundReceiptDetails() {
  const [isLoading, setLoading] = useState(false);
  const [RefundDetail, setRefundDetail] = useState(null);
  const [OrderDetails, setOrderDetails] = useState(null);
  const [RefundStatus, setRefundStatus] = useState(null);
  const { orderNumber, type, status } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const printRef = useRef();

  useEffect(() => {
    setLoading(true);
    getOrderDetails();

  }, []);

  useEffect(() => {
    if (OrderDetails) {
      //console.log(OrderDetails.RefundStatus, "OrderDetailsi
      dispatch(getRefundByOrderNumber(orderNumber, status, type, stopLoader));
    }
  }, [OrderDetails]);

  var stopLoader = (data) => {
    console.log(data, "data");
    setRefundDetail(data.refundOrderDetails);
    setLoading(false);
  };
  var getOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/orderDetails/${orderNumber}`
      );
      setOrderDetails(response.data.orderDetails);
    } catch (e) {
      firetoast(
        "Something went wrong while fetching order details",
        "default-error"
      );
    }
    setLoading(false);
  };

  let GetPriceOrVariation = (indexedOrder, status) => {
    let currentOrder = indexedOrder;
    let basePrice = parseFloat(currentOrder.BasePrice);
    let combinationPrice = 0.0;
    let variations = [];
    let combinations = currentOrder.ProductCombinations;
    for (let i = 0; i < combinations.length; i++) {
      combinationPrice += parseFloat(combinations[i].ProductCombinationPrice);
      variations.push(combinations[i].OptionValue);
    }
    let sum = combinationPrice + basePrice;
    let variationString = variations.join(" , ");
    if (status === 0) {
      return sum;
    } else {
      return variationString;
    }
  };
  async function PrintElem() {
    const element = printRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL(`image/jpg`);
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = `${orderNumber}-refund-details.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  }
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
                Refund Reciept
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="text-center">
            <h2 className="text-default">Refund Reciept</h2>
          </div>
          <div className="mt-5">
            {/* <div className="text-orange">
              You need to go to xps panel and create return request shipping level for this order
            </div> */}
            <div className="d-flex justify-content-between">
              <h3 className="ftw-400">Refund Details</h3>
              <button
                className="btn-default"
                onClick={() => PrintElem("receipt")}
              >
                Download Reciept
              </button>
            </div>
            <div className="card mt-2">
              <div className="card-body p-0">
                <>
                  <div className="mt-3">
                    {isLoading ? (
                      <div>
                        <Loading />
                      </div>
                    ) : RefundDetail ? (
                      <div ref={printRef}>
                        <div className="d-flex align-items-center justify-content-between p-3">
                          <div>
                            <Link to="#" className="td-none order-number-link">
                              Order #{RefundDetail.OrderNumber}
                            </Link>
                            <div className="text-secondary">
                              Place Date:{" "}
                              {moment(RefundDetail.OrderDate).format(
                                "DD/MM/YYYY"
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="row">
                              <div className="col-6">
                                <label>Payment Method</label>
                                <input
                                  className="form-control"
                                  disabled
                                  value={
                                    RefundDetail["ProductDetail"][0][
                                      "PaymentType"
                                    ] === "card"
                                      ? "Card"
                                      : "Cash on delivery"
                                  }
                                />
                              </div>
                              <div className="col-6">
                                <label>Status</label>
                                <input
                                  className="form-control"
                                  disabled
                                  value="Refund"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-line-2px mt-2" />
                        <div className="row mt-2 p-3">
                          <div className="col-xl-7 col-lg-7 col-md-6 col-sm-12">
                            <h5>Products</h5>
                            <RefundedProductsTable
                              products={RefundDetail["ProductDetail"]}
                              GetPriceOrVariation={GetPriceOrVariation}
                            />
                          </div>
                          <div className="col-xl-5 col-lg-5 col-md-6 col-sm-12">
                            <h6 style={{ fontSize: "14px" }}>Reason</h6>
                            <div className="card refund-reason-card p-2 mt-3">
                              {RefundDetail["ProductDetail"][0]["ReturnReason"]}
                            </div>

                            <RefundOrderSummary
                              products={RefundDetail["ProductDetail"]}
                              GetPriceOrVariation={GetPriceOrVariation}
                            />
                          </div>
                        </div>
                        <div className="border-line-2px mt-2" />
                        <div className="row p-3">
                          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <RefundDetailCard
                              title="Customer Detail"
                              colorClass="default"
                              name={
                                RefundDetail.ProductDetail[0][
                                "DeliveryUserName"
                                ]
                              }
                              email={
                                RefundDetail.ProductDetail[0][
                                "UserEmailAddress"
                                ]
                              }
                              address={
                                RefundDetail.ProductDetail[0]["DeliveryAddress"]
                              }
                              phone={
                                RefundDetail.ProductDetail[0][
                                "DeliveryPhoneNumber"
                                ]
                              }
                            />
                          </div>
                          <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                            <RefundDetailCard
                              title="Vendor Detail"
                              colorClass="dark"
                              email={
                                RefundDetail.ProductDetail[0]["StoreEmail"]
                              }
                              name={RefundDetail.ProductDetail[0]["StoreName"]}
                              address={
                                RefundDetail.ProductDetail[0]["StoreAddress"]
                              }
                              phone={
                                RefundDetail.ProductDetail[0]["StorePhone"]
                              }
                            />
                          </div>
                        </div>
                        <div className="row mt-2 p-3">
                          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-1">
                            <BasicRefundCard
                              RefundDetail={RefundDetail}
                              type="shipping"
                            />
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-1">
                            <BasicRefundCard
                              RefundDetail={RefundDetail}
                              type="to"
                            />
                          </div>
                          <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 mt-1">
                            <BasicRefundCard
                              RefundDetail={RefundDetail}
                              type="from"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center no-store-container ">
                        <div className="mt-3">
                          <img src={Void} className="img-fluid no-store-img " />
                          <h2 className="ftw-400 mt-3">No Details Found </h2>
                        </div>
                      </div>
                    )}
                  </div>
                </>
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
