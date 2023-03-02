import { WebsiteHeader } from "./Layout/Header";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { BreadcrumbItem, Breadcrumb } from "reactstrap";
import CartStep3 from "../../../assets/images/cart-step3.svg";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../../../Utils/Loading";
import firetoast from "./../../../Helpers/FireToast";
import CartTableItem from "./Layout/My Cart Items/CartTableItem";
import { GetCartItems, RemoveCartItems } from "./../../../Actions/CartAction";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Endpoint from "./../../../Utils/Endpoint";
import { CurrentUser } from "./../../../Helpers/Auth";
import { useParams } from "react-router-dom";
function UserCartDetails() {
  const { paymentStatus, paymentType } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const [IsLoading, setIsLoading] = useState(true);
  const [CartItems, setCartItems] = useState(
    JSON.parse(localStorage.getItem("p_detail"))
  );
  const [ProductCombinationItems, setProductCombinationItems] = useState(
    JSON.parse(localStorage.getItem("pC_detail"))
  );
  const [TotalPrice, setTotalPrice] = useState("");
  const orderNumber = localStorage.getItem("o_n");
  const [TransactionDetails, setTransactionDetails] = useState(null);
  const SavedTransactionDetails = JSON.parse(localStorage.getItem("u_d"));
  const state = useSelector((state) => state);
  const { getCartItem } = state;

  useEffect(async () => {
    // history.push(`/order-confirmation/${orderNumber}`);
    let dataObj = await getTransactionDetail();
    var totalCount = 0;
    let tempCombination = ProductCombinationItems;
    let indexes = CartItems ? CartItems : [];
    for (let i = 0; i < indexes.length; i++) {
      let currentProduct = CartItems[i];
      let currentCombination = tempCombination[i];
      totalCount += parseFloat(currentProduct.Price);
      for (let j = 0; j < currentCombination.length; j++) {
        totalCount += parseFloat(currentCombination[j].ProductCombinationPrice);
      }
      totalCount = totalCount * parseInt(currentProduct.Total_Quantity);
    }
    setTotalPrice(totalCount);
    setTimeout(async () => {
      await placeOrder(dataObj);
    }, 4000);
  }, []);
  var getTransactionDetail = async () => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/sslCommerz/get-detail`,
        { OrderNumber: orderNumber }
      );
      if (response.data.status) {
        setTransactionDetails(response.data.transcationDetail);
        return response.data.transcationDetail;
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
        return {};
      }
    } catch (e) {
      firetoast(
        "Something went wrong while fetching transaction details",
        "default-error"
      );
    }
  };
  var deleteCartItem = async (ProductID, index) => {
    var productVariations = ProductCombinationItems[index];
    console.log(ProductCombinationItems);
    var ProductVariantCombinationDetail = [];
    for (let i = 0; i < productVariations.length; i++) {
      var obj = {};
      obj.ProductVariantCombinationID =
        productVariations[i].ProductVariantCombinationID;
      ProductVariantCombinationDetail.push(obj);
    }
    // console.log(ProductID, { ProductVariantCombinationDetail });
    dispatch(RemoveCartItems(ProductID, { ProductVariantCombinationDetail }));
  };
  var setProductTotalPrice = (ProductDetail) => {
    console.log(ProductDetail);
    var currentProduct = ProductDetail;
    for (let i = 0; i < currentProduct.length; i++) {
      let total = 0;
      let tempProduct = currentProduct[i];
      let tempCombination = tempProduct["ProductVariantCombinationDetail"];
      console.log(tempCombination);
      total += parseFloat(tempProduct["Price"]);
      for (let j = 0; j < tempCombination.length; j++) {
        total += parseFloat(tempCombination[j]["ProductCombinationPrice"]);
      }

      currentProduct[i]["ItemsPrice"] = total;
    }
    return currentProduct;
  };
  var placeOrder = async (dataObj) => {
    //stop

    // try {
    //   var obj = {
    //     UserID: CurrentUser.UserID,
    //     CourierID: "1",
    //     TrackingNumber: null,
    //     ShippingLabel: null,
    //     ShippingDate: null,
    //     DeliveryDate: null,
    //     DeliveryConfirmationPic: null,
    //     ProcessStatus: "Processing",
    //     VendorPaymentStatus: "N",
    //     Note: "first order",
    //     ...dataObj,
    //     ...SavedTransactionDetails,
    //   };
    //   // console.log("obj", obj);
    //   var array = [];

    //   for (let i = 0; i < CartItems.length; i++) {
    //     var obj1 = {
    //       ...CartItems[i],
    //       Quantity: "1",
    //     };
    //     var currentCombination = ProductCombinationItems[i];
    //     for (let j = 0; j < currentCombination.length; j++) {
    //       obj1.VendorStoreID = currentCombination[j].VendorStoreID;
    //       obj1.ProductVariantCombinationDetail = currentCombination;
    //     }
    //     array.push(obj1);
    //   }
    //   if (paymentType === "cod") {
    //     obj.PaymentStatus = "Unpaid";
    //   } else {
    //     obj.PaymentStatus = paymentStatus === "success" ? "Paid" : "Pending";
    //   }
    //   var DataDetailObj = await setProductTotalPrice(array);
    //   obj["ProductDetail"] = DataDetailObj;
    //   var temp_prod_detail = obj["ProductDetail"];
    //   console.log("temp_prod_detail", temp_prod_detail);
    //   var pricePlan = JSON.parse(localStorage.getItem("pp"));
    //   console.log(pricePlan);
    //   let temp_prod_combo = "";
    //   let temp_array = [];
    //   for (let i = 0; i < temp_prod_detail.length; i++) {
    //     temp_prod_combo = temp_prod_detail[i]; // obj in array
    //     // console.log(temp_prod_combo["ItemsPrice"])
    //     let currentBase = parseFloat(temp_prod_combo["Price"]); //ItemsPrice in obj
    //     let currentCombinationPrice = 0;
    //     for (
    //       let j = 0;
    //       j < temp_prod_combo["ProductVariantCombinationDetail"].length;
    //       j++
    //     ) {
    //       // console.log(temp_prod_combo["ProductVariantCombinationDetail"][j])
    //       currentCombinationPrice += parseFloat(
    //         temp_prod_combo["ProductVariantCombinationDetail"][j][
    //           "ProductCombinationPrice"
    //         ]
    //       );
    //     }
    //     temp_prod_combo["ItemsPrice"] = currentBase + currentCombinationPrice;
    //     temp_prod_combo["ItemsShippingHandling"] =
    //       pricePlan[i]["data"]["price"];
    //     let ItemsBeforeTax =
    //       parseFloat(currentBase) +
    //       parseFloat(currentCombinationPrice) +
    //       parseFloat(pricePlan[i]["data"]["price"]);
    //     temp_prod_combo["ItemsBeforeTax"] = ItemsBeforeTax.toFixed(2);
    //     let ItemsEstimatedTax =
    //       (parseFloat(currentBase) + parseFloat(currentCombinationPrice)) *
    //       parseFloat(temp_prod_combo["TaxRate"] / 100).toFixed(2);
    //     temp_prod_combo["ItemsEstimatedTax"] = ItemsEstimatedTax.toFixed(2);
    //     temp_prod_combo["ItemsTotal"] = (
    //       ItemsBeforeTax + ItemsEstimatedTax
    //     ).toFixed(2);
    //     temp_array.push(temp_prod_combo);
    //   }

    //   obj["ProductDetail"] = temp_array;
    // } catch (e) {
    //   console.log("AddProcess", e);
    // }
    // // console.log(obj);
    // // return;
    // try {
    //   const response = await BanglaBazarApi.post(
    //     `${Endpoint}/api/payment/add-processOrder`,
    //     obj
    //   );
    //   if (response.data.status) {
    //     firetoast("Order placement completed!", "success", 3000, "top-center");
    //     dispatch(GetCartItems());
    //     localStorage.removeItem("pC_detail");
    //     localStorage.removeItem("u_d");
    //     localStorage.removeItem("p_detail");
    //     // localStorage.removeItem("o_n");
    //     setTimeout(() => {
    //       history.push(`/order-confirmation/${orderNumber}`);
    //     }, 3000);
    //   } else {
    //     var { error, message } = response.data;
    //     firetoast(error || message, "default-error");
    //   }
    // } catch (e) {
    //   console.log(e);
    //   firetoast("Something went wrong", "default-error");
    // }

    setTimeout(() => {
      history.push(`/order-confirmation/${localStorage.getItem("o_n")}`);
    }, 3000);
  };

  var emptyCart = async (data) => {
    var obj = {
      UserID: CurrentUser.UserID,
      ProductDetail: data,
    };
    var orderNumber = localStorage.getItem("o_n");
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/payment/empty-cart`,
        obj
      );
      if (response.data.status) {
        firetoast("Order placement completed!", "success", 3000, "top-center");
        dispatch(GetCartItems());
        localStorage.removeItem("pC_detail");
        localStorage.removeItem("u_d");
        localStorage.removeItem("p_detail");
        // localStorage.removeItem("o_n");
        setTimeout(() => {
          history.push(`/order-confirmation/${orderNumber}`);
        }, 3000);
      } else {
        var { message, error } = response.data;
        firetoast(error || message, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong while placing order", "default-error");
    }
  };
  return IsLoading ? (
    <div className="text-center mt-5">
      <Loading text="Generating Order Number" />
    </div>
  ) : (
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
                Shopping Cart
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="row">
            <div className="col-8">
              {" "}
              <div className="mt-3">
                <img
                  src={CartStep3}
                  className="img-fluid"
                  style={{ height: "60px" }}
                />
              </div>
              {getCartItem.loading ? (
                <Loading text="Getting Data" />
              ) : CartItems && CartItems.length > 0 ? (
                <div className="mt-5 table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #C7C7C7" }}>
                        <th className="ftw-400">Product</th>
                        <th></th>
                        <th className="ftw-400">Price</th>
                        <th className="ftw-400">Quantity</th>
                        <th className="ftw-400">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CartItems &&
                        CartItems.map((item, index) => (
                          <CartTableItem
                            product={item}
                            index={index}
                            variants={ProductCombinationItems[index]}
                            removeCartItem={deleteCartItem}
                            allVariants={ProductCombinationItems[index]}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center mt-5">
                  <h5>No Data To Display</h5>
                </div>
              )}
              {/* <div style={{ textAlign: "right" }}>
            <button
              className="btn btn-success"
              onClick={() => history.push("/my-cart/delivery-details")}
            >
              Continue Shopping
            </button>
          </div> */}
            </div>
            <div className="col-4">
              <div className="order-summary-box">
                <h5 className="p-3 mb-0">Shipping & Billing</h5>
                <div className="section-1">
                  <div className="d-flex summary-detail">
                    <div
                      className="summary-attrib"
                      style={{ marginRight: "10px" }}
                    >
                      <i className="fas fa-map-marker-alt text-default"></i>
                    </div>
                    <div className="summary-attrib-val">
                      <div>
                        {SavedTransactionDetails &&
                          SavedTransactionDetails.Name}
                      </div>
                      <p style={{ fontSize: "12px" }} className="mb-0">
                        <b>
                          {" "}
                          {SavedTransactionDetails &&
                            SavedTransactionDetails.Address1}
                        </b>
                      </p>
                    </div>
                  </div>
                  <div className="d-flex summary-detail">
                    <div
                      className="summary-attrib"
                      style={{ marginRight: "10px" }}
                    >
                      <i className="fas fa-phone-alt text-default"></i>
                    </div>
                    <div className="summary-attrib-val">
                      <div>
                        {SavedTransactionDetails &&
                          SavedTransactionDetails.cus_phone}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex summary-detail">
                    <div
                      className="summary-attrib"
                      style={{ marginRight: "10px" }}
                    >
                      <i className="fas fa-envelope text-default"></i>
                    </div>
                    <div className="summary-attrib-val">
                      <div>
                        {SavedTransactionDetails &&
                          SavedTransactionDetails.cus_email}
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="mt-0 mb-0" />
                <h5 className="p-3 mb-0">Payment Method</h5>
                <div className="section-1 mt-0 pt-0">
                  <div className="d-flex  summary-detail">
                    <div
                      className="summary-attrib"
                      style={{ marginRight: "10px" }}
                    >
                      <i
                        className="fab fa-cc-paypal text-primary"
                        style={{ fontSize: "30px" }}
                      ></i>
                    </div>
                    <div className="summary-attrib-val">
                      <div>Pay by SSL Commerz</div>
                      <p style={{ fontSize: "12px" }} className="mb-0">
                        <b>
                          {" "}
                          {SavedTransactionDetails &&
                            SavedTransactionDetails.CardNumber}
                        </b>
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="mt-0 mb-0" />
                <h5 className="p-3 mb-0">Order Summary</h5>
                <div className="section-1">
                  <div className="d-flex justify-content-between summary-detail">
                    <div className="summary-attrib">Subtotal</div>
                    <div className="summary-attrib-val">
                      {CartItems &&
                        CartItems.length > 0 &&
                        CartItems[0].Currency}{" "}
                      {TotalPrice}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between summary-detail">
                    <div className="summary-attrib">Total</div>
                    <div className="summary-attrib-val">
                      {CartItems &&
                        CartItems.length > 0 &&
                        CartItems[0].Currency}{" "}
                      {TotalPrice}
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    className="btn btn-lg btn-block btn-success w-100"
                    onClick={() => placeOrder()}
                  >
                    Place Order
                  </button>
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
export default UserCartDetails;
