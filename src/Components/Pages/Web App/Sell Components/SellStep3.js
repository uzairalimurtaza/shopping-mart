import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import ReactFlagsSelect from "react-flags-select";
import { useContext, useEffect } from "react";
import VendorRegistrationContext from "./../../../Contexts/VendorRegistrationContext";
import { BusinessPhoneVerificationModal } from "./BusinessPhoneVerificationModal";
import BusinessEmailVerificationModal from "./BusinessEmailVerificationModal";
import { Link } from "react-router-dom";
import { RequiredField } from "./../../../../Utils/Required-field";
import CreatableSelect from "react-select/creatable";
import firetoast from "./../../../../Helpers/FireToast";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import axios from "axios";
import Endpoint from "./../../../../Utils/Endpoint";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
function SellStep3(props) {
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [emailModal, setEmailModal] = useState(false);

  var {
    setStoreName,
    StoreName,
    setStoreAddress1,
    setStoreAddress2,
    setStoreEmail,
    setStorePhone,
    setStoreFAX,
    setStoreURL,
    setActive,
    CountryList,
    StorePhone,
    StateList,
    StoreEmail,
    setStoreCountryID,
    setStoreState,
    setStoreCityID,
    CityID,
    setStoreCity,
    CityList,
    Active,
    StoreAddress2,
    StoreZipCode,
    setStoreZipCode,
    StorePhoneVerified,
    setStorePhoneVerified,
    StoreEmailVerified,
    StoreAddress1,
    setStoreEmailVerified,
    StoreCityID,
    StoreCity,
    StoreStateID,
    setStoreStateID,
    StoreState,
    StoreCountryID,
    StoreFAX,
    CountryID,
    StoreURL,
    BusinessEmail,
    StoreStateId,
    setStoreStateId,
    PathaoToken,
    zone_id,
    setZone_id,
    area_id,
    setArea_id,
  } = useContext(VendorRegistrationContext);
  const [emailChange, setEmailChange] = useState(false);
  const [selectedCity, setselectedCity] = useState(null);
  const [selectedState, setselectedState] = useState(null);
  const [CountryCode, setCountryCode] = useState([]);
  const [StoreCityList, setStoreCityList] = useState(CityList);
  const [PathaoCities, setPathaoCities] = useState([]);
  const [ZoneList, setZoneList] = useState([]);
  const [AreaList, setAreaList] = useState([]);

  useEffect(async () => {
    setCountryCode(await CountryCodes());
    if (CountryID === 16) {
      getPathaoCities();
    }
  }, []);
  var getCitiesByState = async (id) => {
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + `/api/location/get-cities/${id}`
      );
      setStoreCityList(response.data.Cities);
    } catch (e) {
      console.log(e);
    }
  };
  var getPathaoCities = async () => {
    var response = await BanglaBazarApi.post(
      Endpoint + "/api/pathao/get-pathao-cities",
      { token: PathaoToken }
    );
    setPathaoCities(response.data.cities);
  };
  var getZones = async (item) => {
    console.log(item);
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/get-pathao-zone`,
        {
          token: PathaoToken,
          city_id: item.PathaoCityID,
        }
      );
      setZoneList(response.data.zones);
    } catch (e) {
      console.log(e);
    }
  };
  var getAreas = async (item) => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/pathao/get-pathao-area`,
        {
          token: PathaoToken,
          zone_id: item.zone_id,
        }
      );
      setAreaList(response.data.areas);
    } catch (e) {
      console.log(e);
    }
  };
  // var createState = async (e) => {
  //   var { value, label } = e;
  //   if (CheckEmpty(CountryID)) {
  //     return firetoast(
  //       "Please Select Country first in order to create State",
  //       "error",
  //       3000,
  //       "top-right"
  //     );
  //   } else {
  //     var form = new URLSearchParams();

  //     form.append("CountryID", CountryID);
  //     form.append("StateName", label);
  //     var response = await axios.post(
  //       `${Endpoint}/api/location/add-newState`,
  //       form
  //     );
  //     return response.data.StateID;
  //   }
  // };
  // var createCity = async (e) => {
  //   var { value, label } = e;
  //   if (CheckEmpty(CountryID)) {
  //     return firetoast(
  //       "Please Select Country first in order to create city",
  //       "error",
  //       3000,
  //       "top-right"
  //     );
  //   }
  //   if (CheckEmpty(StateId)) {
  //     return firetoast(
  //       "Please Select State first in order to create city",
  //       "error",
  //       3000,
  //       "top-right"
  //     );
  //   }
  //   var form = new URLSearchParams();
  //   form.append("StateID", StateId);
  //   form.append("CountryID", CountryID);
  //   form.append("City", label);
  //   var response = await axios.post(
  //     `${Endpoint}/api/location/add-newCity`,
  //     form
  //   );
  //   return response.data.CityID;
  // };
  return (
    <>
      <div className="mt-3">
        <h4 className="ftw-400">Store Info</h4>
        <div className="mb-5">
          <div className="row">
            {/* <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <input className="form-control" type="text" />
            </div> */}
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Store Name <RequiredField />
              </label>
              <input
                className="form-control"
                defaultValue={StoreName}
                type="text"
                onChange={(e) => {
                  setStoreName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Store Email <RequiredField />
              </label>
              <input
                className="form-control"
                defaultValue={StoreEmail}
                type="email"
                onChange={(e) => {
                  if (BusinessEmail === e.target.value) {
                    setStoreEmailVerified(true);
                    setEmailChange(false);
                    setStoreEmail(e.target.value);
                  } else {
                    setEmailChange(true);
                    setStoreEmail(e.target.value);
                  }
                }}
              />
              {!StoreEmailVerified && emailChange && (
                <>
                  <Link
                    to="#"
                    className="text-default mt-2"
                    onClick={() => setEmailModal(!emailModal)}
                  >
                    Verify
                  </Link>{" "}
                  your Email Address
                </>
              )}
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Store Phone <RequiredField /></label>
              {CountryCode.length > 0 && (
                <PhoneInput
                  value={StorePhone}
                  country={"bd"}
                  onlyCountries={CountryCode}
                  inputClass="adduser-phone"
                  isValid={(value, country) => {
                    if (value.startsWith(country.countryCode)) {
                      return true;
                    } else {
                      return false;
                    }
                  }}
                  onChange={(e) => setStorePhone(e)}
                />
              )}
              {/* <PhoneInput
                value={StorePhone}
                country={"bd"}
                onlyCountries={CountryCode}
                inputClass="adduser-phone"
                isValid={(value, country) => {
                  if (value.startsWith(country.countryCode)) {
                    return true;
                  } else {
                    return false;
                  }
                }}
                onChange={(e) => setStorePhone("+" + e)}
              /> */}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Address 1 <RequiredField /></label>
              <input
                className="form-control"
                type="text"
                defaultValue={StoreAddress1}
                onChange={(e) => setStoreAddress1(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Address 2</label>
              <input
                className="form-control"
                type="text"
                defaultValue={StoreAddress2}
                onChange={(e) => setStoreAddress2(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Country <RequiredField />
              </label>
              <select
                onChange={(e) => setStoreCountryID(e.target.value)}
                className="form-control"
              >
                <option>Select</option>
                {CountryList &&
                  CountryList.map((item, index) => (
                    <option
                      value={item.CountryID}
                      key={index}
                      disabled
                      selected={CountryID === item.CountryID}
                    >
                      {" "}
                      {item.Country}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {CountryID === 16 ? (
            <>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>City <RequiredField /></label>

                  <select
                    className="form-control"
                    onChange={(e) => {
                      if(e.target.value ==="select"){
                        return e.preventDefault()
                      }
                      var item = JSON.parse(e.target.value);
                      setStoreCity(item.PathaoCityName);
                      setStoreCityID(item.DBCityID);
                      getZones(item);
                    }}
                  >
                    <option value="select">Select...</option>
                    {PathaoCities &&
                      PathaoCities.map((item, index) => (
                        <option value={JSON.stringify(item)} key={index}>
                          {item.PathaoCityName}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Zones <RequiredField /></label>

                  <select
                    className="form-control"
                    type="text"
                    placeholder="Enter City"
                    onChange={(e) => {
                      if(e.target.value ==="select"){
                        return e.preventDefault()
                      }
                      var item = JSON.parse(e.target.value);
                      getAreas(item);
                      setZone_id(item.zone_id);
                    }}
                  >
                    <option value="select">Select Zone</option>
                    {ZoneList &&
                      ZoneList.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>
                          {item.zone_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Areas <RequiredField /></label>

                  <select
                    className="form-control"
                    type="text"
                    placeholder="Enter City"
                    onChange={(e) => {
                      if(e.target.value ==="select"){
                        return e.preventDefault()
                      }
                      var item = JSON.parse(e.target.value);
                      setArea_id(item.area_id);
                    }}
                  >
                    <option value="select">Select Areas</option>
                    {AreaList &&
                      AreaList.map((item, index) => (
                        <option key={index} value={JSON.stringify(item)}>
                          {item.area_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>ZipCode <RequiredField /></label>
                  <input
                    className="form-control"
                    type="text"
                    value={StoreZipCode}
                    onChange={(e) => setStoreZipCode(e.target.value)}
                    placeholder="Enter Zipcode"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>State / District /Province</label>
                  {/* <CreatableSelect
                isClearable
                onChange={(e) => {
                  if (e) {
                    if (e.__isNew__) {
                      setStoreState(e.label);
                    } else {
                      setStoreState(e.label);
                      // setStoreStateId(e.value);
                      // setselectedState(e);
                    }
                  } else {
                    setStoreState("");
                    // setStoreStateId("");
                    // setselectedState(null);
                  }
                }}
                // onInputChange={(e) => console.log(e)}
                options={StateList}
              /> */}
                  {StateList.length > 0 ? (
                    <select
                      className="form-control"
                      onChange={(e) => {
                        setStoreState(JSON.parse(e.target.value).State);
                        getCitiesByState(JSON.parse(e.target.value).StateID);
                      }}
                    >
                      <option>Select...</option>
                      {StateList &&
                        StateList.map((item, index) => (
                          <option
                            value={JSON.stringify(item)}
                            key={index}
                            selected={StoreState === item.State}
                          >
                            {item.State}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      className="form-control"
                      defaultValue={StoreState}
                      onChange={(e) => setStoreState(e.target.value)}
                    />
                  )}
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>City</label>
                  {/* <CreatableSelect
                isClearable
                onChange={(e) => {
                  if (e) {
                    if (e.__isNew__) {
                      setStoreCity(e.label);
                    } else {
                      setStoreCity(e.label);
                      setStoreCityID(e.value);
                      // setselectedCity(e);
                    }
                  } else {
                    setStoreCity("");
                    setStoreCityID("");
                    // setselectedCity(null);
                  }
                }}
                // onInputChange={(e) => console.log(e)}
                options={CityList}
              /> */}
                  {StoreCityList.length > 0 ? (
                    <select
                      className="form-control"
                      type="text"
                      placeholder="Enter City"
                      onChange={(e) => {
                        var item = JSON.parse(e.target.value);
                        setStoreCity(item.City);
                        setStoreCityID(item.CityID);
                      }}
                    >
                      <option>Select City</option>
                      {StoreCityList &&
                        StoreCityList.map((item, index) => (
                          <option
                            key={index}
                            value={JSON.stringify(item)}
                            selected={StoreCity === item.City}
                          >
                            {item.City}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <input
                      className="form-control"
                      defaultValue={StoreCity}
                      onChange={(e) => setStoreCity(e.target.value)}
                    />
                  )}
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>ZipCode</label>
                  <input
                    className="form-control"
                    type="text"
                    value={StoreZipCode}
                    onChange={(e) => setStoreZipCode(e.target.value)}
                    placeholder="Enter Zipcode"
                  />
                </div>
              </div>
            </>
          )}

          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Store Fax <small>(optional)</small></label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Store Fax"
                defaultValue={StoreFAX}
                onChange={(e) => setStoreFAX(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Store URL <small>(optional)</small>
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={StoreURL}
                onChange={(e) => setStoreURL(e.target.value)}
              />
            </div>
          </div>
          {/* <div className="row mt-4">
            <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12">
              <label>Active</label>
              <div className="d-flex" style={{ alignItems: "end" }}>
                <div className="cs-bi-radios">
                  <label>
                    <input
                      type="radio"
                      className="cs-bi-radios-input"
                      name="active"
                      defaultChecked={Active === "Y"}
                      onChange={() => setActive("Y")}
                    />{" "}
                    Yes
                  </label>
                </div>
                <div className="cs-bi-radios">
                  <label>
                    <input
                      type="radio"
                      className="cs-bi-radios-input"
                      name="active"
                      defaultChecked={Active === "N"}
                      onChange={() => setActive("N")}
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="row mt-4">
            <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12">
              <label>Admin Note</label>
              <textarea className="form-control" rows={"5"} />
            </div>
          </div> */}
          {/* <BusinessPhoneVerificationModal
            phoneVerify={phoneVerify}
            setPhoneVerify={setPhoneVerify}
            phoneToBeVerified={setStorePhone}
            setPhoneStatus={setStorePhoneVerified}
          /> */}
          <BusinessEmailVerificationModal
            emailVerify={emailModal}
            setEmailVerify={setEmailModal}
            setEmailVerified={setStoreEmailVerified}
            status="2"
          />
        </div>
      </div>
    </>
  );
}
export default SellStep3;