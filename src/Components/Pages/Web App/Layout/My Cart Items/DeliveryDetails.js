import PhoneInput from "react-phone-input-2";
import { useEffect, useState } from "react";
import { CountryCodes } from "../../../../../Helpers/CountryCodes";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../../Utils/Endpoint";
import { RequiredField } from "./../../../../../Utils/Required-field";
import moment from "moment";
import Icons from "./../../../../../Utils/Icons";
import { Spinner } from "reactstrap";
function PaymentDeliveryDetails({
  PaymentDetails,
  setPaymentDetails,
  Gateways,
  setPaymentMethod,
  setPaymentClient,
  PaymentClient,
  BanglaBazarPickUp,
  PickUpByUser,
  AllowAdminPickup,
  AllowStorePickup,
  setAllowAdminPickup,
  setAllowStorePickup,
  PaymentStates,
  PaymentCities,
  OverallCity,
  PathaoAccessToken,
  CountrySelect,
  CalculateShipping,
  setContinueButton,
  ContinueButton,
  PaymentType,
  setPaymentType,
  SameAsAbove,
  setSameAsAbove,
  DeliveryDetails,
  handleSameAsAbove,
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
    setStateList(PaymentStates);
    setCityList(PaymentCities);
  }, []);
  useEffect(async () => {
    setStateList(PaymentStates);
    setCityList(PaymentCities);
  }, [PaymentStates, PaymentCities]);
  let handleChange = ({ currentTarget: input }) => {
    var data = { ...PaymentDetails };
    if (input.name === "ExpirationDate") {
      data[input.name] = moment(input.value).format("MMYY");
    } else {
      data[input.name] = input.value;
    }
    setPaymentDetails(data);
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
    } catch (e) {
      console.log(e);
    }
  };
  var getCities = async (id) => {
    // try {
    //   var form = new URLSearchParams();
    //   form.append("CountryID", id);
    //   var response = await BanglaBazarApi.post(
    //     Endpoint + "/api/location/get-vendorAllowedCities",
    //     form
    //   );
    //   setCityList(response.data.Cities);
    // } catch (e) {
    //   console.log(e);
    // }
    try {
      var response = await BanglaBazarApi.post(
        Endpoint + "/api/pathao/get-pathao-cities",
        {
          token: PathaoAccessToken,
        }
      );
      setCityList(response.data.Cities);
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
  var handleCityChange = (e) => {
    var value = JSON.parse(e.target.value);
    var data = { ...PaymentDetails };
    data["DeliveryCity"] = value.city_name;
    data["DeliveryCityID"] = value.city_id;
    document.getElementById("d-area").selectedIndex = 0;
    document.getElementById("d-zone").selectedIndex = 0;
    getZones(value.city_id);
    setPaymentDetails(data);
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
    var data = { ...PaymentDetails };
    data["DeliveryZoneID"] = e.target.value;
    getAreas(e.target.value);
    setPaymentDetails(data);
  };
  var handleAreaChange = async (e) => {
    var data = { ...PaymentDetails };
    data["DeliveryAreaID"] = e.target.value;
    setPaymentDetails(data);
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
  return (
    <>
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
                SameAsAbove && DeliveryDetails["Name"]
                  ? DeliveryDetails["Name"]
                  : ""
              }
              onChange={handleChange}
            />
          </div>
          <div className="col-md-6 col-sm-12">
            <label>
              Phone Number <RequiredField />
            </label>
            <input
              className="form-control"
              onChange={handleChange}
              defaultValue={
                SameAsAbove && DeliveryDetails["cus_phone"]
                  ? DeliveryDetails["cus_phone"]
                  : ""
              }
              name="DeliveryPhoneNumber"
            />
            {/* <PhoneInput
              onlyCountries={countryCodes}
              country={"bd"}
              inputClass="adduser-phone"
              onChange={(phone) => {
                var data = { ...PaymentDetails };
                data["DeliveryPhoneNumber"] = "+" + phone;
                setPaymentDetails(data);
              }}
            /> */}
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12">
            <label>
              Address 1 <RequiredField />
              {PaymentDetails["DeliveryAddress1"] &&
                PaymentDetails["DeliveryAddress1"].length > 25 &&
                Icons.GreenTick}
            </label>
            <input
              className="form-control"
              name="DeliveryAddress1"
              defaultValue={
                SameAsAbove && DeliveryDetails["Address1"]
                  ? DeliveryDetails["Address1"]
                  : ""
              }
              onChange={handleChange}
            />
            {(CountrySelect === "16" || CountrySelect === 16) && (
              <small>
                <span className="text-default">
                  {" "}
                  {PaymentDetails["DeliveryAddress1"] &&
                    `${
                      PaymentDetails["DeliveryAddress1"].length < 26
                        ? `Address should be 25 character long (${
                            25 - PaymentDetails["DeliveryAddress1"].length
                          })`
                        : ""
                    }`}{" "}
                </span>
              </small>
            )}
          </div>
          <div className="col-12">
            <label>Address 2</label>
            <input
              className="form-control"
              name="DeliveryAddress2"
              defaultValue={
                SameAsAbove && DeliveryDetails["Address2"]
                  ? DeliveryDetails["Address2"]
                  : ""
              }
              onChange={handleChange}
            />
            {(CountrySelect === "16" || CountrySelect === 16) && (
              <small>
                <span className="text-default">
                  {" "}
                  {PaymentDetails["DeliveryAddress2"] &&
                    `${
                      PaymentDetails["DeliveryAddress2"].length < 26
                        ? `Address should be 25 character long (${
                            25 - PaymentDetails["DeliveryAddress2"].length
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
            <div className="col-md-6 col-sm-12">
              <label>
                City <RequiredField />
              </label>
              {CityList.length > 0 ? (
                <select
                  className="form-control"
                  type="text"
                  name="DeliveryCity"
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
              ) : (
                <input
                  className="form-control"
                  name="DeliveryCity"
                  onChange={(e) => handleChange(e)}
                />
              )}
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
                    handleAreaChange(e);
                    CalculateShipping();
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
                    var data = { ...PaymentDetails };
                    data["DeliveryState"] = JSON.parse(e.target.value).State;
                    setPaymentDetails(data);
                    getCitiesByState(JSON.parse(e.target.value).StateID);
                  }}
                  name="DeliveryState"
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
                  name="DeliveryState"
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
                  name="DeliveryCity"
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
                  name="DeliveryCity"
                  onChange={(e) => handleChange(e)}
                />
              )}
            </div>
          </div>
        )}

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
                SameAsAbove && DeliveryDetails["ZipCode"]
                  ? DeliveryDetails["ZipCode"]
                  : ""
              }
              onChange={async (e) => {
                await handleChange(e);
                await CalculateShipping();
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
            <label>Desired Delivery Date</label>
            <input
              className="form-control"
              type="date"
              name="DesireDeliveryDate"
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-md-6 col-sm-12">
            <label>Delivery Note</label>
            <textarea
              className="form-control"
              name="DeliveryUserNote"
              onChange={handleChange}
            />
          </div>
        </div>
      </form>
      <div className="row">
        {/* <div className="col-md-6 col-sm-12">
          {BanglaBazarPickUp && (
            <form>
              <div className="row w-100 mt-2">
                <label>BanglaBazar Delivery</label>
                <div className="col-12 row">
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
          )}
        </div> */}
        <div className="col-md-6 col-sm-12">
          {PickUpByUser &&
            PaymentDetails.DeliveryCity &&
            PaymentDetails.DeliveryCity === OverallCity && (
              <form>
                <div className="row w-100 mt-2">
                  <label>Pickup</label>
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

      {/* AllowAdminPickup,
  AllowStorePickup,
  setAllowAdminPickup,
  setAllowStorePickup, */}
    </>
  );
}
export default PaymentDeliveryDetails;
