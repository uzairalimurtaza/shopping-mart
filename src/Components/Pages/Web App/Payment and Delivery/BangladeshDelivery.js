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

function BangladeshDelivery({
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
  const [CityList, setCityList] = useState([]);
  const [ZoneList, setZoneList] = useState([]);
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
    getPathaoToken();
    getPaymentMethods();
    getPreviousPaymentDetails();
    var temp = await CountryCodes();
    setCountryCodes(temp);
    getCountries();
  }, []);
  // let SetDeliveryStatus = async (status) => {
  //   var pd = {...PaymentDetails};
  //   var dd = {...DeliveryDetails};
  //   dd["DeliveryStatus"] = status;
  //   pd["DeliveryStatus"] = status;
  //   setPaymentDetails(pd);
  //   setDeliveryDetails(dd);
  // };
  let CheckDriverAvailability = async (DeliveryCity) => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/deliveryDriver/check-availability`,
        {
          CityName: DeliveryCity,
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
  var CalculateShipping = async (item) => {
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
      console.log(currentItemsCities[0])
      console.log(DeliveryDetails.DeliveryCity,"DeliveryCity")
      if (currentItemsCities[0] === DeliveryDetails.DeliveryCity) {
        //Check Driver Availability for that city
        var driverStatus = await CheckDriverAvailability();
        // console.log(driverStatus);
        if (driverStatus) {
          console.log("Driver case")
          //driver available
          CalculateShippingPrice(total_weight, item, true);
          // if (item) {
          //   var data = { ...PaymentDetails };
          //   data["DeliveryAreaID"] = item.area_id;
          //   data["DeliveryArea"] = item.area_name;
          //   await setPaymentDetails(data);
          // }
        } else {
          console.log("else case 1")
          //no driver
          //DeliveryClient
          CalculateShippingPrice(total_weight, item, false);
        }
      } else {
        console.log("else case 2")
        //DeliveryClient
        CalculateShippingPrice(total_weight, item, false);
      }
    } else {
      console.log("else case 3")
      //DeliveryClient
      CalculateShippingPrice(total_weight, item, false);
    }
  };
  var CalculateShippingPrice = async (weight, item, deliveryStatus) => {
    var pd = { ...DeliveryDetails };
    let countryId = CountrySelect;
    console.log(DeliveryDetails,"DeliveryDetails")
    let DriverAvailability=deliveryStatus ? "Y":"N"
    if (countryId === "16" || countryId === 16) {
      //bangladesh go for pathao
      //patho price calculation
      var productIds = [];
      for (let j = 0; j < CartItems.length; j++) {
        productIds.push(CartItems[j].ProductID);
      }
      console.log(pd,"pd.PathaoCityIDs")
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/price-plan`,
        {
          token: PathaoAccessToken,
          recipient_city: pd.PathaoCityID,
          recipient_zone: pd.DeliveryZoneID,
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
      localStorage.setItem("pp", JSON.stringify(responses));
      setShippingPrice(parseFloat(total.toFixed(2)));
      if (deliveryStatus) {
        setDeliveryBy("dd");
        SetDeliveryStatus("dd");
      } else {
        setDeliveryBy("pathao");
        SetDeliveryStatus("pathao");
      }

      var data = { ...DeliveryDetails };
      data["DeliveryAreaID"] = item.area_id;
      data["DeliveryArea"] = item.area_name;
      await setDeliveryDetails(data);
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
        // console.log(response.data);
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
      if (deliveryStatus) {
        setDeliveryBy("dd");
        SetDeliveryStatus("dd");
      } else {
        setDeliveryBy("usps");
        SetDeliveryStatus("usps");
      }

      setShippingPrice(totalShippingRate);
      setRateCalculation(false);

      var data = { ...DeliveryDetails };
      data["DeliveryAreaID"] = item.area_id;
      data["DeliveryArea"] = item.area_name;
      await  setDeliveryDetails(data);
      //setPaymentDetails(data);
    }
  };
  let CalculateShippingv2 = async (item) => {
    let cartItems = [...CartItems];
    let currentItemsCities = [];
    var total_weight = 0.0;
    for (let i = 0; i < cartItems.length; i++) {
      total_weight += parseFloat(cartItems[i].Weight);
      currentItemsCities.push(cartItems[i].City);
    }
    console.log("inside this")
    const allEqual = (arr) => arr.every((v) => v === arr[0]);
    var sameProductCities = allEqual(currentItemsCities);
    if (sameProductCities) {
      console.log(currentItemsCities[0])
      console.log({...item},"PaymentDetails")
      if (currentItemsCities[0] === item["DeliveryCity"]) {
        console.log("driver case")
        //Check Driver Availability for that city
        var driverStatus = await CheckDriverAvailability(item["DeliveryCity"]);
        if (driverStatus) {
          //driver available
          CalculateShippingPricev2(item,true);
        } else {
          //no driver
          //DeliveryClient
          console.log("else case 1")

          CalculateShippingPricev2(item,false);
        }
      } else {
        console.log("else case 2.1")
        //DeliveryClient
        CalculateShippingPricev2(item,false);
      }
    } else {
      console.log("else case 3.1")
      //DeliveryClient
      CalculateShippingPricev2(item,false);
    }
  };
  var CalculateShippingPricev2 = async (item,deliveryStatus) => {
    let countryId = CountrySelect;
    console.log(item);
    let DriverAvailability=deliveryStatus ? "Y":"N"
    if (countryId === "16" || countryId === 16) {
      //bangladesh go for pathao
      //patho price calculation
      var productIds = [];
      for (let j = 0; j < CartItems.length; j++) {
        productIds.push(CartItems[j].ProductID);
      }
      console.log(item,"item.PathaoCityID ")
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/price-plan`,
        {
          token: PathaoAccessToken,
          // item_weight: weight,
          recipient_city: item.DeliveryCityID,
          recipient_zone: item["DeliveryZoneID"],
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
      localStorage.setItem("pp", JSON.stringify(responses));
      setShippingPrice(parseFloat(total.toFixed(2)));
      if (deliveryStatus) {
        setDeliveryBy("dd");
        SetDeliveryStatus("dd");
      } else {
        setDeliveryBy("pathao");
        SetDeliveryStatus("pathao");
      }
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
    } else {
      data[input.name] = input.value;
    }
    setDeliveryDetails(data);
  };
  let DeliveryhandleChange = ({ currentTarget: input }) => {
    var data = { ...DeliveryDetails };
    if (input.name === "ExpirationDate") {
      data[input.name] = moment(input.value).format("MMYY");
    } else {
      data[input.name] = input.value;
    }
    console.log(input.name, input.value," input.value")
    console.log(data)
    //setPaymentDetails(data);
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
  useEffect(() => {
    if (CountrySelect) getCities(CountrySelect);
  }, [ShowPrevPayment, CountrySelect]);
  var getCities = async (id) => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/get-pathao-cities
        `,
        {
          token: PathaoAccessToken,
        }
      );
      setCityList(response.data.cities);
      setPaymentCities(response.data.cities);
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
  var getZones = async (id) => {
    setZoneLoading(true);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/get-pathao-zone
        `,
        {
          token: PathaoAccessToken,
          city_id: id,
        }
      );
      setZoneList(response.data.zones);
      setZoneLoading(false);
    } catch (e) {
      setZoneLoading(false);
      console.log(e);
    }
  };
  //   var handleZoneChange = async (e) => {
  //     var data = { ...DeliveryDetails };
  //     data["ZoneId"] = e.target.value;
  //     getAreas(e.target.value);
  //     setDeliveryDetails(data);
  //   };
  var getAreas = async (id) => {
    setAreaLoading(true);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/get-pathao-area
        `,
        {
          token: PathaoAccessToken,
          zone_id: id,
        }
      );
      setAreaList(response.data.areas);
      setAreaLoading(false);
    } catch (e) {
      setAreaLoading(false);
      console.log(e);
    }
  };
  var handleCityChange = (e) => {
    var value = JSON.parse(e.target.value);
    var data = { ...DeliveryDetails };
    console.log(value,"value.PathaoCityID")
    data["DeliveryCity"] = value.PathaoCityName;
    data["DeliveryCityID"] = value.DBCityID;
    data["PathaoCityID"] = value.PathaoCityID;
    document.getElementById("d-area").selectedIndex = 0;
    document.getElementById("d-zone").selectedIndex = 0;
    getZones(value.PathaoCityID);
    // data["DeliveryZone"] = null;
    // data["DeliveryZoneID"] = null;
    // data["DeliveryArea"] = null;
    // data["DeliveryAreaID"] = null;
    setDeliveryDetails(data);
  };
  var getZones = async (id) => {
    setZoneLoading(true);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/get-pathao-zone
        `,
        {
          token: PathaoAccessToken,
          city_id: id,
        }
      );
      setZoneList(response.data.zones);
      setZoneLoading(false);
    } catch (e) {
      console.log(e);
      setZoneLoading(false);
    }
  };
  var handleZoneChange = async (e) => {
    var paymentDetail = { ...DeliveryDetails };
    paymentDetail["DeliveryZoneID"] = e.zone_id;
    paymentDetail["DeliveryZone"] = e.zone_name;
    getAreas(e.zone_id);
    setDeliveryDetails(paymentDetail);
    // CalculateShipping();
  };
  var handleAreaChange = async (item) => {
    CalculateShipping(item);
  };
  var getAreas = async (id) => {
    setAreaLoading(true);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/get-pathao-area
        `,
        {
          token: PathaoAccessToken,
          zone_id: id,
        }
      );
      setAreaList(response.data.areas);
      setAreaLoading(false);
    } catch (e) {
      console.log(e);
      setAreaLoading(false);
    }
  };
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
      setDeliveryDetails(obj);
      //setPaymentDetails(obj);
      //   await CalculateShipping();
    } else {
      var obj = { ...PaymentDetails };
      delete obj["Name"];
      delete obj["DeliveryPhoneNumber"];
      delete obj["DeliveryAddress1"];
      delete obj["DeliveryAddress2"];
      delete obj["DeliveryZipCode"];
      setDeliveryDetails(obj);
    //  setPaymentDetails(obj);
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
    console.log()
    dd["GatewayID"] = PaymentMethod.GatewayID;
    dd["Currency"] = PaymentMethod.CurrencyCode;
    dd["AllowStorePickup"] = AllowStorePickup;
    dd["AllowAdminPickup"] = AllowAdminPickup;
    dd["PhoneNumber"] = DeliveryDetails.cus_phone;
    dd["PaymentType"] = PaymentType;
    dd["DeliveryStatus"] = DeliveryBy;
    dd["DeliveryStatus"] = DeliveryStatus;
    //dd["ShippingDate"]=DeliveryDetails.ShippingDate;

    setDeliveryDetails(dd);
    console.log(dd,"parseInt(dd[")
    if (parseInt(dd["CountryID"]) == 226 && parseInt(CountrySelect) == 16) {
      console.log(dd,"ifcase")
      if (CheckEmpty(dd.Name) && PaymentType !== "cod") {
        return firetoast("Please provide your name", "default-error");
      }
      if (CheckEmpty(dd.Address1) && PaymentType !== "cod") {
        return firetoast("Address 1 is required to proceed", "default-error");
      }
      if (CheckEmpty(dd.CardNumber) && PaymentType !== "cod") {
        return firetoast("Please provide your card number", "default-error");
      }
      if (CheckEmpty(dd.DeliveryName)) {
        return firetoast("Please provide your delivery name", "default-error");
      }
      if (CheckEmpty(dd.DeliveryPhoneNumber)) {
        return firetoast("Please provide your delivery phone number", "default-error");
      }
      if (CheckEmpty(dd.DeliveryAddress1)) {
        return firetoast("Delivery Address 1 is required to proceed", "default-error");
      }
      if(CheckEmpty(dd["ShippingDate"])) {
        return firetoast("Please provide Desired Delivery Date ", "default-error");
      }
      if(CheckEmpty(dd["DeliveryCity"])) {
        return firetoast("Please provide your delivery city", "default-error");
      }
      if(CheckEmpty(dd["DeliveryZone"])) {
        return firetoast("Please provide your delivery zone", "default-error");
      }
      if(CheckEmpty(dd["DeliveryAreaID"])) {
        return firetoast("Please provide delivery area", "default-error");
      }
      if(CheckEmpty(dd["ShippingDate"])) {
        return firetoast("Please provide Desired Delivery Date ", "default-error");
      }
    } else if ((parseInt(dd["CountryID"]) == 16  && parseInt(CountrySelect) == 16)) {
      //bangla
      console.log(dd,"----------------")
      if (CheckEmpty(dd.DeliveryName) ) {
        return firetoast("Please provide your full name", "default-error");
      }
      if (CheckEmpty(dd.DeliveryPhoneNumber) ) {
        return firetoast("Please provide your delivery phone number", "default-error");
      }
      if (CheckEmpty(dd.DeliveryAddress1) ) {
        return firetoast("Delivery Address 1 is required to proceed", "default-error");
      }
      if(CheckEmpty(dd["DeliveryZipCode"])){
        return firetoast("Please provide valid zipcode", "default-error");
      }
      if(CheckEmpty(dd["DeliveryCity"])) {
        return firetoast("Please provide your delivery city", "default-error");
      }
      if(CheckEmpty(dd["DeliveryZone"])) {
        return firetoast("Please provide your delivery zone", "default-error");
      }
      if(CheckEmpty(dd["DeliveryAreaID"])) {
        return firetoast("Please provide delivery area", "default-error");
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
    // console.log(data["ProductDetail"]);
    let temp_prod_combo = "";
    let temp_array = [];
    var pricePlan = JSON.parse(localStorage.getItem("pp"));
    //   console.log(pricePlan);
    for (let i = 0; i < data["ProductDetail"].length; i++) {
      temp_prod_combo = data["ProductDetail"][i]; // obj in array
      // console.log(temp_prod_combo["ItemsPrice"])
      let currentBase = parseFloat(temp_prod_combo["Price"]); //ItemsPrice in obj
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
      // console.log("priceplan", pricePlan);
      temp_prod_combo["itemsPrice"] = currentBase + currentCombinationPrice;
      temp_prod_combo["itemsShippingHandling"] =
        AllowStorePickup === "Y"
          ? 0
          : parseFloat(pricePlan[i]["data"]["price"]);
      var temp_price_plane_value =
        AllowStorePickup === "Y"
          ? 0
          : parseFloat(pricePlan[i]["data"]["price"]);
      let ItemsBeforeTax =
        parseFloat(currentBase) +
        parseFloat(currentCombinationPrice) +
        temp_price_plane_value;
      temp_prod_combo["itemsBeforeTax"] = ItemsBeforeTax.toFixed(2);
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
    if (CheckEmpty(data.DeliveryCityID)) {
      return firetoast("Please select delivery city", "default-error");
    }
    if (CheckEmpty(data.DeliveryZoneID)) {
      return firetoast("Please select delivery zone", "default-error");
    }
    if (CheckEmpty(data.DeliveryAreaID)) {
      return firetoast("Please select delivery area", "default-error");
    }
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
        console.log(PaymentClient,"PaymentClient")
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
    console.log(dd.CountryID,"(dd.CountryID")
    setPayment(dd.CountryID);
  };
  var PopulateDeliveryFields = async (data) => {
    var pd = { ...DeliveryDetails };
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
    pd["DeliveryCityID"] = data.CityID;
    pd["DeliveryZoneID"] = data.ZoneID;
    pd["AreaID"] = data.AreaID;
    pd["DeliveryAreaID"] = data.AreaID;
    pd["DeliveryZoneID"] = data.ZoneID;
    pd["DeliveryZone"] = data.DeliveryZone;
    pd["DeliveryArea"] = data.DeliveryArea;
    pd["DeliveryUserNote"] = data.UserNote;
    pd["PathaoCityID"] = data.PathaoCityID;
    console.log(data.PathaoCityID,"PathaoCityID")
    await getZones(data.PathaoCityID);
    await getAreas(data.ZoneID);
    await setDeliveryDetails(pd);
    await setShowDeliveryFields(true);
    await CalculateShippingv2({
      DeliveryCityID: data.PathaoCityID,
      DeliveryZoneID: data.ZoneID,
      DeliveryCity : data.City
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
                setDeliveryDetails({});
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
                    City <RequiredField />
                  </label>

                  <select
                    className="form-control"
                    type="text"
                    name="DeliveryCity"
                    id="d-city"
                    placeholder="Enter City"
                    onChange={(e) => {
                      handleCityChange(e);
                    }}
                  >
                    <option>Select City</option>
                    {CityList.map((item, index) => (
                      <option
                        key={index}
                        value={JSON.stringify(item)}
                        selected={
                          DeliveryDetails &&
                          DeliveryDetails["DeliveryCityID"] &&
                          parseInt(DeliveryDetails["DeliveryCityID"]) ===
                            parseInt(item.DBCityID)
                        }
                      >
                        {item.PathaoCityName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>
                    Zones <RequiredField />
                  </label>
                  {ZoneLoading ? (
                    <div className="text-center">
                      <Spinner size={"sm"} color="default" /> Getting zones ...
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      type="text"
                      name="Zones"
                      id="d-zone"
                      placeholder="Enter Zone"
                      onChange={async (e) => {
                        var item = JSON.parse(e.target.value);
                        handleZoneChange(item);
                      }}
                    >
                      <option>Select Zone</option>
                      {ZoneList.length > 0 &&
                        ZoneList.map((item, index) => (
                          <option
                            key={index}
                            value={JSON.stringify(item)}
                            selected={
                              DeliveryDetails &&
                              DeliveryDetails["DeliveryZoneID"] &&
                              parseInt(DeliveryDetails["DeliveryZoneID"]) ===
                                parseInt(item.zone_id)
                            }
                          >
                            {item.zone_name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>
                    Area <RequiredField />
                  </label>
                  {AreaLoading ? (
                    <div className="text-center">
                      <Spinner size={"sm"} color="default" /> Getting areas ...
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      type="text"
                      name="DeliveryAreaID"
                      id="d-area"
                      placeholder="Select Area"
                      onChange={(e) => {
                        var item = JSON.parse(e.target.value);
                        handleAreaChange(item);
                        setAllowAdminPickup("Y");
                        setAllowStorePickup("N");
                      }}
                    >
                      <option >Select Area</option>
                      {AreaList.map((item, index) => (
                        <option
                          key={index}
                          value={JSON.stringify(item)}
                          selected={
                            DeliveryDetails && DeliveryDetails["AreaID"] && parseInt(DeliveryDetails["AreaID"]) === parseInt(item.area_id)
                          }
                        >
                          {item.area_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6 col-sm-12">
                  <label>
                    ZipCode <RequiredField />
                  </label>
                  <input
                    className="form-control"
                    name="DeliveryZipCode"
                    id="DeliveryZipCode"
                    defaultValue={
                      DeliveryDetails["DeliveryZipCode"]
                        ? DeliveryDetails["DeliveryZipCode"]
                        : ""
                    }
                    onChange={async (e) => {
                      DeliveryhandleChange(e);
                    }}
                  />
                  {CountrySelect === "226" && (
                    <small>
                      <span className="text-default">
                        {" "}
                        Valid ZipCode is required for shipping price calculation
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
                                    handleAreaChange(
                                      document.getElementById("d-area").value
                                    );
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
                    disabled={!AgreeTerms}
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
export default BangladeshDelivery;
