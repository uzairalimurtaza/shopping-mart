import PhoneInput from "react-phone-input-2";
import { useEffect, useState } from "react";
import { CountryCodes } from "../../../../../Helpers/CountryCodes";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../../Utils/Endpoint";
import { RequiredField } from "./../../../../../Utils/Required-field";
import moment from "moment";
import axios from "axios";
import Icons from "./../../../../../Utils/Icons";
import { Spinner } from "reactstrap";
import { Link } from "react-router-dom";
function UserOrderPaymentDetails({
  DeliveryDetails,
  setDeliveryDetails,
  Gateways,
  setPaymentMethod,
  setPaymentClient,
  PaymentClient,
  // BanglaBazarPickUp,
  // PickUpByUser,
  // AllowAdminPickup,
  // AllowStorePickup,
  // setAllowAdminPickup,
  // setAllowStorePickup,
  setPaymentStates,
  setPaymentCities,
  CountrySelect,
  setCountrySelect,
  PathaoAccessToken,
  PaymentType,
  setPaymentType,
  setContinueButton,
  ContinueButton,
  LastPaymentDetail,
  selectPayment,
  ShowPrevPayment,
  setShowPrevPayment,
}) {
  const [countryCodes, setCountryCodes] = useState([]);
  const [CountryList, setCountryList] = useState([]);
  const [StateList, setStateList] = useState([]);
  const [CityList, setCityList] = useState([]);
  const [ZoneList, setZoneList] = useState([]);
  const [AreaList, setAreaList] = useState([]);
  const [ZoneLoading, setZoneLoading] = useState(false);
  const [AreaLoading, setAreaLoading] = useState(false);
  useEffect(async () => {
    var temp = await CountryCodes();
    setCountryCodes(temp);
    getCountries();
  }, []);
  let handleChange = ({ currentTarget: input }) => {
    var data = { ...DeliveryDetails };
    if (input.name === "ExpirationDate") {
      data[input.name] = moment(input.value).format("MMYY");
    } else {
      data[input.name] = input.value;
    }
    setDeliveryDetails(data);
  };
  var handleCityChange = (e) => {
    var value = JSON.parse(e.target.value);
    var data = { ...DeliveryDetails };
    data["City"] = value.city_name;
    data["CityId"] = value.city_id;
    document.getElementById("p-area").selectedIndex = 0;
    document.getElementById("p-zone").selectedIndex = 0;
    getZones(value.city_id);
    setDeliveryDetails(data);
  };
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
      var form = new URLSearchParams();
      form.append("CountryID", id);
      var response = await BanglaBazarApi.post(
        Endpoint + "/api/location/get-vendorAllowedStates",
        form
      );
      setStateList(response.data.States);
      setPaymentStates(response.data.States);
    } catch (e) {
      console.log(e);
    }
  };
  var getCitiesByState = async (id) => {
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + `/api/location/get-cities/${id}`
      );
      setCityList(response.data.Cities);
      setPaymentCities(response.data.Cities);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    if (CountrySelect) getCities(CountrySelect);
  }, [ShowPrevPayment, CountrySelect]);
  var getCities = async (id) => {
    // try {
    //   var form = new URLSearchParams();
    //   form.append("CountryID", id);
    //   var response = await BanglaBazarApi.post(
    //     Endpoint + "/api/location/get-vendorAllowedCities",
    //     form
    //   );
    //   setCityList(response.data.Cities);
    //   setPaymentCities(response.data.Cities);
    // } catch (e) {
    //   console.log(e);
    // }
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
    console.log(selectedCountry);

    for (let j = 0; j < Gateways.length; j++) {
      if (
        parseInt(selectedCountry.GatewayID) === parseInt(Gateways[j].GatewayID)
      ) {
        console.log("LMAO XD");
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
  var handleZoneChange = async (e) => {
    var data = { ...DeliveryDetails };
    data["ZoneId"] = e.target.value;
    getAreas(e.target.value);
    setDeliveryDetails(data);
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
      setAreaLoading(false);
      console.log(e);
    }
  };
  return (
    <>
      {ShowPrevPayment && LastPaymentDetail.length > 0 && (
        <>
          <div
            className="p-3 table-responsive mt-5"
            style={{ border: "1px solid #c7c7c7" }}
          >
            <h5 className="text-default">Payment Information</h5>
            <div className="card">
              <div className="card-body">
                {LastPaymentDetail.map((payee, index) => (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div>
                        {" "}
                        <input
                          type="checkbox"
                          onChange={(e) =>
                            selectPayment(index, e.target.checked)
                          }
                          className="form-check-input default-check-color"
                        />{" "}
                      </div>
                      <div style={{ paddingLeft: "10px", fontSize: "15px" }}>
                        {" "}
                        {payee.PaymentSuccessResponse &&
                          JSON.parse(payee.PaymentSuccessResponse).card_no}
                      </div>
                    </div>
                    <div style={{ paddingLeft: "10px", fontSize: "15px" }}>
                      {" "}
                      <span className="text-default">
                        {payee.PaymentSuccessResponse.PaymentType === "card"
                          ? "Credit/Debit"
                          : "Cash on delivery"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2" style={{ float: "right" }}>
              <Link
                to="#"
                className="text-default td-none"
                onClick={() => {
                  setShowPrevPayment(false);
                  setDeliveryDetails({});
                }}
              >
                <i className="fal fa-plus"></i> Add New
              </Link>
            </div>
          </div>
        </>
      )}

      {!ContinueButton ? (
        <>
          {!ShowPrevPayment && (
            <>
              <h3 className="text-default mt-5 mb-3">
                {" "}
                Choose billing country
              </h3>
              <div className="row">
                <div className="col-7 ">
                  {/* <label>
                Country <RequiredField />
              </label> */}
                  <select
                    className="form-control"
                    onChange={(e) => {
                      handleChange(e);
                      getStates(e.target.value);
                      getCities(e.target.value);
                      setPayment(e.target.value);
                      setCountrySelect(e.target.value);
                    }}
                    name="CountryID"
                  >
                    <option>Select...</option>
                    {CountryList.map((item, index) => (
                      <option value={item.CountryID} key={index}>
                        {item.Country}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
          <h3 className="text-default mt-5 mb-3"> Payment Method</h3>
          <div className="row">
            <div className="col-7 ">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input default-check-color"
                    type="radio"
                    id="inlineCheckbox34"
                    name="inlineCheckbox34"
                    defaultChecked={PaymentType === "card"}
                    onChange={() => setPaymentType("card")}
                  />
                  <label className="form-check-label" for="inlineCheckbox3">
                    Credit/Debit Card
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="form-check-input default-check-color"
                    type="radio"
                    id="inlineCheckbox34"
                    name="inlineCheckbox34"
                    defaultChecked={PaymentType === "cod"}
                    onChange={() => setPaymentType("cod")}
                  />
                  <label className="form-check-label" for="inlineCheckbox3">
                    Cash on delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12">
              <div style={{ float: "right" }}>
                <button
                  className="btn btn-default"
                  disabled={!CountrySelect}
                  onClick={() => {
                    setContinueButton(!ContinueButton);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    setShowPrevPayment(false);
                  }}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <form>
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <label>
                  Full Name <RequiredField />
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
                  Phone Number <RequiredField />
                </label>
                <input
                  // onlyCountries={countryCodes}
                  // country={"bd"}
                  // inputClass="adduser-phone"
                  defaultValue={
                    DeliveryDetails["cus_phone"]
                      ? DeliveryDetails["cus_phone"]
                      : ""
                  }
                  className="form-control"
                  onChange={(e) => {
                    var data = { ...DeliveryDetails };
                    data["cus_phone"] = e.target.value;
                    setDeliveryDetails(data);
                  }}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <label>
                  Email <RequiredField />
                </label>
                <input
                  className="form-control"
                  placeholder="Enter your email"
                  type="email"
                  defaultValue={
                    DeliveryDetails["cus_email"]
                      ? DeliveryDetails["cus_email"]
                      : ""
                  }
                  name="cus_email"
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-md-6 col-sm-12">
                <label>Fax Number</label>
                <input
                  className="form-control"
                  placeholder="Enter your fax number"
                  name="cus_fax"
                  onChange={handleChange}
                />
              </div> */}
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
                {(CountrySelect === "16" || CountrySelect === 16) && (
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
                )}
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
                {(CountrySelect === "16" || CountrySelect === 16) && (
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
                )}
              </div>
            </div>

            {CountrySelect === "16" || CountrySelect === 16 ? (
              <div className="row mt-2">
                {/* <div className="col-md-6 col-sm-12">
                  <label>State</label>

                  <select
                    className="form-control"
                    onChange={(e) => {
                      var data = { ...DeliveryDetails };
                      data["State"] = JSON.parse(e.target.value).State;
                      setDeliveryDetails(data);
                      getCitiesByState(JSON.parse(e.target.value).StateID);
                    }}
                    name="State"
                  >
                    <option>Select...</option>
                    {StateList.map((item, index) => (
                      <option value={JSON.stringify(item)} key={index}>
                        {item.State}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="col-md-6 col-sm-12">
                  <label>City</label>

                  <select
                    className="form-control"
                    type="text"
                    name="City"
                    placeholder="Enter City"
                    onChange={(e) => {
                      handleCityChange(e);
                    }}
                  >
                    <option>Select City</option>
                    {CityList.map((item, index) => (
                      <option key={index} value={JSON.stringify(item)}>
                        {item.city_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>Zones</label>

                  {ZoneLoading ? (
                    <div className="text-center">
                      <Spinner size={"sm"} color="default" /> Getting zones ...
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      type="text"
                      name="Zones"
                      id="p-zone"
                      placeholder="Enter Zone"
                      onChange={(e) => {
                        handleZoneChange(e);
                      }}
                    >
                      <option>Select City</option>
                      {ZoneList.length > 0 &&
                        ZoneList.map((item, index) => (
                          <option key={index} value={item.zone_id}>
                            {item.zone_name}
                          </option>
                        ))}
                    </select>
                  )}
                </div>
                <div className="col-md-6 col-sm-12 mt-2">
                  <label>Area</label>
                  {AreaLoading ? (
                    <div className="text-center">
                      <Spinner size={"sm"} color="default" /> Getting areas ...
                    </div>
                  ) : (
                    <select
                      className="form-control"
                      type="text"
                      name="AreaId"
                      id="p-area"
                      placeholder="Select Area"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      <option>Select City</option>
                      {AreaList.map((item, index) => (
                        <option key={index} value={item.area_id}>
                          {item.area_name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            ) : (
              <div className="row mt-2">
                <div className="col-md-6 col-sm-12">
                  <label>State</label>
                  {StateList.length > 0 ? (
                    <select
                      className="form-control"
                      onChange={(e) => {
                        var data = { ...DeliveryDetails };
                        data["State"] = JSON.parse(e.target.value).State;
                        setDeliveryDetails(data);
                        getCitiesByState(JSON.parse(e.target.value).StateID);
                      }}
                      name="State"
                    >
                      <option>Select...</option>
                      {StateList.map((item, index) => (
                        <option value={JSON.stringify(item)} key={index}>
                          {item.State}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="form-control"
                      name="State"
                      onChange={(e) => handleChange(e)}
                    />
                  )}
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>City</label>
                  {CityList.length > 0 ? (
                    <select
                      className="form-control"
                      type="text"
                      name="City"
                      placeholder="Enter City"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    >
                      <option>Select City</option>
                      {CityList.map((item, index) => (
                        <option key={index} value={item.City}>
                          {item.City}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="form-control"
                      name="City"
                      onChange={(e) => handleChange(e)}
                    />
                  )}
                </div>
              </div>
            )}
            {/*
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <label>State</label>
                {StateList.length > 0 ? (
                  <select
                    className="form-control"
                    onChange={(e) => {
                      var data = { ...DeliveryDetails };
                      data["State"] = JSON.parse(e.target.value).State;
                      setDeliveryDetails(data);
                      getCitiesByState(JSON.parse(e.target.value).StateID);
                    }}
                    name="State"
                  >
                    <option>Select...</option>
                    {StateList.map((item, index) => (
                      <option value={JSON.stringify(item)} key={index}>
                        {item.State}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="form-control"
                    name="State"
                    onChange={(e) => handleChange(e)}
                  />
                )}
              </div>
              <div className="col-md-6 col-sm-12">
                <label>City</label>
                {CityList.length > 0 ? (
                  <select
                    className="form-control"
                    type="text"
                    name="City"
                    placeholder="Enter City"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <option>Select City</option>
                    {CityList.map((item, index) => (
                      <option key={index} value={item.City}>
                        {item.City}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="form-control"
                    name="City"
                    onChange={(e) => handleChange(e)}
                  />
                )}
              </div>
            </div>
        */}
            <div className="row mt-2">
              <div className="col-md-6 col-sm-12">
                <label>ZipCode</label>
                <input
                  className="form-control"
                  name="ZipCode"
                  defaultValue={
                    DeliveryDetails["ZipCode"] ? DeliveryDetails["ZipCode"] : ""
                  }
                  onChange={handleChange}
                />
              </div>
              {/* <div className="col-md-6 col-sm-12">
                <label>Note</label>
                <textarea
                  className="form-control"
                  name="UserNote"
                  onChange={handleChange}
                />
              </div> */}
            </div>
            {/* <div className="row mt-2">
          <div className="col-md-6 col-sm-12">
            <label>Desire Date</label>
            <input className="form-control" type="date" />
          </div>
        </div> */}
            {/* <div className="row mt-2">
          <div className="col-8">
            <label>Order Details</label>
            <textarea className="form-control" rows={5} />
          </div>
        </div> */}
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
          {PaymentType === "card" && PaymentClient === "auth" && (
            <form>
              <div className="row mt-2">
                <div className="col-md-6 col-sm-12">
                  <label>
                    Card Number <RequiredField />
                  </label>
                  <input
                    className="form-control"
                    placeholder="Enter your name"
                    name="CardNumber"
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <label>
                    Expiry Date <RequiredField />
                  </label>
                  <input
                    className="form-control"
                    type="date"
                    onChange={handleChange}
                    name="ExpirationDate"
                  />
                </div>
              </div>

              <div className="row mt-2">
                <div className="col-md-6 col-sm-12">
                  <label>
                    CVV <RequiredField />
                  </label>
                  <input
                    className="form-control"
                    type="text"
                    onChange={handleChange}
                    name="cvv"
                  />
                </div>
                <div className="col-md-6 col-sm-12">
                  <div>
                    <label className="text-white"> check </label>
                  </div>
                  <label>
                    {" "}
                    <input
                      type="checkbox"
                      className="form-check-input default-check-color"
                    />{" "}
                    Same Card
                  </label>
                  <p>
                    I acknowledge that my card information is saved in my
                    BanglaBazar account for subsequent transactions.
                  </p>
                </div>
              </div>
            </form>
          )}
        </>
      )}

      {/* {BanglaBazarPickUp && (
        <form>
          <div className="row w-100 mt-2">
            <label>BanglaBazar Delivery</label>
            <div className="col-8 row">
              <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                <div className="form-check form-check-inline">
                  <input
                    type="radio"
                    className="cs-bi-radios-input"
                    name="activefield"
                    checked={AllowAdminPickup === "Y"}
                    onChange={() => {
                      setAllowAdminPickup("Y");
                      setAllowStorePickup("N");
                    }}
                  />
                  <label className="form-check-label" for="inlineCheckbox3">
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
                    checked={AllowAdminPickup === "N"}
                    onChange={() => {
                      setAllowAdminPickup("N");
                    }}
                  />
                  <label className="form-check-label" for="inlineCheckbox3">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      )} */}
      {/* AllowAdminPickup,
  AllowStorePickup,
  setAllowAdminPickup,
  setAllowStorePickup, */}
      {/* {PickUpByUser && (
        <form>
          <div className="row w-100 mt-2">
            <label>Pickup</label>
            <div className="col-8 row">
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
                    }}
                  />
                  <label className="form-check-label" for="inlineCheckbox3">
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
                      // setAllowAdminPickup("N");
                    }}
                  />
                  <label className="form-check-label" for="inlineCheckbox3">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </form>
      )} */}
    </>
  );
}
export default UserOrderPaymentDetails;
