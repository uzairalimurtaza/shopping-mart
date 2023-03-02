import { useState, useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import axios from "axios";
import Endpoint from "./../../../../Utils/Endpoint";
import firetoast from "./../../../../Helpers/FireToast";
import PhoneInput from "react-phone-input-2";
import Loading from "./../../../../Utils/Loading";
import { CurrentUser } from "./../../../../Helpers/Auth";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import BusinessEmailVerificationModal from "./../../Web App/Sell Components/BusinessEmailVerificationModal";
import { RequiredField } from "./../../../../Utils/Required-field";
import CreatableSelect from "react-select/creatable";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";

function UpdateSingleStore() {
  const history = useHistory();
  const { index, id, businessEmail } = useParams();
  const [CityList, setCityList] = useState([]);
  const [StateList, setStateList] = useState([]);
  const [CountryList, setCountryList] = useState([]);
  const [store, setStore] = useState([]);
  const [StoreName, setStoreName] = useState(null);
  const [StoreAddress1, setStoreAddress1] = useState(null);
  const [StoreAddress2, setStoreAddress2] = useState(null);
  const [StoreEmail, setStoreEmail] = useState("");
  const [StorePhone, setStorePhone] = useState(null);
  const [StoreFAX, setStoreFAX] = useState(null);
  const [StoreZipCode, setStoreZipCode] = useState(null);
  const [StoreURL, setStoreURL] = useState(null);
  const [Active, setActive] = useState("");
  const [StoreCountryID, setStoreCountryID] = useState(null);
  const [StoreCityID, setStoreCityID] = useState(null);
  const [StoreCity, setStoreCity] = useState(null);
  const [StoreState, setStoreState] = useState(null);
  const [GoogleMapID, setGoogleMapID] = useState("");
  const [disable, setDisable] = useState(false);
  const [AdminNote, setAdminNote] = useState("");
  const [StoreAdminNote, setStoreAdminNote] = useState("");
  const [ExceptDropOff, setExceptDropOff] = useState("");
  const [modal, setModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailChange, setEmailChange] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [StoreEmailVerified, setStoreEmailVerified] = useState(false);
  const [StorePhoneVerified, setStorePhoneVerified] = useState(false);
  const [VendorStoreID, setVendorStoreID] = useState("");
  const [prevEmail, setPrevEmail] = useState("");
  const [CountryCode, setCountryCode] = useState([]);
  useEffect(async () => {
    getAllStores();
    getCountries();
    setCountryCode(await CountryCodes());
  }, []);
  var getAllStores = async () => {
    try {
      var response = await axios.get(
        Endpoint + `/api/store-management/store-detail/${index}`
      );
      var {
        StoreName,
        StoreEmail,
        StorePhone,
        Address1,
        Address2,
        CountryID,
        ZipCode,
        State,
        CityID,
        StoreFAX,
        StoreURL,
        City,
        AdminNote,
        GoogleMapID,
        VendorStoreID,
        ExceptDropOff,
        Active,
      } = response.data.Store[0];

      setExceptDropOff(ExceptDropOff);
      setActive(Active);
      setStoreName(StoreName);
      setStoreEmail(StoreEmail);
      setPrevEmail(StoreEmail);
      setVendorStoreID(VendorStoreID);
      setStorePhone(StorePhone);
      setStoreAddress1(Address1);
      setStoreAddress2(Address2);
      setStoreCountryID(CountryID);
      setStoreZipCode(ZipCode);
      setStoreState(State);
      setStoreCityID(CityID);
      setStoreFAX(StoreFAX);
      setStoreURL(StoreURL);
      setStoreCity(City);
      setGoogleMapID(GoogleMapID);
      setStoreAdminNote(AdminNote);
      setStore(response.data.Store);
      getStates(CountryID);
      getCities(CountryID);
    } catch (e) {
      console.log(e);
      firetoast("Something went wrong!!", "error", 4000, "top-right");
    }
  };
  var getCities = async (id) => {
    try {
      var form = new URLSearchParams();
      form.append("CountryID", id);
      var response = await BanglaBazarApi.post(
        Endpoint + "/api/location/get-vendorAllowedCities",
        form
      );
      setCityList(response.data.Cities);
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
  var validateStep2Fields = () => {
    var errors = [];

    if (CheckEmpty(StoreName)) {
      errors.push("Please provide store name");
    }
    if (CheckEmpty(StoreEmail)) {
      errors.push("Please provide store email");
    }
    // if (CheckEmpty(StorePhone)) {
    //   errors.push("Please provide store phone");
    // }
    // if (CheckEmpty(StoreAddress1)) {
    //   errors.push("Please provide store address # 1");
    // }
    if (CheckEmpty(StoreCountryID)) {
      errors.push("Please select the country");
    }

    // if (CheckEmpty(StoreZipCode)) {
    //   errors.push("Please provide zip code");
    // }
    // if (CheckEmpty(StoreState)) {
    //   errors.push("Store state is not selected");
    // }
    // if (CheckEmpty(StoreCity)) {
    //   errors.push("Store city is not selected");
    // }
    // if (CheckEmpty(StoreFAX)) {
    //   errors.push("Enter store fax ");
    // }
    // if (CheckEmpty(StoreURL)) {
    //   errors.push("Enter store url ");
    // }
    if (errors.length > 0) {
      return [true, errors];
    } else {
      return [false, errors];
    }
  };
  var submitFormYesPickUp = async () => {
    var [error2, errors2] = validateStep2Fields();

    if (error2) {
      for (let i = 0; i < errors2.length; i++) {
        firetoast(errors2[i], "error", 3000, "top-right");
      }
      return;
    } else {
      var data = {
        AdminNote: StoreAdminNote,
        VendorID: id,
        StoreName,
        Address1: StoreAddress1,
        Address2: StoreAddress2,
        CityID: StoreCityID,
        City: StoreCity,
        State: StoreState,
        ZipCode: StoreZipCode,
        CountryID: StoreCountryID,
        StoreEmail,
        StorePhone,
        StoreFAX,
        StoreURL,
        GoogleMapID,
        Active,
        ExceptDropOff,
        VendorStoreID,
        PhoneVerified: "Y",
        EmailVerified: "Y",
      };

      var resp_ = await submitStoreDetails(data);
      if (resp_) {
        firetoast("Updated Successfully", "success", 3000, "top-right");
      }
    }
  };
  var submitStoreDetails = async (data) => {
    try {
      var form = new URLSearchParams();
      for (var key in data) {
        form.append(key, data[key]);
      }
      var response = await axios.put(
        Endpoint + `/api/store-management/update-store/${id}`,
        form
      );
      if (response.data.status) {
        return true;
      } else {
        return firetoast(response.data.message, "error", 3000, "top-center");
      }
    } catch (e) {
      console.log(e);
      return firetoast("Something went wrong", "error", 5000, "top-right");
    }
  };
  return (
    <>
      <div>
        {isLoading ? (
          <Loading text="Please Wait" />
        ) : (
          <>
            <div className="mt-4">
              <h4 className="mb-4">
                <span
                  onClick={() => history.push(`/panel/storeManagement`)}
                  style={{ cursor: "pointer" }}
                >
                  <i className="fas fa-chevron-left"></i>
                </span>{" "}
                Update Store Information
              </h4>
              <div className="card cstore-card">
                <div className="card-body mb-5">
                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>
                        Store Name <RequiredField />
                      </label>
                      <input
                        className="form-control"
                        value={StoreName}
                        type="text"
                        onChange={(e) => setStoreName(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>Google map ID</label>
                      <input
                        className="form-control"
                        value={GoogleMapID}
                        type="text"
                        onChange={(e) => setGoogleMapID(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="row ">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>
                        Store Email <RequiredField />
                      </label>
                      <input
                        className="form-control"
                        type="email"
                        value={StoreEmail}
                        onChange={(e) => {
                          if (e.target.value !== prevEmail) {
                            // setEmailChange(true);
                            console.log("Here");
                            if (businessEmail === e.target.value) {
                              setStoreEmailVerified(true);
                              setEmailChange(false);
                              setStoreEmail(e.target.value);
                            } else {
                              setEmailChange(true);
                              setStoreEmail(e.target.value);
                            }
                          } else {
                            setEmailChange(false);
                            setStoreEmail(e.target.value);
                          }
                        }}
                      />
                      {!StoreEmailVerified &&
                        emailChange &&
                        !CheckEmpty(StoreEmail) && (
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
                      <label>Store Phone</label>
                      {CountryCode.length > 0 && (
                        <PhoneInput
                          value={StorePhone}
                          country={"bd"}
                          onlyCountries={CountryCode}
                          inputClass="adduser-phone"
                          onChange={(e) => setStorePhone("+" + e)}
                          isValid={(value, country) => {
                            if (value.startsWith(country.countryCode)) {
                              return true;
                            } else {
                              return false;
                            }
                          }}
                        />
                      )}
                    </div>
                  </div>
                  {/* <div className="row mt-4">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>Address 1</label>
                      <input
                        className="form-control"
                        type="text"
                        value={StoreAddress1}
                        onChange={(e) => setStoreAddress1(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>Address 2</label>
                      <input
                        className="form-control"
                        type="text"
                        value={StoreAddress2}
                        onChange={(e) => setStoreAddress2(e.target.value)}
                      />
                    </div>
                  </div> */}
                  {/* <div className="row mt-4">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>
                        Country <RequiredField />
                      </label>
                      <select
                        onChange={(e) => {
                          setStoreCountryID(e.target.value);
                          getStates(e.target.value);
                          getCities(e.target.value);
                          setStoreCity("");
                          setStoreState("");
                          setStoreCityID("");
                        }}
                        className="form-control"
                      >
                        <option>Select</option>
                        {CountryList &&
                          CountryList.map((item, index) => (
                            <option
                              value={item.CountryID}
                              key={index}
                              selected={item.CountryID === StoreCountryID}
                            >
                              {" "}
                              {item.Country}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div> */}
                  {/* <div className="row mt-4">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>State / District / Province</label>
                    
                      {StateList.length > 0 ? (
                        <select
                          className="form-control"
                          onChange={(e) => {
                            setStoreState(JSON.parse(e.target.value).State);
                            getCitiesByState(
                              JSON.parse(e.target.value).StateID
                            );
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
                  </div> */}
                  {/* <div className="row mt-4">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>City</label>
                      
                      {CityList.length > 0 ? (
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
                          {CityList &&
                            CityList.map((item, index) => (
                              <option
                                key={index}
                                value={JSON.stringify(item)}
                                selected={StoreCityID === item.CityID}
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
                  </div> */}
                  <div className="row mt-4">
                    <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>Store Fax</label>
                      <input
                        className="form-control"
                        type="text"
                        value={StoreFAX}
                        placeholder="Enter Store Fax"
                        onChange={(e) => setStoreFAX(e.target.value)}
                      />
                    </div>
                    {/* <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                      <label>Store URL</label>
                      <input
                        className="form-control"
                        type="text"
                        value={StoreURL}
                        onChange={(e) => setStoreURL(e.target.value)}
                      />
                    </div> */}
                  </div>

                  {!CheckEmpty(Active) && (
                    <>
                      <div className="row mt-4">
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>Except Drop Off</label>
                          <div className="d-flex" style={{ alignItems: "end" }}>
                            <div className="cs-bi-radios">
                              <label>
                                <input
                                  type="radio"
                                  className="cs-bi-radios-input"
                                  name="ExceptDropOfffield"
                                  defaultChecked={ExceptDropOff === "Y"}
                                  onChange={() => setExceptDropOff("Y")}
                                />{" "}
                                Yes
                              </label>
                            </div>
                            <div className="cs-bi-radios">
                              <label>
                                <input
                                  type="radio"
                                  className="cs-bi-radios-input"
                                  name="ExceptDropOfffield"
                                  defaultChecked={ExceptDropOff === "N"}
                                  onChange={() => setExceptDropOff("N")}
                                />{" "}
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>Active</label>
                          <div className="d-flex" style={{ alignItems: "end" }}>
                            <div className="cs-bi-radios">
                              <label>
                                <input
                                  type="radio"
                                  className="cs-bi-radios-input"
                                  name="activefield"
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
                                  name="activefield"
                                  defaultChecked={Active === "N"}
                                  onChange={() => setActive("N")}
                                />{" "}
                                No
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {(CurrentUser.SuperAdmin === "Y" ||
                        CurrentUser.Admin === "Y") && (
                          <div className="row mt-4">
                            <div className="col-lg-12 col-xl-12 col-md-11112 col-sm-12 col-xs-12">
                              <label>Admin Note</label>{" "}
                              <textarea
                                className="form-control"
                                value={StoreAdminNote}
                                onChange={(e) =>
                                  setStoreAdminNote(e.target.value)
                                }
                              />
                            </div>
                          </div>
                        )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <BusinessEmailVerificationModal
              emailVerify={emailModal}
              setEmailVerify={setEmailModal}
              setEmailVerified={setStoreEmailVerified}
              status="3"
              email={StoreEmail}
            />
          </>
        )}
        <div className="mt-3" style={{ float: "right" }}>
          <button
            className="btn btn-success"
            onClick={() => {
              submitFormYesPickUp();
            }}
            disabled={emailChange && !StoreEmailVerified}
          >
            Update Store
          </button>
        </div>
      </div>
    </>
  );
}
export default UpdateSingleStore;
