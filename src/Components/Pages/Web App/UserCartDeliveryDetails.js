import { WebsiteHeader } from "./Layout/Header";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { BreadcrumbItem, Breadcrumb } from "reactstrap";
import CartStep2 from "../../../assets/images/cart-step2.svg";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import firetoast from "./../../../Helpers/FireToast";
import CartDetailCartItem from "./Layout/My Cart Items/CartDetailCartItem";
import UserOrderPaymentDetails from "./Layout/My Cart Items/UserOrderPaymentDetails";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Endpoint from "./../../../Utils/Endpoint";
import { useHistory } from "react-router-dom";
import { Modal, ModalBody } from "reactstrap";
import Loading from "./../../../Utils/Loading";
import CheckEmpty from "./../../../Utils/CheckEmpty";
import PaymentDeliveryDetails from "./Layout/My Cart Items/DeliveryDetails";
function UserCartDeliveryDetails() {
  const [CountrySelect, setCountrySelect] = useState(null);
  const [PaymentMethod, setPaymentMethod] = useState("");
  const [OrderNumber, setOrderNumber] = useState("");
  const [CartItems, setCartItems] = useState([]);
  const [Gateways, setGateways] = useState([]);
  const [ProductCombinationItems, setProductCombinationItems] = useState([]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state);
  const { getCartItem, paymentStatus } = state;
  const [ShowCheckoutButton, setShowCheckoutButton] = useState(false);
  const [PaymentUrl, setPaymentUrl] = useState("");
  const [ShowModal, setShowModal] = useState(false);
  const [PaymentClient, setPaymentClient] = useState(null);
  const [paymentLoading, setpaymentLoading] = useState(false);
  const [BanglaBazarPickUp, setBanglaBazarPickUp] = useState(null);
  const [PickUpByUser, setPickUpByUser] = useState(null);
  const [AllowStorePickup, setAllowStorePickup] = useState("N");
  const [AllowAdminPickup, setAllowAdminPickup] = useState("Y");
  const [PaymentStates, setPaymentStates] = useState([]);
  const [PaymentCities, setPaymentCities] = useState([]);
  const [OverallCity, setOverallCity] = useState("");
  const [PathaoAccessToken, setPathaoAccessToken] = useState(null);
  const [ShippingPrice, setShippingPrice] = useState(0);
  const [DeliveryBy, setDeliveryBy] = useState(null);
  const [rateCalculation, setRateCalculation] = useState(false);
  const [PaymentType, setPaymentType] = useState("card");
  const [ContinueButton, setContinueButton] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const productIds = queryParams.get("product");
  const [LastPaymentDetail, setLastPaymentDetail] = useState([]);
  const [isPaymentSelected, setPaymentSelected] = useState(false);
  const [ShowPrevPayment, setShowPrevPayment] = useState(true);
  const [SameAsAbove, setSameAsAbove] = useState(false);
  useEffect(() => {
    getPathaoToken();
    getPaymentMethods();
    getPreviousPaymentDetails();
    if (!getCartItem.loading) {
      if (getCartItem.error) {
        firetoast(
          "Something went wrong while fetching cart items",
          "default-error"
        );
      } else {
        if (!productIds) {
          var tempIds = [];
          var productCities = [];
          setCartItems(getCartItem.data.productCartList);
          setProductCombinationItems(
            getCartItem.data.productCombinationPriceDetail
          );
          var totalCount = 0;
          let tempCombination = getCartItem.data.productCombinationPriceDetail;
          let indexes = getCartItem.data.productCartList;
          for (let i = 0; i < indexes.length; i++) {
            tempIds.push(indexes[i].ProductID);
            productCities.push(indexes[i].City);
            // console.log(tempIds);
            let currentProduct = getCartItem.data.productCartList[i];
            let currentCombination = tempCombination[i];
            totalCount += parseFloat(currentProduct.Price);
            for (let j = 0; j < currentCombination.length; j++) {
              totalCount += parseFloat(
                currentCombination[j].ProductCombinationPrice
              );
            }
            totalCount = totalCount * parseInt(currentProduct.Total_Quantity);
          }
         
          setTotalPrice(totalCount);
          getDeliveryStatus(tempIds);
          // if (sameValues(productCities)) {
          //   setOverallCity(productCities[0]);
          // }
        } else {
          var productCities = [];
          var ActualProductCartList = getCartItem.data.productCartList;
          var ActualProductCombinationItems =
            getCartItem.data.productCombinationPriceDetail;
          var idsToMap = productIds.split(",");
          getDeliveryStatus(productIds.split(","));
          var productCartList = [];
          var productCombinationItems = [];

          for (let i = 0; i < idsToMap.length; i++) {
            for (let j = 0; j < ActualProductCartList.length; j++) {
              if (
                parseInt(idsToMap[i]) ===
                parseInt(ActualProductCartList[j].ProductID)
              ) {
                productCities.push(ActualProductCartList[i].City);
                productCartList.push(ActualProductCartList[j]);
                productCombinationItems.push(ActualProductCombinationItems[j]);
              }
            }
          }
          setCartItems(productCartList);
          setProductCombinationItems(productCombinationItems);
          var totalCount = 0;
          let tempCombination = productCombinationItems;
          let indexes = productCartList;
          for (let i = 0; i < indexes.length; i++) {
            let currentProduct = productCartList[i];
            let currentCombination = tempCombination[i];
            totalCount += parseFloat(currentProduct.Price);
            for (let j = 0; j < currentCombination.length; j++) {
              totalCount += parseFloat(
                currentCombination[j].ProductCombinationPrice
              );
            }
            totalCount = totalCount * parseInt(currentProduct.Total_Quantity);
          }
          console.log("totalCount totalCount",totalCount)
          setTotalPrice(totalCount);
          // if (sameValues(productCities)) {
          //   setOverallCity(productCities[0]);
          // }
        }
      }
    }
  }, [
    getCartItem.loading,
    getCartItem.data,
    paymentStatus.loading,
    productIds,
  ]);
  let getPreviousPaymentDetails = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/payment/payment-history`
      );
      setLastPaymentDetail(response.data.userPaymentHistory);
    } catch (e) {
      console.log(e, "error while fetching previous details");
    }
  };
  let getPathaoToken = async () => {
    try {
      let response = await BanglaBazarApi.get(
        `${Endpoint}/api/pathao/get-access-token`
      );
      setPathaoAccessToken(response.data.token);
    } catch (e) {
      console.log(e);
    }
  };
  let getDeliveryStatus = async (idArrays) => {
    let temp = [];

    for (let i = 0; i < idArrays.length; i++) {
      temp.push({
        ProductID: idArrays[i],
      });
    }
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/payment/shipping-status`,
        {
          ProductDetail: temp,
        }
      );
      setBanglaBazarPickUp(response.data.banglaBazarPickup);
      setPickUpByUser(response.data.pickUpByUser);
    } catch (e) {
      firetoast("Something went wrong", "default-error");
    }
  };
  let getPaymentMethods = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/payment/get-paymentGateway`
      );
      if (response.data.status) {
        setGateways(response.data.PaymentGateway);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast(
        "Something went wrong while getting payment methods",
        "default-error"
      );
    }
  };
  const [DeliveryDetails, setDeliveryDetails] = useState({
    currency: "",
    ItemsPrice: "2500",
    ShippingHandling: "1.2",
    TotalBeforeTax: "4.2",
    EstimatedTax: "2.1",
    OrderTotal: "5000",
    product_category: "Electronic",
    product_name: "Computer.",
    shipping_method: "NO",
    PaymentAccount: "1111",
    PaymentRouting: "9838",
    cus_fax: "",
    DefaultPayment: "Y",
    Name: "",
    CardNumber: "",
    ExpirationDate: "",
    Address1: "",
    Address2: "",
    City: "",
    State: "",
    ZipCode: "",
    CountryID: "",
    product_profile: "general",
  });
  const [PaymentDetails, setPaymentDetails] = useState({});
  var ValidateUSPSAddresses = async () => {
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/usps/Verify`,
        {
          address1: DeliveryDetails["DeliveryAddress1"],
          address2: DeliveryDetails["DeliveryAddress2"],
          state: DeliveryDetails["DeliveryState"],
          zip: document.getElementById("DeliveryZipCode").value,
        }
      );
      if (response.data.status) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  };
  var savePaymentDetails = async () => {
    if (CountrySelect === "226") {
      let validateAddress = await ValidateUSPSAddresses();
      if (validateAddress) {
        proceedPayment();
      } else {
        return firetoast(
          "Delivery address information you provided is not valid",
          "error",
          6000,
          "top-center"
        );
      }
    } else {
      proceedPayment();
    }
  };
  var proceedPayment = async () => {
    var dd = { ...DeliveryDetails };
    dd["GatewayID"] = PaymentMethod.GatewayID;
    dd["Currency"] = PaymentMethod.CurrencyCode;
    dd["AllowStorePickup"] = AllowStorePickup;
    dd["AllowAdminPickup"] = AllowAdminPickup;
    dd["PhoneNumber"] = DeliveryDetails.cus_phone;
    dd["PaymentType"] = PaymentType;
    dd["DeliveryStatus"] = DeliveryBy;

    setDeliveryDetails(dd);

    if (CheckEmpty(dd.Name)) {
      return firetoast("Please provide your name", "default-error");
    }
    if (CheckEmpty(dd.Address1)) {
      return firetoast("Address 1 is required to proceed", "default-error");
    }
    if (CheckEmpty(dd.CountryID)) {
      return firetoast("Please select your country", "default-error");
    }
    if (PaymentClient === "auth") {
      if (CheckEmpty(dd.CardNumber)) {
        return firetoast("Please provide your card number", "default-error");
      }
      if (CheckEmpty(dd.ExpirationDate)) {
        return firetoast(
          "Expiry date for card isn't provided",
          "default-error"
        );
      }
      if (CheckEmpty(dd.cvv)) {
        return firetoast("Please provide cvv", "default-error");
      }
    }
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/payment/add-userPayment`,
        dd
      );

      if (response.data.status) {
        firetoast("Details saved!", "success", 2000, "top-center");
        var data = {
          ...dd,
          GatewayID: PaymentMethod.GatewayID,
        };
        data.cus_country = CountrySelect;
        data.UserPaymentID = response.data.UserPaymentID;
        data.UserAddressID = response.data.UserAddressID;
        setDeliveryDetails(data);
        setShowCheckoutButton(true);
      }
    } catch (e) {
      firetoast("Something went wrong while saving details", "default-error");
    }
  };
  let initiateTransaction = async () => {
    var data = DeliveryDetails;
    data.SessionID = localStorage.getItem("accessToken");
    data.total_amount = TotalPrice + ShippingPrice;
    data["GatewayID"] = PaymentMethod.GatewayID;
    data["Currency"] = PaymentMethod.CurrencyCode;
    data["AllowStorePickup"] = AllowStorePickup;
    data["AllowAdminPickup"] = AllowAdminPickup;
    data["PhoneNumber"] = data.cus_phone;
    data["DeliveryStatus"] = DeliveryBy;

    data = { ...data, ...PaymentDetails };

    try {
      if (PaymentType === "cod") {
        const response = await BanglaBazarApi.post(
          `${Endpoint}/api/payment/processPayment`,
          data
        );
        if (response.data.status) {
          if (response.data.URL_LINK !== "") {
            setOrderNumber(response.data.OrderNumber);
            localStorage.setItem("p_detail", JSON.stringify(CartItems));
            localStorage.setItem(
              "pC_detail",
              JSON.stringify(ProductCombinationItems)
            );
            localStorage.setItem("u_d", JSON.stringify(DeliveryDetails));
            localStorage.setItem("o_n", response.data.OrderNumber);

            window.location.href =
              "/payment-checkout?status=success&paymentType=cod";
          } else {
            firetoast(
              "Processing failed, please make sure you provided all the required fields",
              "default-error"
            );
          }
        } else {
          firetoast(
            "Something went wrong while checking out.",
            "default-error"
          );
        }
      } else {
        if (PaymentClient === "ssl") {
          const response = await BanglaBazarApi.post(
            `${Endpoint}/api/sslCommerz/init`,
            data
          );
          if (response.data.status) {
            if (response.data.URL_LINK !== "") {
              setOrderNumber(response.data.OrderNumber);
              localStorage.setItem("p_detail", JSON.stringify(CartItems));
              localStorage.setItem(
                "pC_detail",
                JSON.stringify(ProductCombinationItems)
              );
              localStorage.setItem("u_d", JSON.stringify(DeliveryDetails));
              localStorage.setItem("o_n", response.data.OrderNumber);

              window.location.href = response.data.URL_LINK;
            } else {
              firetoast(
                "Please make sure you provided all the required fields",
                "default-error"
              );
            }
          } else {
            firetoast(
              "Something went wrong while checking out.",
              "default-error"
            );
          }
        } else {
          setpaymentLoading(true);
          setShowModal(true);
          const response = await BanglaBazarApi.post(
            `${Endpoint}/api/autorizeNet/init`,
            data
          );
          if (response.data.status) {
            if (response.data.URL_LINK !== "") {
              setOrderNumber(response.data.OrderNumber);
              localStorage.setItem("p_detail", JSON.stringify(CartItems));
              localStorage.setItem(
                "pC_detail",
                JSON.stringify(ProductCombinationItems)
              );
              localStorage.setItem("u_d", JSON.stringify(DeliveryDetails));
              localStorage.setItem("o_n", response.data.OrderNumber);

              // window.location.href = response.data.URL_LINK;
              if (response.data.status) {
                setpaymentLoading(false);
                setShowModal(false);
                if (response.data.data.responseCode === "1") {
                  window.location.href =
                    "/payment-checkout?status=success&paymentType=card";
                } else if (
                  response.data.data.responseCode === "251" ||
                  response.data.data.responseCode === "252"
                ) {
                  window.location.href =
                    "/payment-checkout?status=pending&paymentType=card";
                }
              } else {
                window.location.href = `/payment-checkout?status=failed&failure_message=${response.data.data.messages.message[0].description}&paymentType=card`;
              }
            } else {
              setpaymentLoading(false);
              setShowModal(false);
              firetoast(
                "Please make sure you provided all the required fields",
                "default-error"
              );
            }
          } else {
            setpaymentLoading(false);
            setShowModal(false);

            firetoast(
              "Something went wrong while checking out.",
              "default-error"
            );
          }
        }
      }
    } catch (e) {
      firetoast("Something went wrong!", "default-error");
    }
  };
  var CalculateShipping = async () => {
    let cartItems = [...CartItems];
    let currentItemsCities = [];
    var total_weight = 0.0;
    for (let i = 0; i < cartItems.length; i++) {
      total_weight += parseFloat(cartItems[i].Weight);
      currentItemsCities.push(cartItems[i].City);
    }
    const allEqual = (arr) => arr.every((v) => v === arr[0]);
    var sameProductCities = allEqual(currentItemsCities);
    if (sameProductCities) {
      if (currentItemsCities[0] === PaymentDetails["DeliveryCity"]) {
        //Check Driver Availability for that city
        var driverStatus = await CheckDriverAvailability();
        if (driverStatus) {
          //driver available
          setShippingPrice(0);
          setDeliveryBy("dd");
          SetDeliveryStatus("dd");
        } else {
          //no driver
          //DeliveryClient
          CalculateShippingPrice(total_weight);
        }
      } else {
        //DeliveryClient
        CalculateShippingPrice(total_weight);
      }
    } else {
      //DeliveryClient
      CalculateShippingPrice(total_weight);
    }
  };
  let CheckDriverAvailability = async () => {
    try {
      var response = await BanglaBazarApi(
        `${Endpoint}/api/deliveryDriver/check-availability`,
        {
          CityName: PaymentDetails["DeliveryCity"],
        }
      );
      if (response.data.status) {
        return response.data.status.deliveryDriverStatus;
      } else {
        firetoast("Something went wrong !", "default-error");
        return false;
      }
    } catch (e) {
      firetoast("Something went wrong", "error", 3000, "top-center");
      return false;
    }
  };
  let SetDeliveryStatus = async (status) => {
    let pd = PaymentDetails;
    let dd = DeliveryDetails;
    dd["DeliveryStatus"] = status;
    pd["DeliveryStatus"] = status;
    setPaymentDetails(pd);
    setDeliveryDetails(dd);
  };
  function parseXmlToJson(xml) {
    const json = {};
    for (const res of xml.matchAll(
      /(?:<(\w*)(?:\s[^>]*)*>)((?:(?!<\1).)*)(?:<\/\1>)|<(\w*)(?:\s*)*\/>/gm
    )) {
      const key = res[1] || res[3];
      const value = res[2] && parseXmlToJson(res[2]);
      json[key] = (value && Object.keys(value).length ? value : res[2]) || null;
    }
    return json;
  }
  let CalculateShippingPrice = async (weight) => {
    let countryId = CountrySelect;

    if (countryId === "16") {
      //bangladesh go for pathao
      //patho price calculation
      var productIds = [];
      for (let j = 0; j < CartItems.length; j++) {
        productIds.push(CartItems[j].ProductID);
      }
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/price-plan`,
        {
          token: PathaoAccessToken,
          // item_weight: weight,
          recipient_city: PaymentDetails["DeliveryCityID"],
          recipient_zone: PaymentDetails["DeliveryZoneID"],
          ProductIDs: productIds,
        }
      );

      var total = 0;
      var responses = response.data.saveResponse;
      console.log(responses);
      for (let j = 0; j < responses.length; j++) {
        total +=
          parseInt(responses[j]["data"]["price"]) +
          parseInt(responses[j]["data"]["additional_charge"]);
      }
      setShippingPrice(total);
      setDeliveryBy("pathao");
      SetDeliveryStatus("pathao");
      localStorage.setItem("pp", JSON.stringify(responses));
    } else {
      //usps price calculation

      var totalShippingRate = 0;
      setRateCalculation(true);
      for (let i = 0; i < CartItems.length; i++) {
        var response = await BanglaBazarApi.post(`${Endpoint}/api/usps/rate`, {
          originationZip: CartItems[i].VendorStoreZip,
          destinationZip: document.getElementById("DeliveryZipCode").value,
          pounds: parseFloat(CartItems[i].Weight),
          ounces: 0,
          height: parseFloat(CartItems[i].Height),
          width: parseFloat(CartItems[i].Width),
          length: parseFloat(CartItems[i].Length),
        });
        console.log(response.data);
        if (!response.data.status) {
          // return firetoast(response.data.message, "default-error");
          setDeliveryBy(null);
          return null;
        } else {
          totalShippingRate += parseFloat(
            response.data.data.Package.Postage.Rate._text
          );
        }
        console.log(totalShippingRate);
      }
      setDeliveryBy("usps");
      SetDeliveryStatus("usps");
      setShippingPrice(totalShippingRate);
      setRateCalculation(false);
    }
  };
  function sameValues(arr) {
    return arr.every((v, i, a) => v === a[0]);
  }
  let selectPayment = (index, status) => {
    setPaymentSelected(status);
    if (status) {
      let paymentDetail = LastPaymentDetail[index];
      console.log(LastPaymentDetail);
      var obj = {
        Address1: paymentDetail.Address1,
        Address2: paymentDetail.Address2,
        Name: paymentDetail.Name,
        ZipCode: paymentDetail.ZipCode,
      };
      for (let i = 0; i < Gateways.length; i++) {
        if (
          paymentDetail.Country === "Bangladesh" &&
          Gateways[i].EndPoint.includes("ssl")
        ) {
          setPaymentMethod(Gateways[i]);
        }
      }
      setCountrySelect(paymentDetail.CountryID);
      setDeliveryDetails(obj);
    }
  };
  let handleSameAsAbove = async (status) => {
    if (status) {
      let delivery_details = { ...DeliveryDetails };
      let obj = {
        Name: delivery_details["Name"] ? delivery_details["Name"] : "",
        DeliveryPhoneNumber: delivery_details["cus_phone"]
          ? delivery_details["cus_phone"]
          : "",
        DeliveryAddress1: delivery_details["Address1"]
          ? delivery_details["Address1"]
          : "",
        DeliveryAddress2: delivery_details["Address2"]
          ? delivery_details["Address2"]
          : "",
        DeliveryZipCode: delivery_details["ZipCode"]
          ? delivery_details["ZipCode"]
          : "",
      };
      setPaymentDetails(obj);
      await CalculateShipping();
    } else {
      setPaymentDetails({});
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
            <div className="col-xl-8 col-md-7 col-sm-12 order-2 order-xl-1 order-md-1">
              {" "}
              <div className="mt-3">
                <img
                  src={CartStep2}
                  className="img-fluid"
                  style={{ height: "70px" }}
                />
              </div>
              <div>
                {ContinueButton && CountrySelect && (
                  <h3 className="text-default mt-3 mb-3">
                    {" "}
                    Payment Information
                  </h3>
                )}
                <UserOrderPaymentDetails
                  Gateways={Gateways}
                  DeliveryDetails={DeliveryDetails}
                  setDeliveryDetails={setDeliveryDetails}
                  setPaymentMethod={setPaymentMethod}
                  setPaymentClient={setPaymentClient}
                  PaymentClient={PaymentClient}
                  BanglaBazarPickUp={BanglaBazarPickUp}
                  PickUpByUser={PickUpByUser}
                  AllowAdminPickup={AllowAdminPickup}
                  AllowStorePickup={AllowStorePickup}
                  setAllowAdminPickup={setAllowAdminPickup}
                  setAllowStorePickup={setAllowStorePickup}
                  setPaymentStates={setPaymentStates}
                  setPaymentCities={setPaymentCities}
                  setCountrySelect={setCountrySelect}
                  CountrySelect={CountrySelect}
                  PathaoAccessToken={PathaoAccessToken}
                  PaymentType={PaymentType}
                  setPaymentType={setPaymentType}
                  ContinueButton={ContinueButton}
                  setContinueButton={setContinueButton}
                  LastPaymentDetail={LastPaymentDetail}
                  selectPayment={selectPayment}
                  setShowPrevPayment={setShowPrevPayment}
                  ShowPrevPayment={ShowPrevPayment}
                />
              </div>
              {ContinueButton && (
                <>
                  <div>
                    <h3 className="text-default mt-3 mb-3">
                      {" "}
                      Delivery Information
                    </h3>
                    <PaymentDeliveryDetails
                      Gateways={Gateways}
                      PaymentDetails={PaymentDetails}
                      setPaymentDetails={setPaymentDetails}
                      setPaymentMethod={setPaymentMethod}
                      setPaymentClient={setPaymentClient}
                      PaymentClient={PaymentClient}
                      BanglaBazarPickUp={BanglaBazarPickUp}
                      PickUpByUser={PickUpByUser}
                      AllowAdminPickup={AllowAdminPickup}
                      AllowStorePickup={AllowStorePickup}
                      setAllowAdminPickup={setAllowAdminPickup}
                      setAllowStorePickup={setAllowStorePickup}
                      PaymentStates={PaymentStates}
                      PaymentCities={PaymentCities}
                      OverallCity={OverallCity}
                      CountrySelect={CountrySelect}
                      PathaoAccessToken={PathaoAccessToken}
                      CalculateShipping={CalculateShipping}
                      PaymentType={PaymentType}
                      setPaymentType={setPaymentType}
                      ContinueButton={ContinueButton}
                      setContinueButton={setContinueButton}
                      SameAsAbove={SameAsAbove}
                      setSameAsAbove={setSameAsAbove}
                      DeliveryDetails={DeliveryDetails}
                      handleSameAsAbove={handleSameAsAbove}
                    />
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {ShowCheckoutButton ? (
                      <button
                        className="btn btn-success"
                        disabled={paymentLoading}
                        onClick={() => initiateTransaction()}
                      >
                        Proceed Checkout
                      </button>
                    ) : (
                      <div className="d-flex justify-content-between mt-5">
                        <div>
                          <button
                            className="btn btn-success"
                            onClick={() => {
                              setContinueButton(!ContinueButton);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                              setShowPrevPayment(true);
                              setPaymentMethod(null);
                            }}
                          >
                            Previous
                          </button>
                        </div>
                        <div>
                          <button
                            className="btn btn-success"
                            disabled={rateCalculation}
                            onClick={() => savePaymentDetails()}
                          >
                            Save Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="col-xl-4 col-md-5 col-sm-12 order-1 order-xl-2 order-md-2">
              <div className="order-summary-box">
                <h5 className="p-2 mb-0 mt-1">
                  {" "}
                  <i className="fas fa-info-circle text-orange"></i> Note
                </h5>
                <div className="section-1 p-2">
                  <span className="text-orange">
                    Store pick up will only be available if all selected
                    products are from same country and selected delivery city.{" "}
                  </span>
                </div>
              </div>
              <div className="order-summary-box  mt-3">
                <h5 className="p-3 pb-2 mb-0">Order Summary</h5>
                <h6 className="text-secondary p-3 mb-0 pb-2 ">
                  Products ({CartItems.length})
                </h6>
                <div className="secondary-border"></div>
                {CartItems.map((item, index) => (
                  <CartDetailCartItem
                    product={item}
                    combination={ProductCombinationItems[index]}
                  />
                ))}
                               {console.log(CartItems[0].Currency,"CartItems.Currencys")}
                               {console.log(CartItems[0].Currency,"CartItems.Currencys")}

                <div className="secondary-border"></div>
                <div className="section-1">
                  <div className="d-flex justify-content-between summary-detail">
                    <div className="summary-attrib">Subtotal</div>
                    <div className="summary-attrib-val">
                      {CartItems.length > 0 && CartItems[0].Currency}{" "}
                      {TotalPrice}
                      {console.log(TotalPrice,"TotalPrice")}
                    </div>
                  </div>
    
                  {DeliveryBy === "pathao" || DeliveryBy === "usps" ? (
                    <div className="d-flex justify-content-between summary-detail">
                      <div className="summary-attrib">Shipping Amount</div>
                      <div className="summary-attrib-val">
                        {CartItems.length > 0 && CartItems[0].Currency}{" "}
                        {ShippingPrice}
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="section-1">
                  <div className="d-flex justify-content-between summary-detail-total">
                    <div className="summary-attrib">Subtotal</div>
                    <div className="summary-attrib-val">
                      {CartItems.length > 0 && CartItems[0].Currency}{" "}
                      {ShippingPrice + TotalPrice}
                    </div>
                  </div>
                </div>
                {/* <div className="p-2">
                  <button className="btn btn-lg btn-block btn-success w-100">
                    Proceed To Checkout
                  </button>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
      <Modal
        toggle={() => setShowModal(!ShowModal)}
        isOpen={ShowModal}
        backdrop="static"
        size="md"
      >
        <ModalBody>
          <Loading text="Please wait while we process!" />
        </ModalBody>
      </Modal>
    </>
  );
}
export default UserCartDeliveryDetails;
