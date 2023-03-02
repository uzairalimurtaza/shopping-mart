// import formSubmit from "../../../../assets/images/form-success.svg";
import { useState, useContext, useEffect } from "react";
import { Button, Modal, ModalFooter } from "reactstrap";
import { ModalHeader } from "reactstrap";
import { ModalBody } from "reactstrap";
import PhoneInput from "react-phone-input-2";
import { Link } from "react-router-dom";
import VendorRegistrationContext from "./../../../Contexts/VendorRegistrationContext";
import BusinessEmailVerificationModal from "./BusinessEmailVerificationModal";
import firetoast from "./../../../../Helpers/FireToast";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import { CurrentUser } from "./../../../../Helpers/Auth";
import axios from "axios";
import Endpoint from "./../../../../Utils/Endpoint";
import { useHistory } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { RequiredField } from "./../../../../Utils/Required-field";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
function SelLStep4() {
  const {
    CountryList,
    StateList,
    CityList,
    BusinessEmail,
    CountryID,
    zone_id,
    setZone_id,
    area_id,
    setArea_id,
  } = useContext(VendorRegistrationContext);
  const history = useHistory();
  const [modal, setModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [StoreName, setStoreName] = useState(null);
  const [StoreAddress1, setStoreAddress1] = useState(null);
  const [StoreAddress2, setStoreAddress2] = useState(null);
  const [StoreEmail, setStoreEmail] = useState("");
  const [StorePhone, setStorePhone] = useState(null);
  const [StoreFAX, setStoreFAX] = useState(null);
  const [StoreZipCode, setStoreZipCode] = useState(null);
  const [StoreURL, setStoreURL] = useState(null);
  const [Active, setActive] = useState("Y");
  const [StoreCountryID, setStoreCountryID] = useState(CountryID);
  const [StoreCityID, setStoreCityID] = useState(null);
  const [StoreCity, setStoreCity] = useState(null);
  const [StoreState, setStoreState] = useState(null);
  const [GoogleMapID, setGoogleMapID] = useState("");
  const [PageURL, setPageURL] = useState("");
  const [emailChange, setEmailChange] = useState(false);
  const [phoneChange, setPhoneChange] = useState(false);
  const [emailVerify, setEmailVerify] = useState(false);
  const [BusinessEmailVerified, setBusinessEmailVerified] = useState(false);
  const [BusinessPhoneVerified, setBusinessPhoneVerified] = useState(false);
  const [StoreEmailVerified, setStoreEmailVerified] = useState(false);
  const [StorePhoneVerified, setStorePhoneVerified] = useState(false);
  const [currentStores, setCurrentStores] = useState([]);
  const [StoreStateId, setStoreStateId] = useState("");
  const [CountryCode, setCountryCode] = useState([]);
  const [StoreCityList, setStoreCityList] = useState(CityList);
  const [PathaoCities, setPathaoCities] = useState([]);
  const [ZoneList, setZoneList] = useState([]);
  const [AreaList, setAreaList] = useState([]);
  const [PathaoToken, setPathaoAccessToken] = useState(null);
  useEffect(async () => {
    getPathaoToken();
    getAllStores();
    setCountryCode(await CountryCodes());
    if (CountryID === 16) {
      getPathaoCities();
    }
  }, []);
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
  var getAllStores = async () => {
    try {
      var response = await axios.get(
        `${Endpoint}/api/store-management/store-details/${CurrentUser.UserID}`
      );
      setCurrentStores(response.data.Store);
    } catch (e) {
      console.log(e, "error getting stores");
      firetoast(
        "Something went wrong while fetching stores",
        "error",
        4000,
        "top-right"
      );
    }
  };
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
  var validateStep2Fields = () => {
    var errors = [];

    if (CheckEmpty(StoreName)) {
      errors.push("Please provide store name");
    }
    if (CheckEmpty(StoreEmail)) {
      errors.push("Please provide store email");
    }
    console.log(StorePhone,"StorePhone")
    if (CheckEmpty(StorePhone)|| StorePhone.length !==11  )  {
      errors.push("Please provide 11 digits valid store phone starting with 0");
    }
    if (CheckEmpty(StoreAddress1) || StoreAddress1.length <15 || StoreAddress1.length > 120 ) {
      errors.push("Please provide store address #1 between 15 and 120 characters.");
    }
    if (CheckEmpty(StoreCountryID)) {
      errors.push("Please select the country");
    }
    if (CheckEmpty(StoreCountryID)) {
      errors.push("Please select the store country");
    }
    if (CheckEmpty(StoreCity)) {
      errors.push("Store city is not selected");
    }
    if (CheckEmpty(zone_id)) {
      errors.push("Store zone is not selected");
    }
    console.log(area_id,"area_id")
    if (CheckEmpty(area_id)) {
      errors.push("Store area is not selected");
    }
    if (CheckEmpty(StoreZipCode)) {
      errors.push("Please provide store zip code");
    }
    if (errors.length > 0) {
      return [true, errors];
    } else {
      return [false, errors];
    }
  };
  var submitStoreDetails = async (data) => {
    try {
      var form = new URLSearchParams();
      for (var key in data) {
        form.append(key, data[key]);
      }
      var response = await axios.post(
        Endpoint + "/api/store-management/vendor-store",
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
  var submitStore = async () => {
    var [error, errors] = validateStep2Fields();
    if (error) {
      for (let i = 0; i < errors.length; i++) {
        firetoast(errors[i], "error", 3000, "top-right");
      }
    } else {
      var data = {
        VendorID: CurrentUser.UserID,
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
        AdminNote: "",
        ExceptDropOff: "N",
        PhoneVerified: "Y",
        EmailVerified: "Y",
        city_id: StoreCityID,
        zone_id,
        area_id,
        pathaoToken: PathaoToken,
      };

      var resp_ = await submitStoreDetails(data);
      if (resp_) {
        firetoast("Created Successfully", "success", 3000, "top-right");

        setModal(!modal);
        getAllStores();
      }
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

  return (
    <>
      <div className="form mt-5">
        <div className="d-flex justify-content-between">
          <div></div>
          <div>
            <button
              className="btn btn-success"
              onClick={() => setModal(!modal)}
            >
              <i className="fas fa-plus"></i> New Store Location{" "}
            </button>
          </div>
        </div>

        <div className="mt-2">
          <h4 className="ftw-400">Store Locations</h4>
          <p>Information related to store and business can be updated later.</p>
          <div className="row m-auto">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 table-responsive">
              <table className="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th> Email</th>
                    <th> Phone</th>
                    <th> Address # 1</th>
                    <th> Address # 2</th>
                    <th>City </th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStores.length > 0 &&
                    currentStores.map((store, index) => (
                      <tr key={index}>
                        <td className="pt-18">{store.StoreName}</td>
                        <td className="pt-18">{store.StoreEmail}</td>
                        <td className="pt-18">{store.StorePhone}</td>
                        <td className="pt-18">{store.Address1}</td>
                        <td className="pt-18">{store.Address2}</td>
                        <td className="pt-18">{store.City}</td>
                        <td className="pt-18">{store.State}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="mt-3" style={{ float: "right" }}>
          <button
            className="btn btn-success"
            onClick={() => setTimeout(() => history.push("/"), 2000)}
          >
            Done <i className="fas fa-check"></i>
          </button>
        </div>
        <Modal toggle={() => setModal(!modal)} isOpen={modal} size="lg">
          <ModalHeader toggle={() => setModal(!modal)}>
            {" "}
            <h4 className="ftw-400">Store Info</h4>
          </ModalHeader>
          <ModalBody>
            <div>
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
                      type="text"
                      onChange={(e) => {
                        setStoreName(e.target.value);
                        var pageUrl = e.target.value.split(" ").join("_");
                        setPageURL(`/store/${pageUrl}`);
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
                      type="email"
                      onChange={(e) => {
                        if (BusinessEmail === e.target.value) {
                          setEmailChange(false);
                          setStoreEmailVerified(true);
                          setStoreEmail(e.target.value);
                        } else {
                          setEmailChange(true);
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
                    <label>Store Phone <RequiredField /></label>
                     <input
                      className="form-control"
                      type="text"
                      onChange={(e) => setStorePhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                    <label>Address 1 <RequiredField /></label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => setStoreAddress1(e.target.value)}
                    />
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                    <label>Address 2</label>
                    <input
                      className="form-control"
                      type="text"
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
                      disabled
                    >
                      <option>Select</option>
                      {CountryList &&
                        CountryList.map((item, index) => (
                          <option
                            value={item.CountryID}
                            key={index}
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
                    {" "}
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
                        <label>State /District /Province</label>
                        {/* <CreatableSelect
                      isClearable
                      onChange={(e) => {
                        if (e) {
                          if (e.__isNew__) {
                            setStoreState(e.label);
                          } else {
                            setStoreState(e.label);
                            setStoreStateId(e.value);
                          }
                        } else {
                          setStoreState("");
                          setStoreStateId("");
                        }
                      }}
                      // onInputChange={(e) => console.log(e)}
                      options={StateList}
                    /> */}
                        {StateList.length > 0 ? (
                          <select
                            className="form-control"
                            onChange={(e) => {
                              if(e.target.value ==="select"){
                                return e.preventDefault()
                              }
                              setStoreState(JSON.parse(e.target.value).State);
                              getCitiesByState(
                                JSON.parse(e.target.value).StateID
                              );
                            }}
                          >
                            <option value="select">Select...</option>
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
                          }
                        } else {
                          setStoreCity("");
                          setStoreCityID("");
                        }
                      }}
                      // onInputChange={(e) => console.log(e)}
                      options={CityList}
                    /> */}
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
                                >
                                  {item.City}
                                </option>
                              ))}
                          </select>
                        ) : (
                          <input
                            className="form-control"
                            onChange={(e) => setStoreCity(e.target.value)}
                          />
                        )}
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
                )}

                <div className="row mt-4">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                    <label>Store Fax  <small>(Optional)</small></label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Enter Store Fax"
                      onChange={(e) => setStoreFAX(e.target.value)}
                    />
                  </div>
                  {/* <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                    <label>Store URL</label>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => setStoreURL(e.target.value)}
                    />
                  </div> */}
                </div>

                <BusinessEmailVerificationModal
                  emailVerify={emailModal}
                  setEmailVerify={setEmailModal}
                  setEmailVerified={setStoreEmailVerified}
                  status="3"
                  email={StoreEmail}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div>
              <span>
                {" "}
                {!StoreEmailVerified && !CheckEmpty(StoreEmail) && (
                  <span className="text-danger" style={{ marginRight: "10px" }}>
                    Verify your store email
                  </span>
                )}
                <Button
                  color="success"
                  onClick={() => submitStore()}
                  // disabled={!StoreEmailVerified}
                >
                  Create
                </Button>{" "}
              </span>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
}
export default SelLStep4;