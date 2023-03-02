import { useState } from "react";
import { useEffect } from "react";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../Utils/Endpoint";
import { RequiredField } from "./../../../../Utils/Required-field";
import Icons from "./../../../../Utils/Icons";
import { Spinner } from "reactstrap";
import { moment } from "moment";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import firetoast from "./../../../../Helpers/FireToast";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import { Modal, ModalBody } from "reactstrap";
import Loading from "./../../../../Utils/Loading";
import { Link, useHistory } from "react-router-dom";
import { CurrentUser } from "./../../../../Helpers/Auth";
import axios from "axios"
function UsaDelivery({
  setPaymentStates,
  setPaymentCities,
  setCountrySelect,
  ShowPrevPayment,
  setShowPrevPayment,
  PaymentType,
  setPaymentType,
  PickUpByUser,
  AllowStorePickup,
  setAllowStorePickup,
  OverallCity,
  CountrySelect,
  CartItems,
  setDeliveryBy,
  ContinueButton,
  setContinueButton,
  DeliveryBy,
  TotalPrice,
  setTotalPrice,
  ShippingPrice,
  setShippingPrice,
  ProductCombinationItems,
  setProductCombinationItems,
  product_ids,
  productGlobalShipping,
  productShippingAvailable,
  productCity,
  TaxValue,
  setTaxValue,
}) {
  const [AllowAdminPickup, setAllowAdminPickup] = useState("Y");
  const [ShowModal, setShowModal] = useState(false);
  const [paymentLoading, setpaymentLoading] = useState(false);
  const [PaymentClient, setPaymentClient] = useState(null);
  const [PaymentDetails, setPaymentDetails] = useState({});
  const [AgreeTerms, setAgreeTerms] = useState(false);
  const [isPaymentSelected, setPaymentSelected] = useState(false);
  const [countryCodes, setCountryCodes] = useState([]);
  const [CountryList, setCountryList] = useState([]);
  const [StateList, setStateList] = useState([]);
  const [CitiesList, setCitiesList] = useState([]);
  const [SatesList, setStatesList] = useState([]);
  const [AreaList, setAreaList] = useState([]);
  const [ZoneLoading, setZoneLoading] = useState(false);
  const [AreaLoading, setAreaLoading] = useState(false);
  const [PathaoAccessToken, setPathaoAccessToken] = useState(null);
  const [Gateways, setGateways] = useState([]);
  const [rateCalculation, setRateCalculation] = useState(false);
  const [PaymentMethod, setPaymentMethod] = useState("");
  const [ShowCheckoutButton, setShowCheckoutButton] = useState(false);
  const [OrderNumber, setOrderNumber] = useState("");
  const [SameAsAbove, setSameAsAbove] = useState(false);
  const [LastPaymentDetail, setLastPaymentDetail] = useState([]);
  const [SaveAddress, setSaveAddress] = useState(false);
  const [HomeAddress, setHomeAddress] = useState(false);
  const [DeliveryDetails, setDeliveryDetails] = useState({});
  const [PayerHistory, setPayerHistory] = useState(null);
  const [DeliveryHistory, setDeliveryHistory] = useState(null);
  const [ShowPaymentFields, setShowPaymentFields] = useState(false);
  const [ShowDeliveryFields, setShowDeliveryFields] = useState(false);
  const [DeliveryStatus, SetDeliveryStatus] = useState(null);
  const [SelectedFromPrevious, setSelectedFromPrevious] = useState(false);
  const [stripeData, setStripeData] = useState(null);
  const history = useHistory();
  useEffect(async () => {
    getPaymentMethods();
    getPreviousPaymentDetails();
    var temp = await CountryCodes();
    setCountryCodes(temp);
    getCountries();
    getStates();
  }, []);
  // let SetDeliveryStatus = async (status) => {
  //   var pd = {...PaymentDetails};
  //   var dd = {...DeliveryDetails};
  //   dd["DeliveryStatus"] = status;
  //   pd["DeliveryStatus"] = status;
  //   setPaymentDetails(pd);
  //   setDeliveryDetails(dd);
  // };
  let CheckDriverAvailability = async () => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/deliveryDriver/check-availability`,
        {
          CityName: PaymentDetails["DeliveryCity"],
        }
      );
      if (response.data.status) {
        return response.data.deliveryDriverStatus;
      } else {
        firetoast("Something went wrong !", "default-error");
        return false;
      }
    } catch (e) {
      firetoast("Something went wrong", "error", 3000, "top-center");
      return false;
    }
  };
  let getPreviousPaymentDetails = async () => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/payment/user-history`
      );
      // setLastPaymentDetail(response.data.userPaymentHistory);
      setDeliveryHistory(response.data.userAddressHistory);
      setPayerHistory(response.data.userPaymentHistory);
      if (response.data.userPaymentHistory.length === 0) {
        setShowPaymentFields(true);
      }
      if (response.data.userAddressHistory.length === 0) {
        setShowDeliveryFields(true);
      }
    } catch (e) {
      console.log(e, "error while fetching previous details");
    }
  };
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
  var CalculateShippingv2 = async (item) => {
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
        console.log("ifcase")
        //Check Driver Availability for that city
        var driverStatus = await CheckDriverAvailability();
        if (driverStatus) {
          //driver available
          // setShippingPrice(0);
          // setDeliveryBy("dd");
          // SetDeliveryStatus("dd");
          CalculateShippingPricev2(item,true);
        } else {
          //no driver
          //DeliveryClient
          CalculateShippingPricev2(item,false);
        }
      } else {
        console.log("ifelsecase",item)
        //DeliveryClient
        CalculateShippingPricev2(item,false);
      }
    } else {
      console.log("elsecase")
      //DeliveryClient
      CalculateShippingPricev2(item,false);
    }
  };
  var CalculateShippingPricev2 = async (item,deliveryStatus) => {
    let countryId = CountrySelect;
    console.log(item,"item");
    let DriverAvailability=deliveryStatus ? "Y":"N"

    if (countryId === "226" || countryId === 226) {
      //usps price calculation
      var productIds = [];
      for (let j = 0; j < CartItems.length; j++) {
        productIds.push(CartItems[j].ProductID);
      }
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/usps/usa-price-plan`,
        {
          recipient_city: item["DeliveryCity"],
          recipient_zip: item["DeliveryZipCode"],
          ProductIDs: productIds,
          DriverAvailability
        }
      );
      var total = 0;
      var responses = response.data.saveResponse;
      // console.log(responses);
      for (let j = 0; j < responses.length; j++) {
        total +=
          parseFloat(responses[j]["data"]["price"]) +
          parseFloat(responses[j]["data"]["additional_charge"]);
      }
      if (deliveryStatus) {
        setDeliveryBy("dd");
        SetDeliveryStatus("dd");
      } 
      else{
      setShippingPrice(total);
      setDeliveryBy("usps");
      SetDeliveryStatus("usps");
      }
      localStorage.setItem("pp", JSON.stringify(responses));
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
  let handleChange = ({ currentTarget: input }) => {
    var data = { ...DeliveryDetails };
    if (input.name === "ExpirationDate") {
      data[input.name] = moment(input.value).format("MMYY");
    }
     else {
      data[input.name] = input.value;
    }
    setDeliveryDetails(data);
  };
  let DeliveryhandleChange = async ({ currentTarget: input }) => {
    var data = { ...DeliveryDetails };
    if (input.name === "ExpirationDate") {
      data[input.name] = moment(input.value).format("MMYY");
      setDeliveryDetails(data);
      return;
    }
    else if( input.name === "DeliveryZipCode" ){
      console.log("9eeeeeeeeeeeeeeeeeee")
      //!Check if there are any previous pending requests
      if(parseInt(input.value.length)==5){
        var productIds = [];
        for (let j = 0; j < CartItems.length; j++) {
          productIds.push(CartItems[j].ProductID);
        }
        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/usps/usa-price-plan`,
          { 
            
            recipient_city: data["DeliveryCity"],
            recipient_zip:  input.value,
            ProductIDs: productIds,
          }
        );
        var total = 0;
        var responses = response.data.saveResponse;
        // console.log(responses);
        for (let j = 0; j < responses.length; j++) {
          total +=
            parseFloat(responses[j]["data"]["price"]) +
            parseFloat(responses[j]["data"]["additional_charge"]);
        }
        setShippingPrice(total);
        setDeliveryBy("usps");
        SetDeliveryStatus("usps");
        localStorage.setItem("pp", JSON.stringify(responses));
        // data["DeliveryZipCode"] = input.value; 
      }
      else{
        setShippingPrice(0)
        // data["DeliveryZipCode"] = input.value;
      }
      data[input.name] = input.value;
    } 
     else if(input.name==="DeliveryState")
     {
      {console.log(JSON.parse(input.value).State,"JSON.parse(input.value).State")}
      if(JSON.parse(input.value).State==="New York")
      {
        getCities(91);
      }else{
        getCities(0);
      }
      console.log(JSON.parse(input.value).State)
      data['DeliveryState'] =JSON.parse(input.value).State
      data.DeliveryCity = null;
      setDeliveryDetails(data);
      return;
     }
     else if(input.name==="DeliveryCity")
     {
      data[input.name] =CitiesList && CitiesList.length > 0 ? JSON.parse(input.value).City:input.value
     }
     else{
    data[input.name] = input.value;
     }
    setDeliveryDetails(data);
  };
  // var handleCityChange = (e) => {
  //   var value = JSON.parse(e.target.value);
  //   var data = { ...DeliveryDetails };
  //   data["DeliveryCity"] = value.city_name;
  //   data["CityId"] = value.city_id;
  //   document.getElementById("p-area").selectedIndex = 0;
  //   document.getElementById("p-zone").selectedIndex = 0;
  //   getZones(value.city_id);
  //   setDeliveryDetails(data);
  // };
  var getCountries = async () => {
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + "/api/location/get-vendorAllowedCountries"
      );
      setCountryList(response.data.Countries);
    } catch (e) {
      console.log(e);
    }
  };
  var getStates = async (id) => {
    try {
      var response = await BanglaBazarApi.post(
        Endpoint + "/api/location/get-vendorAllowedStates",{
          CountryID: 226
        }
      );
      setStateList(response?.data.States);
    } catch (e) {
      console.log(e);
    }
  };
  var getCities = async (id) => {
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + `/api/location/get-cities/${id}`,{
        }
      );
      console.log(response.data)
      setCitiesList(response?.data.Cities);
    } catch (e) {
      console.log(e);
    }
  };
  var setPayment = async (id) => {
    let selectedCountry;
    let selectedGateway;
    for (let i = 0; i < CountryList.length; i++) {
      if (parseInt(id) === parseInt(CountryList[i].CountryID)) {
        selectedCountry = CountryList[i];
      }
    }

    for (let j = 0; j < Gateways.length; j++) {
      if (
        parseInt(selectedCountry.GatewayID) === parseInt(Gateways[j].GatewayID)
      ) {
        selectedGateway = Gateways[j];
      }
    }
    setPaymentMethod(selectedGateway);
    if (
      selectedGateway.GatewayName.toLowerCase().includes("ssl") ||
      selectedGateway.EndPoint.toLowerCase().includes("ssl")
    ) {
      setPaymentClient("ssl");
    } else {
      setPaymentClient("auth");
    }
  };
  
  //   var handleZoneChange = async (e) => {
  //     var data = { ...DeliveryDetails };
  //     data["ZoneId"] = e.target.value;
  //     getAreas(e.target.value);
  //     setDeliveryDetails(data);
  //   };
  let handleSameAsAbove = async (status) => {
    if (status) {
      let delivery_details = { ...DeliveryDetails };
      let obj = {
        DeliveryName: delivery_details["Name"] ? delivery_details["Name"] : "",
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
      //   await CalculateShipping();
    } else {
      var obj = { ...PaymentDetails };
      delete obj["Name"];
      delete obj["DeliveryPhoneNumber"];
      delete obj["DeliveryAddress1"];
      delete obj["DeliveryAddress2"];
      delete obj["DeliveryZipCode"];

      setPaymentDetails(obj);
    }
  };
  function sameValues(arr) {
    return arr.every((v, i, a) => v === a[0]);
  }
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
  var checkIfAvailableInInventory = async (Cart, Combination) => {
    ///api/wish-list/get-inventory
    var productCartList = [];
    for (let i = 0; i < Cart.length; i++) {
      var currentProduct = Cart[i];
      currentProduct["ProductCombinations"] = Combination[i];
      productCartList.push(currentProduct);
    }
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/wish-list/get-inventory`,
        { productCartList }
      );
      if (response.data.status) {
        var p_list = response.data.outOfStockProducts;

        if (p_list.length === 0) {
          return {
            value: true,
            data: [],
          };
        } else {
          return {
            value: false,
            data: p_list,
          };
        }
      }
      return {
        value: false,
        data: [],
      };
    } catch (e) {
      return {
        value: false,
        data: [],
      };
    }
  };
  var savePaymentDetails = async () => {
    var resp = await checkIfAvailableInInventory(
      CartItems,
      ProductCombinationItems
    );
    if (!resp.value) {
      if (resp.data.length === 0) {
        return firetoast("Something went wrong", "default-error");
      } else {
        let array = resp.data[0]["ProductDetail"];

        for (let i = 0; i < array.length; i++) {
          firetoast(
            `Sorry can't proceed with checkout the variant ${array[i]["OptionValue"]} for the product ${array[i]["Title"]} is out of stock`,
            "error",
            5000,
            "top-center"
          );
        }
        return;
      }
    }
    // productGlobalShipping,productShippingAvailable,productCity
    if (productGlobalShipping === "Y") {
      //available for globalshipping
      if (productShippingAvailable === "Y") {
        //proceed
      } else {
        if (productCity === PaymentDetails["DeliveryCity"]) {
          //proceed
        } else {
          return firetoast(
            `This product is only available for delivery in ${productCity}`
          );
        }
      }
    } else {
      if (CartItems.length === 1) {
        if (
          parseInt(CartItems[0]["ProductCountry"]) === parseInt(CountrySelect)
        ) {
          //proceed
          if (productShippingAvailable === "Y") {
            //proceed
          } else {
            if (productCity === PaymentDetails["DeliveryCity"]) {
              //proceed
            } else {
              return firetoast(
                `This product is only available for delivery in ${productCity}`
              );
            }
          }
        } else {
          return firetoast("Procduct can't be delivered in this country");
        }
      }
    }

    if (CountrySelect === "226" || CountrySelect === 226) {
      proceedPayment()
    //   let validateAddress = await ValidateUSPSAddresses();
    //   if (validateAddress) {
    //     proceedPayment();
    //   } else {
    //     return firetoast(
    //       "Delivery address information you provided is not valid",
    //       "error",
    //       6000,
    //       "top-center"
    //     );
    //   }
    // } else {
    //   proceedPayment();
    // }

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
    dd["DeliveryStatus"] = DeliveryStatus;
    dd["ShippingDate"]=DeliveryDetails.ShippingDate;
    //dd["DeliveryZipCode"] =PaymentDetails.DeliveryZipCode;//check why it is used
    dd["DeliveryZipCode"] =DeliveryDetails.DeliveryZipCode;
    setDeliveryDetails(dd);
    var letters = /^[A-Za-z ]+$/;
    if (parseInt(dd["CountryID"]) == 226  && parseInt(CountrySelect) == 226){
      console.log(dd,"ifcase")
      if (CheckEmpty(dd.Name) && PaymentType !== "cod") {
        return firetoast("Please provide your card name", "default-error");
      }
      if (CheckEmpty(dd.Address1) && PaymentType !== "cod") {
        return firetoast("Address 1 is required to proceed", "default-error");
      }
      if (CheckEmpty(dd.CountryID) && PaymentType !== "cod") {
        return firetoast("Please select your country", "default-error");
      }
      if (CheckEmpty(dd.CardNumber) && PaymentType !== "cod") {
        return firetoast("Please provide your card number", "default-error");
      }
      if(CheckEmpty(dd["DeliveryZipCode"]) || dd["DeliveryZipCode"].length !== 5){
        return firetoast("Please provide a 5 digits valid zipcode", "default-error");
      }
      if (CheckEmpty(dd.DeliveryName) && PaymentType !== "cod") {
        return firetoast("Please provide your name", "default-error");
      }
      if ((CheckEmpty(dd.DeliveryPhoneNumber) || dd.DeliveryPhoneNumber.length !=10) && PaymentType !== "cod") {
        return firetoast("Please provide your 10 digits phone number without country code", "default-error");
      }
      if (CheckEmpty(dd.DeliveryAddress1) && PaymentType !== "cod") {
        return firetoast("Delivery Address 1 is required to proceed", "default-error");
      }
      if(CheckEmpty(dd["DeliveryState"])){
        return firetoast("Please provide delivery state", "default-error");
      }
      console.log(dd["DeliveryCity"],"dd[DeliveryCity]")
      if(CheckEmpty(dd["DeliveryCity"])){
        return firetoast("Please provide delivery City", "default-error");
      }
      console.log(dd["DeliveryState"],"-------------"  )
      if(!dd["DeliveryState"].match(letters))
      {
        return firetoast(" Delivery state field cannot accept integer value", "default-error");
      }
      if(CheckEmpty(dd["DeliveryZipCode"]) || dd["DeliveryZipCode"].length !== 5){
        return firetoast("Please provide a 5 digits valid zipcode", "default-error");
      }
      if(CheckEmpty(dd["ShippingDate"])) {
        return firetoast("Please provide Desired Delivery Date ", "default-error");
      }
      if(CheckEmpty(dd["ShippingDate"])) {
        return firetoast("Please provide Desired Delivery Date ", "default-error");
      }
    } 
    else if (parseInt(dd["CountryID"]) == 16  && parseInt(CountrySelect) == 226){ 
      console.log("elsecase")   
      if (CheckEmpty(dd.DeliveryName) && PaymentType !== "cod") {
        return firetoast("Please provide your name", "default-error");
      }
      if ((CheckEmpty(dd.DeliveryPhoneNumber) || dd.DeliveryPhoneNumber.length!=10) && PaymentType !== "cod") {
        return firetoast("Please provide your 10 digits phone number without country code", "default-error");
      }
      if (CheckEmpty(dd.DeliveryAddress1) && PaymentType !== "cod") {
        return firetoast("Delivery Address 1 is required to proceed", "default-error");
      }
      if(CheckEmpty(dd["DeliveryState"]) ){
        return firetoast("Please provide delivery state", "default-error");
      }
      console.log(dd["DeliveryState"],"-------------"  )
      if(!dd["DeliveryState"].match(letters))
      {
        return firetoast(" Delivery state field cannot accept integer value", "default-error");
      }
      console.log(dd["DeliveryCity"],"dd[DeliveryCity]")
      if(CheckEmpty(dd["DeliveryCity"])){
        return firetoast("Please provide delivery City", "default-error");
      }
      console.log(dd["DeliveryZipCode"],"dd[DeliveryZipCode]")
      if(CheckEmpty(dd["DeliveryZipCode"]) || dd["DeliveryZipCode"].length !== 5){
        return firetoast("Please provide a 5 digits valid zipcode", "default-error");
      }
      if(CheckEmpty(dd["ShippingDate"])) {
        return firetoast("Please provide Desired Delivery Date ", "default-error");
      }
      dd["Name"] = CurrentUser["UserName"];
    }
    else{
      console.log("outercase")
      if (CheckEmpty(parseInt(dd["CountryID"])) && PaymentType !== "cod") {
        return firetoast("Please select your country", "default-error");
      }
    }
    initiateTransaction();
  };
  var getProductNames = () => {
    var array = [];
    for (let i = 0; i < CartItems.length; i++) {
      array.push(CartItems[i].Title);
    }
    return array.toString();
  };
  let initiateTransaction = async () => {
    var data = DeliveryDetails;
    console.log(DeliveryDetails);
    data.SessionID = localStorage.getItem("accessToken");
    data.total_amount = (TotalPrice + ShippingPrice).toFixed(2);
    data["GatewayID"] = PaymentMethod.GatewayID;
    if (PaymentType === "cod") {
      if (parseInt(CountrySelect) === 16) {
        data["currency"] = "BDT";
      } else {
        data["currency"] = "$";
      }
    } else {
      data["currency"] = PaymentMethod.CurrencyCode;
    }
    data["AllowStorePickup"] = AllowStorePickup;
    data["AllowAdminPickup"] = AllowAdminPickup;
    data["PhoneNumber"] = data.cus_phone;
    data["DeliveryStatus"] = DeliveryBy;
    data["DeliveryBy"] = DeliveryBy;
    data["OrderTotal"] = (TotalPrice + ShippingPrice + TaxValue).toFixed(2);

    data["product_name"] = getProductNames();
    data["product_category"] = "General";
    data["product_profile"] = "general";
    data["GetawayConfirmation"] = "YES";
    data["cus_email"] = CurrentUser.EmailAddress;
    data["cus_phone"] =
      CurrentUser.PhoneNumber === "null" || !CurrentUser.PhoneNumber
        ? PaymentDetails["DeliveryPhoneNumber"]
        : CurrentUser.PhoneNumber;
    data["cus_country"] = CountrySelect;
    data["ShippingHandling"] = ShippingPrice;
    data["Country"] = parseInt(CountrySelect) === 16 ? "Bangladesh" : "USA";
    data["saveAddress"] = SaveAddress;
    data["homeAddress"] = HomeAddress;
    data["ProcessStatus"] = "Processing";
    data["VendorPaymentStatus"] = "N";
    data["DeliveryConfirmationPic"] = null;
    data["ShippingLabel"] = null;
    data["TrackingNumber"] = null;
    setSaveAddress(SaveAddress);
    setHomeAddress(HomeAddress);
    data["shipping_method"] = "No";
    data["PaymentType"] = PaymentType;
    data["currency"] = CartItems[0]["Currency"];
    var ProductDetail = [];

    for (let i = 0; i < CartItems.length; i++) {
      var currentProduct = CartItems[i];
      currentProduct["Quantity"] = currentProduct["Total_Quantity"];
      let ProductVariantCombinationDetail = [];
      for (let j = 0; j < ProductCombinationItems[i].length; j++) {
        ProductVariantCombinationDetail.push(ProductCombinationItems[i][j]);
        currentProduct["VendorStoreID"] =
          ProductCombinationItems[i][j]["VendorStoreID"];
      }
      currentProduct["ProductVariantCombinationDetail"] =
        ProductVariantCombinationDetail;
      ProductDetail.push(currentProduct);
    }
    data["ProductDetail"] = ProductDetail;
    console.log(data["ProductDetail"],"ProductDetial--------------------------------------");
    let temp_prod_combo = "";
    let temp_array = [];
    var pricePlan = JSON.parse(localStorage.getItem("pp"));
       console.log(pricePlan,"pricePlan");
    for (let i = 0; i < data["ProductDetail"].length; i++) {
      temp_prod_combo = data["ProductDetail"][i]; // obj in array
      // console.log(temp_prod_combo["ItemsPrice"])
      let currentBase = parseFloat(temp_prod_combo["Price"])*parseFloat(temp_prod_combo["Quantity"]); //ItemsPrice in obj
      console.log(currentBase,"---------------currentBase")
      let currentCombinationPrice = 0;
      for (
        let j = 0;
        j < temp_prod_combo["ProductVariantCombinationDetail"].length;
        j++
      ) {
        // console.log(temp_prod_combo["ProductVariantCombinationDetail"][j])
        currentCombinationPrice += parseFloat(
          temp_prod_combo["ProductVariantCombinationDetail"][j][
            "ProductCombinationPrice"
          ]
        );
      }
      {console.log("at index-------------",i)}
      temp_prod_combo["itemsPrice"] = currentBase + currentCombinationPrice;
      temp_prod_combo["itemsShippingHandling"] =AllowStorePickup === "Y" ? 0 : parseFloat(pricePlan[i]["data"]["price"]);
      var temp_price_plane_value =AllowStorePickup === "Y"? 0: parseFloat(pricePlan[i]["data"]["price"]);
      let ItemsBeforeTax =
        parseFloat(currentBase) +
        parseFloat(currentCombinationPrice) +
        temp_price_plane_value;
      temp_prod_combo["itemsBeforeTax"] = ItemsBeforeTax.toFixed(2);
      console.log(ItemsBeforeTax,"ItemsBeforeTax")
      let ItemsEstimatedTax =
        (parseFloat(currentBase) + parseFloat(currentCombinationPrice)) *
        parseFloat(temp_prod_combo["TaxRate"] / 100).toFixed(2);
      temp_prod_combo["itemsEstimatedTax"] = ItemsEstimatedTax.toFixed(2);
      temp_prod_combo["itemsTotal"] = (
        ItemsBeforeTax + ItemsEstimatedTax
      ).toFixed(2);
      temp_array.push(temp_prod_combo);
    }

    var items_price = 0;

    for (let i = 0; i < data["ProductDetail"].length; i++) {
      var current = data["ProductDetail"][i];
      items_price += parseFloat(current["Price"]);
      for (
        let j = 0;
        j < current["ProductVariantCombinationDetail"].length;
        j++
      ) {
        var current_comb = current["ProductVariantCombinationDetail"][j];
        items_price += parseFloat(current_comb["ProductCombinationPrice"]);
      }
    }
    if (AllowStorePickup === "Y") {
      data["ShippingHandling"] = 0;
      data["TotalBeforeTax"] = items_price;
      data["DeliveryStatus"] = "SP";
      data["DeliveryBy"] = "SP";
    } else {
      data["ShippingHandling"] = ShippingPrice;
      data["TotalBeforeTax"] = items_price + ShippingPrice;
    }
    data["ItemsPrice"] = items_price;
    data["EstimatedTax"] = TaxValue;

    data = { ...data, ...PaymentDetails };
    // console.log(data);
    // return;

    if (CheckEmpty(data.DeliveryName)) {
      return firetoast(
        "Please provide name of person to deliver",
        "default-error"
      );
    }
    if (CheckEmpty(data.DeliveryPhoneNumber)) {
      return firetoast("Please provide delivery phone number", "default-error");
    }
    if (CheckEmpty(data.DeliveryAddress1)) {
      return firetoast("Please provide delivery address", "default-error");
    }
    // if (CheckEmpty(data.DeliveryCityID)) {
    //   return firetoast("Please select delivery city", "default-error");
    // }
    // if (CheckEmpty(data.DeliveryZoneID)) {
    //   return firetoast("Please select delivery zone", "default-error");
    // }
    // if (CheckEmpty(data.DeliveryAreaID)) {
    //   return firetoast("Please select delivery area", "default-error");
    // }
    if (CheckEmpty(data.DeliveryZipCode)) {
      return firetoast(
        "Please select provide delivery zipcode",
        "default-error"
      );
    }
    setStripeData(data);
    data.Name = CurrentUser["UserName"];

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
            localStorage.setItem("u_d", JSON.stringify(data));
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
          ///stripe-checkout/:orderNumber/:currency/:price
          setpaymentLoading(true);
          setShowModal(true);
          const response = await BanglaBazarApi.post(
            `${Endpoint}/api/stripe/init`,
            data
          );
          if (response.data.status) {
            localStorage.setItem("p_detail", JSON.stringify(CartItems));
            localStorage.setItem(
              "pC_detail",
              JSON.stringify(ProductCombinationItems)
            );
            localStorage.setItem("u_d", JSON.stringify(DeliveryDetails));
            localStorage.setItem("o_n", response.data.OrderNumber);

            if (response.data.status) {
              setpaymentLoading(false);
              setShowModal(false);
              setOrderNumber(response.data.OrderNumber);
              setTimeout(() => {
                history.push(
                  `/stripe-checkout/${response.data.OrderNumber}/${response.data.Currency}/${response.data.OrderTotal}/${response.data.CustomerID}`
                );
              }, 1000);
            } else {
              window.location.href = `/payment-checkout?status=failed&failure_message=${response.data.message}&paymentType=card`;
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
  var PopulatePaymentFields = (data) => {
    var dd = { ...DeliveryDetails };
    dd["Name"] = data.Name;
    dd["Address1"] = data.Address1;
    dd["Address2"] = data.Address2;
    // dd["CountryID"] = data.CountryID;
    dd["City"] = data.City;
    dd["State"] = data.State;
    dd["ZipCode"] = data.ZipCode;
    // dd["CountryID"] = data.CountryID;
    dd["Country"] = data.Country;
    dd["CardNumber"] = data.CardNumber;
    setDeliveryDetails(dd);
    setShowPaymentFields(true);
    setPayment(dd.CountryID);
  };
  var PopulateDeliveryFields = async (data) => {
    var pd = { ...DeliveryDetails };
    console.log(data,"DeliveryDetails")
    pd["DeliveryName"] = data.Name;
    pd["DeliveryPhoneNumber"] = data.PhoneNumber;
    pd["cus_phone"] = data.PhoneNumber;
    pd["cus_country"] = data.CountryID;
    pd["DeliveryAddress1"] = data.Address1;
    pd["DeliveryAddress2"] = data.Address2;
    pd["DeliveryCity"] = data.City;
    pd["DeliveryZipCode"] = data.ZipCode;
    pd["CountryID"] = data.CountryID;
    pd["UserNote"] = data.UserNote;
    pd["AddressLabel"] = data.AddressLabel;
    //pd["DeliveryCityID"] = data.CityID;
    pd["DeliveryZoneID"] = data.ZoneID;
    pd["DeliveryUserNote"] = data.UserNote;
    pd["PathaoCityID"] = data.PathaoCityID;
    await setDeliveryDetails(pd);
    await setShowDeliveryFields(true);
    await CalculateShippingv2({
      DeliveryCity: data.City,
      DeliveryZipCode: data.ZipCode,
    });

    setSelectedFromPrevious(false);
  };
  return (
    <>
      {PaymentType !== "cod" && (
        <>
          <h3 className="text-default mt-3 mb-3"> Payment Information</h3>
          <div className="row mt-2">
            <div className="col-md-6 col-sm-12">
              <label>Payer Country</label>
              <select
                className="form-control"
                name="CountryID"
                onChange={(e) => {
                  if(e.target.value === "select") {e.preventDefault()}
                  else{
                    handleChange(e);
                  setPayment(e.target.value);
                  }
                  
                }}
              >
                <option value="select">Select Country</option>
                {CountryList.map((item, index) => (
                  <option
                    value={item.CountryID}
                    key={index}
                    selected={
                      DeliveryDetails["CountryID"] &&
                      parseInt(DeliveryDetails["CountryID"]) ===
                        parseInt(item.CountryID)
                    }
                  >
                    {item.Country}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(DeliveryDetails["CountryID"] &&
            parseInt(DeliveryDetails["CountryID"])) !== 16 &&
            !ShowPaymentFields && (
              <div className="text-right" style={{ textAlign: "right" }}>
                <Link
                  to="#"
                  className="text-default td-none"
                  onClick={() => {
                    setDeliveryDetails({});
                    setShowPaymentFields(true);
                  }}
                >
                  <i className="fas fa-plus"></i> Add New
                </Link>
              </div>
            )}
          {!DeliveryDetails["CountryID"] ||
            (parseInt(DeliveryDetails["CountryID"]) !== 16 && (
              <>
                {!ShowPaymentFields &&
                  PayerHistory &&
                  PayerHistory.length > 0 &&
                  PayerHistory.map((item, index) => (
                    <div className="card mt-1" key={index}>
                      <div className="card-body">
                        <div className="d-flex align-tems-center w-100">
                          <div className="form-check form-check-inline">
                            <input
                              className="form-check-input default-check-color"
                              type="checkbox"
                              id="inlineCheckbox3"
                              onClick={() => PopulatePaymentFields(item)}
                            />
                          </div>
                          <div className="d-flex align-items-center justify-content-between w-100">
                            <div
                              style={{ marginLeft: "15px", fontSize: "15px" }}
                            >
                              {item.CardNumber.length > 4
                                ? item.CardNumber.slice(0, -4) + "****"
                                : item.CardNumber}
                            </div>
                            <div>
                              {item.PaymentType === "card" && (
                                <img src="https://img.icons8.com/external-obvious-flat-kerismaker/24/000000/external-card-payment-ecommerce-flat-obvious-flat-kerismaker.png" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </>
            ))}

          {(!DeliveryDetails["CountryID"] ||
            parseInt(DeliveryDetails["CountryID"]) !== 16) &&
            ShowPaymentFields && (
              <form>
                <div className="row mt-2">
                  <div className="col-md-6 col-sm-12">
                    <label>
                      Card Holder Name <RequiredField />
                    </label>
                    <input
                      className="form-control"
                      placeholder="Enter your name"
                      name="Name"
                      defaultValue={
                        DeliveryDetails["Name"] ? DeliveryDetails["Name"] : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label>
                      Card Number {PaymentType === "card" && <RequiredField />}
                    </label>
                    <input
                      onChange={handleChange}
                      name="CardNumber"
                      defaultValue={
                        DeliveryDetails["CardNumber"]
                          ? DeliveryDetails["CardNumber"]
                          : ""
                      }
                      // onlyCountries={countryCodes}
                      // country={"bd"}
                      // inputClass="adduser-phone"
                      // defaultValue={
                      //   DeliveryDetails["cus_phone"] ? DeliveryDetails["cus_phone"] : ""
                      // }
                      className="form-control"
                      // onChange={(e) => {
                      //   var data = { ...DeliveryDetails };
                      //   data["cus_phone"] = e.target.value;
                      //   setDeliveryDetails(data);
                      // }}
                    />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-12">
                    <label>
                      Address 1 <RequiredField />{" "}
                      {DeliveryDetails["Address1"] &&
                        DeliveryDetails["Address1"].length > 25 &&
                        Icons.GreenTick}
                    </label>
                    <input
                      className="form-control"
                      name="Address1"
                      defaultValue={
                        DeliveryDetails["Address1"]
                          ? DeliveryDetails["Address1"]
                          : ""
                      }
                      onChange={handleChange}
                    />

                    <small>
                      <span className="text-default">
                        {" "}
                        {DeliveryDetails["Address1"] &&
                          `${
                            DeliveryDetails["Address1"].length < 26
                              ? `Address should be 25 character long  (${
                                  25 - DeliveryDetails["Address1"].length
                                })`
                              : ""
                          }`}{" "}
                      </span>
                    </small>
                  </div>
                  <div className="col-12 mt-2">
                    <label>
                      Address 2{" "}
                      {DeliveryDetails["Address2"] &&
                        DeliveryDetails["Address2"].length > 25 &&
                        Icons.GreenTick}
                    </label>
                    <input
                      className="form-control"
                      name="Address2"
                      defaultValue={
                        DeliveryDetails["Address2"]
                          ? DeliveryDetails["Address2"]
                          : ""
                      }
                      onChange={handleChange}
                    />

                    <small>
                      <span className="text-default">
                        {" "}
                        {DeliveryDetails["Address2"] &&
                          `${
                            DeliveryDetails["Address2"].length < 26
                              ? `Address should be 25 character long (${
                                  25 - DeliveryDetails["Address2"].length
                                })`
                              : ""
                          }`}{" "}
                      </span>
                    </small>
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-6 col-sm-12">
                    <label>State</label>
                    <input
                      className="form-control"
                      name="State"
                      defaultValue={
                        DeliveryDetails["State"] ? DeliveryDetails["State"] : ""
                      }
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                  <div className="col-md-6 col-sm-12">
                    <label>City</label>
                    <input
                      className="form-control"
                      name="City"
                      defaultValue={
                        DeliveryDetails["City"] ? DeliveryDetails["City"] : ""
                      }
                      onChange={(e) => handleChange(e)}
                    />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-6 col-sm-12">
                    <label>ZipCode</label>
                    <input
                      className="form-control"
                      name="ZipCode"
                      defaultValue={
                        DeliveryDetails["ZipCode"]
                          ? DeliveryDetails["ZipCode"]
                          : ""
                      }
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row mt-2">
                  <div className="col-md-6 col-sm-12">
                    <div>
                      <label className="text-white"> aa</label>
                    </div>
                    <label>
                      {" "}
                      <div className="d-flex align-items-center">
                        <div>
                          {" "}
                          <input
                            type="checkbox"
                            className="form-check-input default-check-color"
                            onChange={(e) => {
                              e.target.checked
                                ? setSaveAddress(true)
                                : setSaveAddress(false);
                            }}
                          />{" "}
                        </div>
                        <div style={{ paddingLeft: "10px" }}>
                          {" "}
                          Save address for later use
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </form>
            )}
        </>
      )}
      <>
        <h3 className="text-default mt-3 mb-3"> Delivery Information</h3>
        {!ShowDeliveryFields && (
          <div className="text-right" style={{ textAlign: "right" }}>
            <Link
              to="#"
              className="text-default td-none"
              onClick={() => {
                setPaymentDetails({});
                setShowDeliveryFields(true);
              }}
            >
              <i className="fas fa-plus"></i> Add New
            </Link>
          </div>
        )}
        {!ShowDeliveryFields &&
          DeliveryHistory &&
          DeliveryHistory.length > 0 &&
          DeliveryHistory.map((item, index) => (
            <div className="card" key={index}>
              <div className="card-body">
                <div className="d-flex align-tems-center w-100">
                  <div className="form-check form-check-inline">
                    <input
                      className="form-check-input default-check-color"
                      type="checkbox"
                      id="inlineCheckbox3"
                      onClick={() => PopulateDeliveryFields(item)}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-between w-100">
                    <div style={{ marginLeft: "15px", fontSize: "15px" }}>
                      {item.Address1}
                    </div>
                    <div style={{ marginLeft: "15px", fontSize: "15px" }}>
                      {item.City}, {item.DeliveryZone}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

        {ShowDeliveryFields && (
          <>
            {SelectedFromPrevious && (
              <div className="row mt-2">
                <div className="col-md-6 col-sm-12">
                  <div>
                    <label className="text-white"> aa</label>
                  </div>
                  <label>
                    {" "}
                    <div className="d-flex align-items-center">
                      <div>
                        {" "}
                        <input
                          type="checkbox"
                          className="form-check-input default-check-color"
                          onChange={() => {
                            setSameAsAbove(!SameAsAbove);
                            handleSameAsAbove(!SameAsAbove);
                          }}
                        />{" "}
                      </div>
                      <div style={{ paddingLeft: "10px" }}> Same as above</div>
                    </div>
                  </label>
                </div>
              </div>
            )}
            <form>
              <div className="row mt-2">
                <div className="col-md-6 col-sm-12">
                  <label>
                    Full Name <RequiredField />
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter your name"
                    name="DeliveryName"
                    defaultValue={
                      DeliveryDetails["DeliveryName"]
                        ? DeliveryDetails["DeliveryName"]
                        : ""
                    }
                    onChange={DeliveryhandleChange}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>
                    Phone Number <RequiredField />
                  </label>
                  <input
                  type="number"
                    className="form-control"
                    onChange={DeliveryhandleChange}
                    defaultValue={
                      DeliveryDetails["DeliveryPhoneNumber"]
                        ? DeliveryDetails["DeliveryPhoneNumber"]
                        : ""
                    }
                    name="DeliveryPhoneNumber"
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-12">
                  <label>
                    Address 1 <RequiredField />
                    {DeliveryDetails &&
                      DeliveryDetails["DeliveryAddress1"] &&
                      DeliveryDetails["DeliveryAddress1"].length > 25 &&
                      Icons.GreenTick}
                  </label>
                  <input
                    className="form-control"
                    name="DeliveryAddress1"
                    defaultValue={
                      DeliveryDetails["DeliveryAddress1"]
                        ? DeliveryDetails["DeliveryAddress1"]
                        : ""
                    }
                    onChange={DeliveryhandleChange}
                  />
                  <small>
                    <span className="text-default">
                      {" "}
                      {DeliveryDetails &&
                        DeliveryDetails["DeliveryAddress1"] &&
                        `${
                          DeliveryDetails["DeliveryAddress1"].length < 26
                            ? `Address should be 25 character long (${
                                25 - DeliveryDetails["DeliveryAddress1"].length
                              })`
                            : ""
                        }`}{" "}
                    </span>
                  </small>
                </div>
                <div className="col-12">
                  <label>Address 2</label>
                  <input
                    className="form-control"
                    name="DeliveryAddress2"
                    defaultValue={
                      DeliveryDetails["DeliveryAddress2"]
                        ? DeliveryDetails["DeliveryAddress2"]
                        : ""
                    }
                    onChange={DeliveryhandleChange}
                  />

                  <small>
                    <span className="text-default">
                      {" "}
                      {DeliveryDetails &&
                        DeliveryDetails["DeliveryAddress2"] &&
                        `${
                          DeliveryDetails["DeliveryAddress2"].length < 26
                            ? `Address should be 25 character long (${
                                25 - DeliveryDetails["DeliveryAddress2"].length
                              })`
                            : ""
                        }`}{" "}
                    </span>
                  </small>
                </div>
                <div className="col-6">
                  <label>Address Label</label>
                  <input
                    className="form-control"
                    name="AddressLabel"
                    defaultValue={
                      DeliveryDetails && DeliveryDetails["AddressLabel"]
                        ? DeliveryDetails["AddressLabel"]
                        : ""
                    }
                    onChange={DeliveryhandleChange}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <div>
                    <label className="text-white"> aa</label>
                  </div>
                  <label>
                    {" "}
                    <div className="d-flex align-items-center">
                      <div>
                        {" "}
                        <input
                          type="checkbox"
                          className="form-check-input default-check-color"
                          onChange={(e) => {
                            e.target.checked
                              ? setHomeAddress(true)
                              : setHomeAddress(false);
                          }}
                        />{" "}
                      </div>
                      <div style={{ paddingLeft: "10px" }}>
                        {" "}
                        Mark as home address
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                  <label>
                    State <RequiredField />
                  </label>
                  <select
                            className="form-control"
                            onChange={(e) => {
                              if(e.target.value === "select") {e.preventDefault()}
                              //setStoreState(JSON.parse(e.target.value).State);
                              else{
                              DeliveryhandleChange(e)}
                            }}
                            defaultValue={
                              DeliveryDetails["DeliveryState"]
                                ? DeliveryDetails["DeliveryState"]
                                : ""
                            }
                            name="DeliveryState"
                          >
                            <option value="select">Select State</option>
                            {StateList &&
                              StateList.map((item, index) => (
                                <option
                                  value={JSON.stringify(item)}
                                  key={index}
                                  selected={ DeliveryDetails["DeliveryState"] === item.State}
                                >
                                  {item.State}
                                </option>
                              ))}
                          </select>
                  {/* <input
                    className="form-control"
                    onChange={DeliveryhandleChange}
                    defaultValue={
                      DeliveryDetails["DeliveryState"]
                        ? DeliveryDetails["DeliveryState"]
                        : ""
                    }
                    name="DeliveryState"
                  /> */}
                </div>
              <div className="col-md-6 col-sm-12">
                  <label>
                    City <RequiredField />
                  </label>
                  {CitiesList && CitiesList.length >0 ?
                  <select
                            className="form-control"
                            onChange={(e) => {
                              if(e.target.value === "select") {e.preventDefault()}
                              //setStoreState(JSON.parse(e.target.value).State);
                              else{
                              DeliveryhandleChange(e)
                              }
                            }}
                            defaultValue={
                              DeliveryDetails["DeliveryCity"]
                              ? DeliveryDetails["DeliveryCity"]
                              : ""
                            }
                            name="DeliveryCity"
                          >
                            <option value="select">Select City </option>
                            {CitiesList &&
                              CitiesList.map((item, index) => (
                                <option
                                  value={JSON.stringify(item)}
                                  key={index}
                                  selected={ DeliveryDetails["DeliveryCity"] === item.City}
                                >
                                  {item.City}
                                </option>
                              ))}
                          </select>:
                  <input
                    className="form-control"
                    onChange={DeliveryhandleChange}
                    value={
                      DeliveryDetails["DeliveryCity"]
                        ? DeliveryDetails["DeliveryCity"]
                        : ""
                    }
                    name="DeliveryCity"
                  />
}
                </div>

                <div className="col-md-6 col-sm-12">
                  <label>
                    ZipCode <RequiredField />
                  </label>
                  {console.log(!DeliveryDetails["DeliveryState"],"DeliveryDetails[DeliveryState]")}
                  {console.log(!DeliveryDetails["DeliveryCity"],"DeliveryDetails[DeliveryCity ]")}
                  <input
                    className="form-control"
                    disabled={!DeliveryDetails["DeliveryCity"] || !DeliveryDetails["DeliveryState"]}
                    name="DeliveryZipCode"
                    id="DeliveryZipCode"
                    type="number"
                    defaultValue={null
                    }
                    onChange={async (e) => {
                      DeliveryhandleChange(e);
                    }}
                  />
                  {CountrySelect === "226" && (
                    <small>
                      <span className="text-default">
                        {" "}
                       { console.log(! DeliveryDetails["DeliveryCity"], !DeliveryDetails["DeliveryState"])}
                        { ! DeliveryDetails["DeliveryCity"] || !DeliveryDetails["DeliveryState"] ? <><div
                         className="text-danger mt-4" style = {{fontSize: "15px"}}>Please enter delivery state and delivery city first</div></>:  <>Valid 5 digits ZipCode is required for shipping price calculation 
                    </>

                        }
                    
                      </span>
                    </small>
                  )}
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>Desired Delivery Date <RequiredField /></label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    name="ShippingDate"
                    onChange={DeliveryhandleChange}
                  />
                  <small className="text-default">
                    We will try to honor that, no guarantee
                  </small>
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6 col-sm-12">
                  <label>Delivery Note</label>
                  <textarea
                    className="form-control"
                    name="DeliveryUserNote"
                    defaultValue={
                      DeliveryDetails && DeliveryDetails["DeliveryUserNote"]
                        ? DeliveryDetails["DeliveryUserNote"]
                        : ""
                    }
                    onChange={DeliveryhandleChange}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-12 col-sm-12">
                  {PickUpByUser &&
                    DeliveryDetails &&
                    DeliveryDetails.DeliveryCity &&
                    DeliveryDetails.DeliveryCity === OverallCity && (
                      <form>
                        <div className="row w-100 mt-2">
                          <label>
                            We noticed that you can pick up your order from
                            store as vendor is in same city , so do you want to
                            pick up by yourself?{" "}
                          </label>
                          <div className="col-12 row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              <div className="form-check form-check-inline">
                                <input
                                  type="radio"
                                  className="cs-bi-radios-input"
                                  name="activefield"
                                  checked={AllowStorePickup === "Y"}
                                  onChange={() => {
                                    setAllowStorePickup("Y");
                                    setAllowAdminPickup("N");
                                    setShippingPrice(0);
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineCheckbox3"
                                >
                                  Yes
                                </label>
                              </div>
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              <div className="form-check form-check-inline">
                                <input
                                  type="radio"
                                  className="cs-bi-radios-input"
                                  name="activefield"
                                  checked={AllowStorePickup === "N"}
                                  onChange={() => {
                                    setAllowStorePickup("N");
                                    setAllowAdminPickup("Y");
                                  }}
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineCheckbox3"
                                >
                                  No
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </form>
                    )}
                </div>
              </div>
              <div className="row mt-2">
                <div className="col-md-12 col-sm-12">
                  <div>
                    <label className="text-white"> aa</label>
                  </div>
                  <label>
                    {" "}
                    <div className="d-flex align-items-center">
                      <div>
                        {" "}
                        <input
                          type="checkbox"
                          className="form-check-input default-check-color"
                          onClick={() => setAgreeTerms(!AgreeTerms)}
                        />{" "}
                      </div>
                      <div style={{ paddingLeft: "10px" }}>
                        {" "}
                        I agree to the{" "}
                        <a  style={{color:"#6f9642", textDecoration:"underline"}} href="/terms-conditions" target="_blank">
                          Terms & Conditions , 
                        </a>{" "}
                        <a style={{color:"#6f9642", textDecoration:"underline"}} href="/refund-and-return" target="_blank">
                          Refund policy {" "}
                        </a>
                        and value{" "}
                        <a style={{color:"#6f9642", textDecoration:"underline"}} href="/privacy-policy" target="_blank">
                          Privacy policy
                        </a>
                        .
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </>
        )}

        <div className="row">
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
                    disabled={!AgreeTerms }
                    onClick={() => savePaymentDetails()}
                  >
                    Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
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
export default UsaDelivery;
