import { useState, useEffect, memo } from "react";
import Loading from "./../../../../Utils/Loading";
import Void from "../../../../assets/images/void.svg";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../Utils/Endpoint";
import { useParams, useHistory, Link, useLocation } from "react-router-dom";
import firetoast from "../../../../Helpers/FireToast";
import moment from "moment";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { RefundedProductsTable } from "./Refund Details Components/RefundedProductsTable";
import { RefundOrderSummary } from "./Refund Details Components/RefundOrderSummary";
import { RefundDetailCard } from "./Refund Details Components/RefundDetailCards";
import { BasicRefundCard } from "./Refund Details Components/BasicRefundCard";
import { useDispatch } from "react-redux";
import {
  getRefundByOrderNumber,
  NotifyUserAndVendors,
  assignRefundOrder,
  assignRefundOrderUSA
} from "../../../../Actions/RefundAction";
import { Alert } from "reactstrap";
import { getRoles } from "../../../../Helpers/Auth";
import CheckEmpty from "../../../../Utils/CheckEmpty";

// import { getRoles } from "../../../../Helpers/Auth";

function RefundDetails() {
  const [RefundDocument, setRefundDocument] = useState(null);
  const [ConfirmationModal, setConfirmationModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [RefundDetail, setRefundDetail] = useState(null);
  const { orderNumber, status, type } = useParams();
  const location = useLocation();
  console.log(location);
  const history = useHistory();
  const dispatch = useDispatch();
  useEffect(() => {
    // getDetail();
    setLoading(true);
    dispatch(getRefundByOrderNumber(orderNumber, status, type, stopLoader));
  }, []);
  var stopLoader = (data) => {
    setRefundDetail(data.refundOrderDetails);
    setLoading(false);
  };
  var getDetail = async () => {
    setLoading(true);
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/refund-details/${orderNumber}/${type}`
      );
      setRefundDetail(response.data.refundOrderDetails);
    } catch (e) {
      console.log(e);
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
  var initRefund = async () => {
    try {
      var response = await BanglaBazarApi(
        `${Endpoint}/api/sslCommerz/initiate-refund/${orderNumber}`
      );
      if (response.data.status) {
        firetoast("Refund Generated", "success", 3000, "top-center");
        setTimeout(() => {
          history.push("/panel/dashboard");
        }, 1500);
      }
    } catch (e) {
      console.log(e);
    }
  };
  var Notify = async () => {
    var data = {
      UserID: RefundDetail.ProductDetail[0]["UserID"],
      UserName: RefundDetail.ProductDetail[0]["UserName"],
      UserEmailAddress: RefundDetail.ProductDetail[0]["UserEmailAddress"],
      VendorID: RefundDetail.ProductDetail[0]["VendorID"],
      VendorEmailAddress: RefundDetail.ProductDetail[0]["VendorEmailAddress"],
      OrderNumber: orderNumber,
      ProductDetail: RefundDetail.ProductDetail,
      type: type
    };
    let callback = (data) => {
      if (data.status) {
        firetoast(
          "User and vendors are notified",
          "success",
          3000,
          "top-center"
        );
        setTimeout(() => history.push("/panel/dashboard"), 2000);
      } else {
        var { error, message } = data;
        firetoast(error || message, "default-error");
      }
    };

    dispatch(NotifyUserAndVendors(data, callback));
  };
  var UpdateDeliveryPicture = async (e) => {
    if (e.target.files[0]) {
      var Products = RefundDetail["ProductDetail"];
      var form = new FormData();
      form.append("RefandDeliveryPic", e.target.files[0]);
      for (let i = 0; i < Products.length; i++) {
        form.append(`ProcessOrderIDs[${i}]`, Products[i]["ProcessOrderID"]);
      }
      form.append("OrderNumber", RefundDetail.OrderNumber);
      try {
        var { data } = await BanglaBazarApi.post(
          `${Endpoint}/api/store-management/updateStatus-ro`,
          form
        );
        if (data.status) {
          firetoast("Delivery Confirmation", "success", 3000, "top-right");
          dispatch(getRefundByOrderNumber(orderNumber, status, type, stopLoader));
        } else {
          var { error, message } = data;
          firetoast(error || message, "success", 3000, "top-right");
        }
      } catch (e) {
        firetoast(
          "Something went wrong while updating delivery picture",
          "default-error"
        );
      }
    }
  };
  var markDelivered = async () => {
    try {
      var { data } = await BanglaBazarApi.post(
        `${Endpoint}/api/store-management/changePathaoStatus-ro`,
        {
          OrderNumber: orderNumber,
          status: "Delivered",
          ProcessOrderIDs: RefundDetail?.ProductDetail?.map(
            (val) => val.ProcessOrderID
          ),
        }
      );
      if (data.status) {
        firetoast("Delivery Confirmation", "success", 3000, "top-right");
        dispatch(getRefundByOrderNumber(orderNumber, status, type, stopLoader));
      } else {
        var { error, message } = data;
        firetoast(error || message, "success", 3000, "top-right");
      }
    } catch (e) {
      firetoast(
        "Something went wrong while updating delivery picture",
        "default-error"
      );
    }
  };
  var markDeliveredVS = async () => {
    try {
      var { data } = await BanglaBazarApi.post(
        `${Endpoint}/api/store-management/changeVendorShippingStatus-ro`,
        {
          OrderNumber: orderNumber,
          status: "Delivered",
          ProcessOrderIDs: RefundDetail?.ProductDetail?.map(
            (val) => val.ProcessOrderID
          ),
        }
      );
      if (data.status) {
        firetoast("Delivery Confirmation", "success", 3000, "top-right");
        dispatch(getRefundByOrderNumber(orderNumber, status, type, stopLoader));
      } else {
        var { error, message } = data;
        firetoast(error || message, "success", 3000, "top-right");
      }
    } catch (e) {
      firetoast(
        "Something went wrong while updating delivery picture",
        "default-error"
      );
    }
  };
  var getAlertMessage = () => {
    if (!RefundDetail?.ProductDetail[0]?.ReturnOrderStatus) {
      switch (RefundDetail.DeliveryStatus) {
        case "pathao":
          return (
            <Alert color="success">
              <h6 className="text-dark">
                This order was delivered by Pathao courier service, generate
                return order from pathao merchant panel.
              </h6>
              {RefundDetail?.ProductDetail[0]?.ReturnOrderStatus === null && (
                <button
                  className="btn btn-dark btn-sm"
                  onClick={assignRefundBack}
                >
                  Mark Assigned
                </button>
              )}
            </Alert>
          );
        case "dd":
          return (
            <Alert color="success">
              <h6 className="text-dark">
                This order was delivered by BanglaBazar Delivery Person, click
                this button to assign order pickup to BanglaBazar delivery
                person.
              </h6>
              <button
                className="btn btn-dark btn-sm"
                onClick={assignRefundBack}
              >
                Assign Order
              </button>
            </Alert>
          );
        case "VS":
          return (
            <Alert color="success">
              <h6 className="text-dark">
                This order was delivered by Vendor, click this button to notify
                vendor to pick product from user.
              </h6>
              {RefundDetail?.ProductDetail[0]?.ReturnOrderStatus === null && (
                <button
                  className="btn btn-dark btn-sm"
                  onClick={assignRefundBack}
                >
                  Mark Assigned
                </button>
              )}
            </Alert>
          );
        case "usps":
          if (type === "Y") {
            return (
              <Alert color="success">
                <h6 className="text-dark">
                  {`This order was delivered by usps courier service, generate
                return order from XPS panel. Click this button to notify
                user and vendor about this refund order`}
                </h6>
                {RefundDetail?.ProductDetail[0]?.ReturnOrderStatus === null && (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={() => setConfirmationModal(true)}
                  >
                    Notify
                  </button>
                )}
              </Alert>
            );
          }
          if (type === "N") {
            return (
              <Alert color="success" >
                <h6 className="text-dark">
                  This order was delivered by usps courier service it is paid return order user will return this order by himself. Click this button to notify user and vendor about this refund order
                </h6>
                {RefundDetail?.ProductDetail[0]?.ReturnOrderStatus === null && (
                  <button
                    className="btn btn-dark btn-sm"
                    onClick={assignRefundBack}
                  >
                    Notify
                  </button>
                )}
              </Alert >
            );
          }
        default:
          return (
            <Alert color="success">
              <h6 className="text-dark">
                This order was picked by user , click this button to notify user
                to return order to pickup location
              </h6>
              <button
                className="btn btn-dark btn-sm"
                onClick={assignRefundBack}
              >
                Notify User
              </button>
            </Alert>
          );
      }
    } else {
      return (
        <>
          <Alert color="success">
            <h6 className="text-dark">This order is under processing!</h6>
            {RefundDetail?.ProductDetail[0]?.DeliveryStatus === "pathao" &&
              RefundDetail?.ProductDetail[0]?.ReturnOrderStatus ===
              "Assigned" && (
                <button
                  className="btn btn-dark btn-sm mt-2"
                  onClick={markDelivered}
                >
                  Mark Delivered
                </button>
              )}
            {RefundDetail?.ProductDetail[0]?.DeliveryStatus === "VS" &&
              RefundDetail?.ProductDetail[0]?.ReturnOrderStatus ===
              "Assigned" && (
                <button
                  className="btn btn-dark btn-sm mt-2"
                  onClick={markDeliveredVS}
                >
                  Mark Delivered
                </button>
              )}
            {RefundDetail?.ProductDetail[0]?.DeliveryStatus === "SP" &&
              RefundDetail?.ProductDetail[0]?.ReturnOrderStatus ===
              "Assigned" && (
                <button
                  className="btn btn-dark btn-sm mt-2"
                  onClick={markDeliveredVS}
                >
                  Mark Delivered
                </button>
              )}
          </Alert>
        </>
      );
    }
  };
  var assignRefundBack = () => {
    var callback = (data) => {
      if (data.status) {
        firetoast(
          "Order is assigned successfully!",
          "success",
          3000,
          "top-right"
        );
      }
    };
    var obj = {
      Status: RefundDetail?.ProductDetail[0]?.DeliveryStatus,
      OrderNumber: RefundDetail?.OrderNumber,
      ProcessOrderIDs: RefundDetail?.ProductDetail?.map(
        (val) => val.ProcessOrderID
      ),
      type: type
    };
    dispatch(assignRefundOrder(obj, callback));
  };
  var assignRefundBackUSA = () => {
    console.log("inside")
    if (CheckEmpty(RefundDocument)) {
      return firetoast(
        "Refund Shipping label is required",
        "error",
        3000,
        "top-right"
      );
    }
    var callback = (data) => {
      if (data.status) {
        firetoast(
          "Order is assigned successfully!",
          "success",
          3000,
          "top-right"
        );
      }
    };
    var form = new FormData();
    form.append("Status", RefundDetail?.ProductDetail[0]?.DeliveryStatus);
    form.append("OrderNumber", RefundDetail?.OrderNumber);
    form.append("ProcessOrderIDs", RefundDetail?.OrderNumber);
    form.append("type", type);
    form.append("RefundDocument", RefundDocument);
    form.append("ProcessOrderIDs", RefundDetail?.ProductDetail?.map((val) => val.ProcessOrderID));

    dispatch(assignRefundOrderUSA(form, callback));
  };
  let handleUpload = (e) => {
    if (e.target.files[0]) {
      setRefundDocument(e.target.files[0]);
    }
  };

  return (
    <div className="mt-5">
      {RefundDetail?.ProductDetail[0]?.RefundStatus === "Processing" &&
        getAlertMessage()}
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Refund Details</h3>
        {getRoles().includes("Vendor") &&
          RefundDetail?.ProductDetail[0]?.RefundStatus === "Processing" &&
          !RefundDetail?.ProductDetail[0]?.RefandDeliveryPic && (
            <button
              className="btn-default"
              onClick={() => document.getElementById("img").click()}
            >
              <input
                className="d-none"
                id="img"
                onChange={(e) => UpdateDeliveryPicture(e)}
                type="file"
              />
              Delivery Confirmation
            </button>
          )}
        {RefundDetail?.ProductDetail[0]?.RefundStatus === "Initiated" && (
          <button className="btn-default" onClick={() => Notify()}>
            Send Receipt User & Vendor
          </button>
        )}
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
                <div>
                  <div className="d-flex align-items-center justify-content-between p-3">
                    <div>
                      <Link to="#" className="td-none order-number-link">
                        Order #{RefundDetail.OrderNumber}
                      </Link>
                      <div className="text-secondary">
                        Place Date:{" "}
                        {moment(RefundDetail.OrderDate).format("DD/MM/YYYY")}
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
                        name={RefundDetail.ProductDetail[0]["DeliveryUserName"]}
                        email={
                          RefundDetail.ProductDetail[0]["UserEmailAddress"]
                        }
                        address={
                          RefundDetail.ProductDetail[0]["DeliveryAddress"]
                        }
                        phone={
                          RefundDetail.ProductDetail[0]["DeliveryPhoneNumber"]
                        }
                      />
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
                      <RefundDetailCard
                        title="Vendor Detail"
                        colorClass="dark"
                        email={RefundDetail.ProductDetail[0]["StoreEmail"]}
                        name={RefundDetail.ProductDetail[0]["StoreName"]}
                        address={RefundDetail.ProductDetail[0]["StoreAddress"]}
                        phone={RefundDetail.ProductDetail[0]["StorePhone"]}
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
                      <BasicRefundCard RefundDetail={RefundDetail} type="to" />
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
      <Modal
        isOpen={ConfirmationModal}
        toggle={() => setConfirmationModal(!ConfirmationModal)}
      >
        <ModalBody>
          <h4>
            Please upload the return shipping label file for OrderNumber {orderNumber}
          </h4>
          <div class="form-group">
            <label for="exampleFormControlFile1">
              Upload Payment Document <span className="text-danger">*</span>
            </label>
            <div>
              <input
                type="file"
                className="form-control-file"
                onChange={(e) => handleUpload(e)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter style={{ padding: "5px" }}>
          <Button color="default" onClick={() => { assignRefundBackUSA(); setConfirmationModal(false); }}>
            upload
          </Button>{" "}
          <Button onClick={() => setConfirmationModal(false)}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default memo(RefundDetails);
