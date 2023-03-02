import PhoneInput from "react-phone-input-2";
import VendorRegistrationContext from "./../../../Contexts/VendorRegistrationContext";
import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { BusinessPhoneVerificationModal } from "./BusinessPhoneVerificationModal";
import firetoast from "./../../../../Helpers/FireToast";
import BusinessEmailVerificationModal from "./BusinessEmailVerificationModal";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import { RequiredField } from "./../../../../Utils/Required-field";
import CreatableSelect from "react-select/creatable";
import CheckEmpty from "../../../../Utils/CheckEmpty";
import axios from "axios";
import Endpoint, { Host_Name } from "./../../../../Utils/Endpoint";

function SellStep2() {
  var {
    CompanyName,
    setCompanyName,
    Address1,
    setAddress1,
    Address2,
    setAddress2,
    ZipCode,
    setZipCode,
    BusinessEmail,
    setBusinessEmail,
    BusinessPhone,
    setBusinessPhone,
    AllowDelivery,
    setAllowDelivery,
    AllowStorePickup,
    setAllowStorePickup,
    PaymentAccount,
    setPaymentAccount,
    PaymentRouting,
    setPaymentRouting,
    BusinessURL,
    setBusinessURL,
    GatewayID,
    setGatewayID,
    setCityID,
    setCountryID,
    setCity,
    City,
    State,
    setCompanyLogo,
    setState,
    setTaxIDPic,
    setGovernmentIDPic,
    CountryList,
    CityList,
    StateList,
    TaxID,
    setTaxID,
    GovernmentID,
    setGovernmentID,
    PageURL,
    setPageURL,
    emailChange,
    setEmailChange,
    phoneChange,
    setPhoneChange,
    emailVerify,
    setEmailVerify,
    BusinessPhoneVerified,
    setBusinessPhoneVerified,
    BannerImage,
    setBannerImage,
    BusinessEmailVerified,
    setBusinessEmailVerified,
    StateId,
    setStateId,
    CountryID,
    getStates,
    getCities,
    selectedVendorCountry,
    setSelectedVendorCountry,
    setStoreCountryID,
    getCitiesByState,
    TaxIDPic,
    CompanyLogo,
    GovernmentIDPic
  } = useContext(VendorRegistrationContext);
  const [phoneVerify, setPhoneVerify] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [CountryCode, setCountryCode] = useState([]);
  const [selectedCity, setselectedCity] = useState(null);
  const [selectedState, setselectedState] = useState(null);
  var createState = async (e) => {
    var { value, label } = e;
    if (CheckEmpty(CountryID)) {
      return firetoast(
        "Please Select Country first in order to create State",
        "error",
        3000,
        "top-right"
      );
    } else {
      var form = new URLSearchParams();

      form.append("CountryID", CountryID);
      form.append("StateName", label);
      var response = await axios.post(
        `${Endpoint}/api/location/add-newState`,
        form
      );
      return response.data.StateID;
    }
  };
  var createCity = async (e) => {
    var { value, label } = e;
    if (CheckEmpty(CountryID)) {
      return firetoast(
        "Please Select Country first in order to create city",
        "error",
        3000,
        "top-right"
      );
    }
    if (CheckEmpty(StateId)) {
      return firetoast(
        "Please Select State first in order to create city",
        "error",
        3000,
        "top-right"
      );
    }
    var form = new URLSearchParams();
    form.append("StateID", StateId);
    form.append("CountryID", CountryID);
    form.append("City", label);
    var response = await axios.post(
      `${Endpoint}/api/location/add-newCity`,
      form
    );
    return response.data.CityID;
  };
  useEffect(async () => {
    setCountryCode(await CountryCodes());
  }, []);
  return (
    <>
      <div className="mt-4">
        <h4 className="ftw-400">Basic Info</h4>
        <div className="mb-5">
          <div className="row">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Company Name <RequiredField />
              </label>
              <input
                className="form-control"
                value={CompanyName}
                type="text"
                onChange={(e) => {
                  setCompanyName(e.target.value);
                  var pageUrl = e.target.value.split(" ").join("_");
                  setPageURL(`/store/${pageUrl}`);
                }}
              />
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Store URL</label>
              {CompanyName.length > 0 && (
                <div style={{ fontSize: "13px" }}>
                  {`${Host_Name}${PageURL}`}{" "}
                  <span
                    style={{ marginLeft: "8px", cursor: "pointer" }}
                    onClick={() => {
                      navigator.clipboard.writeText(`${Host_Name}${PageURL}`);
                      firetoast("Copied", "success", 1000, "top-center");
                    }}
                  >
                    <i className="far fa-clipboard text-default"></i>
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Company Logo <RequiredField />
              </label>
              <input
                className="form-control"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setCompanyLogo(e.target.files[0])}
              />
              <div>
                {CompanyLogo && (
                  <img
                    src={URL.createObjectURL(CompanyLogo)}
                    alt="thumnail"
                    style={{
                      width: "260px",
                      height: "105px",
                      marginTop: "5px"
                    }}
                    name="file"
                  />
                )}
              </div>

            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Company Banner <RequiredField />
              </label>
              <input
                className="form-control"
                type="file"
                id="banner_image"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => {
                  var _URL = window.URL || window.webkitURL;
                  var img, file;
                  if ((file = e.target.files[0])) {
                    img = new Image();
                    var objectUrl = _URL.createObjectURL(file);
                    img.onload = function () {
                      // alert(this.width + " " + this.height);
                      if (this.width <= this.height) {
                        document.getElementById("banner_image").value = ""
                        return firetoast(
                          "Please select image with minimum dimensions of 820 x 312",
                          "error",
                          4000,
                          "top-right"
                        );
                      } else if (this.width < 820) {
                        document.getElementById("banner_image").value = ""
                        return firetoast(
                          "Please select image with minimum dimensions of 820 x 312",
                          "error",
                          4000,
                          "top-right"
                        );
                      } else if (this.height < 312) {
                        document.getElementById("banner_image").value = ""
                        return firetoast(
                          "Please select image with minimum dimensions of 820 x 312",
                          "error",
                          4000,
                          "top-right"
                        );
                      } else {
                        setBannerImage(e.target.files[0]);
                      }
                    };
                    img.src = objectUrl;
                  }
                }}
              />
              <div>
                {BannerImage && (
                  <img
                    src={URL.createObjectURL(BannerImage)}
                    alt="thumnail"
                    style={{
                      width: "260px",
                      height: "105px",
                      marginTop: "5px"
                    }}
                    name="file"
                  />
                )}
              </div>

            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Address 1 <RequiredField /></label>
              <input
                className="form-control"
                type="text"
                value={Address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Address 2</label>
              <input
                className="form-control"
                type="text"
                value={Address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Country <RequiredField />
              </label>
              <select
                className="form-control"
                onChange={(e) => {
                  if (e.target.value === "select") {
                    return e.preventDefault()
                  }
                  setCountryID(JSON.parse(e.target.value).CountryID);
                  getStates(JSON.parse(e.target.value).CountryID);
                  getCities(JSON.parse(e.target.value).CountryID);
                  setStoreCountryID(JSON.parse(e.target.value).CountryID);
                  setSelectedVendorCountry(JSON.parse(e.target.value));
                }}
              >
                <option value="select">Select...</option>
                {CountryList.map((item, index) => (
                  <option
                    value={JSON.stringify(item)}
                    key={index}
                    selected={CountryID === item.CountryID}
                  >
                    {item.Country}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              {CountryID === 16 && (
                <>
                  <label className="text-white">message</label>
                  <div className="text-danger">
                    <i
                      className="fas fa-info-circle"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Delivery Service"
                    ></i>{" "}
                    <strong>Pathao</strong> will be used as courier delivery
                    service.
                  </div>
                </>
              )}
              {CountryID === 226 && (
                <>
                  <label className="text-white">message</label>
                  <div className="text-danger">
                    <i
                      className="fas fa-info-circle"
                      data-toggle="tooltip"
                      data-placement="top"
                      title="Tooltip on top"
                    ></i>{" "}
                    <strong>USPS</strong> will be used as courier delivery
                    service.
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>State / District / Province <RequiredField /> </label>
              {/* <CreatableSelect
                isClearable
                onChange={async (e) => {
                  if (e) {
                    if (e.__isNew__) {
                      // var value = await createState(e);
                      setState(e.label);
                      // setStateId(value);
                      // setselectedState(e);
                    } else {
                      setState(e.label);
                      // setStateId(e.value);
                      // setselectedState(e);
                    }
                  } else {
                    setState("");
                    // setStateId("");
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
                    if (e.target.value === "select") {
                      return e.preventDefault()
                    }
                    setState(JSON.parse(e.target.value).State);
                    getCitiesByState(JSON.parse(e.target.value).StateID);
                    setCity(null)
                  }}
                >
                  <option value={"select"}>Select...</option>
                  {StateList.map((item, index) => (
                    <option
                      value={JSON.stringify(item)}
                      key={index}
                      selected={State === item.State}
                    >
                      {item.State}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="form-control"
                  defaultValue={State}
                  onChange={(e) => setState(e.target.value)}
                />
              )}
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>City <RequiredField /></label>
              {/* <CreatableSelect
                isClearable
                onChange={async (e) => {
                  if (e) {
                    if (e.__isNew__) {
                      // var value = await createCity(e);
                      setCity(e.label);
                      // setCityID(value);
                      // setselectedCity(e);
                    } else {
                      setCity(e.label);
                      setCityID(e.value);
                      // setselectedCity(e);
                    }
                  } else {
                    // setselectedCity(null);
                    setCity("");
                    setCityID("");
                  }
                }}
                // onInputChange={(e) => console.log(e)}
                options={CityList}
              /> */}
              {CityList.length > 0 ? (
                <select
                  className="form-control"
                  placeholder="Enter City"
                  onChange={(e) => {
                    if (e.target.value === "select") {
                      return e.preventDefault()
                    }
                    var item = JSON.parse(e.target.value);
                    setCity(item.City);
                    setCityID(item.CityID);
                  }}
                >
                  <option value={"select"}>Select City</option>
                  {CityList.map((item, index) => (
                    <option key={index} value={JSON.stringify(item)} selected={City === item.City}>
                      {item.City}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="form-control"
                  defaultValue={City}
                  onChange={(e) => setCity(e.target.value)}
                />
              )}
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Zipcode</label>
              <input
                className="form-control"
                type="text"
                value={ZipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="Enter Zipcode"
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Tax ID <RequiredField />
              </label>
              <input
                className="form-control"
                type="text"
                value={TaxID}
                onChange={(e) => setTaxID(e.target.value)}
                placeholder="Enter Tax ID"
              />
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Tax ID Picture <RequiredField /></label>
              <input
                className="form-control"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setTaxIDPic(e.target.files[0])}
              />
              <div>
                {TaxIDPic && (
                  <img
                    src={URL.createObjectURL(TaxIDPic)}
                    alt="thumnail"
                    style={{
                      width: "260px",
                      height: "100px",
                      marginTop: "5px"
                    }}
                    name="file"
                  />
                )}
              </div>

            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Government ID / NIC <RequiredField /></label>
              <input
                className="form-control"
                type="text"
                placeholder="Enter Government ID"
                value={GovernmentID}
                onChange={(e) => setGovernmentID(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Government ID Picture <RequiredField /></label>
              <input
                className="form-control"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setGovernmentIDPic(e.target.files[0])}
              />
              <div>
                {GovernmentIDPic && (
                  <img
                    src={URL.createObjectURL(GovernmentIDPic)}
                    alt="thumnail"
                    style={{
                      width: "260px",
                      height: "100px",
                      marginTop: "5px"
                    }}
                    name="file"
                  />
                )}
              </div>

            </div>
          </div>
          {/* <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Page Url 
              </label>
              <input
                className="form-control"
                type="text"
                value={PageURL}
                onChange={(e) => setPageURL(e.target.value)}
              />
            </div>
          </div> */}
        </div>
      </div>

      <div>
        <h4 className="ftw-400">Payment Info</h4>
        <div className="mb-5">
          <div className="row">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Payment Account</label>
              <input
                className="form-control"
                type="text"
                value={PaymentAccount}
                onChange={(e) => setPaymentAccount(e.target.value)}
              />
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Payment Routing</label>
              <input
                className="form-control"
                type="text"
                onChange={(e) => setPaymentRouting(e.target.value)}
                value={PaymentRouting}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <h4 className="ftw-400">General Info</h4>
        <div className="mb-5">
          <div className="row">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Business Email <RequiredField />
              </label>
              <input
                className="form-control"
                type="email"
                value={BusinessEmail}
                onChange={(e) => {
                  setBusinessEmail(e.target.value);
                  setEmailChange(true);
                }}
              />
              {!BusinessEmailVerified &&
                BusinessEmail.length > 0 &&
                emailChange && (
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
              {!BusinessEmailVerified ? <><div className="text-danger mt-1" style={{ fontSize: "15px" }}>Please verify your Business Email first</div></> : <></>}
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>
                Business Phone <RequiredField />
              </label>
              {CountryCode.length > 0 && (
                <PhoneInput
                  value={BusinessPhone}
                  country={"bd"}
                  onlyCountries={CountryCode}
                  isValid={(value, country) => {
                    if (value.startsWith(country.countryCode)) {
                      // setDisable(false);
                      return true;
                    } else {
                      // setDisable(true);
                      return false;
                    }
                  }}
                  inputClass="adduser-phone"
                  onChange={(e) => {
                    setBusinessPhone("+" + e);
                    setPhoneChange(true);
                  }}
                />
              )}

              {!BusinessPhoneVerified &&
                BusinessPhone.length > 1 &&
                BusinessPhone && (
                  <>
                    <Link
                      to="#"
                      className="text-default mt-2"
                      onClick={() => {
                        setPhoneVerify(!phoneVerify);
                      }}
                    >
                      Verify
                    </Link>{" "}
                    your Phone Number
                  </>
                )}
              {!BusinessPhoneVerified ? <><div className="text-danger" style={{ fontSize: "15px" }}>Please verify your Business Phone first</div></> : <></>}
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
            <label>
              Business URL <small>(optional)</small>
            </label>
            <input
              className="form-control"
              type="text"
              value={BusinessURL}
              onChange={(e) => setBusinessURL(e.target.value)}
            />
          </div>
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
            <label>Gateway ID</label>
            <input
              className="form-control"
              type="text"
              value={GatewayID}
              onChange={(e) => setGatewayID(e.target.value)}
            />
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
            <label>Allow Delivery</label>
            <div className="d-flex" style={{ alignItems: "end" }}>
              <div className="cs-bi-radios">
                <label>
                  <input
                    type="radio"
                    className="cs-bi-radios-input"
                    name="allowDelivery"
                    defaultChecked={AllowDelivery === "Y"}
                    onChange={() => setAllowDelivery("Y")}
                  />{" "}
                  Yes
                </label>
              </div>
              <div className="cs-bi-radios">
                <label>
                  <input
                    type="radio"
                    className="cs-bi-radios-input"
                    name="allowDelivery"
                    defaultChecked={AllowDelivery === "N"}
                    onChange={() => setAllowDelivery("N")}
                  />{" "}
                  No
                </label>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
            <label>Allow Store Pickup</label>
            <div className="d-flex" style={{ alignItems: "end" }}>
              <div className="cs-bi-radios">
                <label>
                  <input
                    type="radio"
                    className="cs-bi-radios-input"
                    defaultChecked={AllowStorePickup === "Y"}
                    name="allowPickup"
                    onChange={() => setAllowStorePickup("Y")}
                  />{" "}
                  Yes
                </label>
              </div>
              <div className="cs-bi-radios">
                <label>
                  <input
                    type="radio"
                    className="cs-bi-radios-input"
                    defaultChecked={AllowStorePickup === "N"}
                    name="allowPickup"
                    onChange={() => setAllowStorePickup("N")}
                  />{" "}
                  No
                </label>
              </div>
            </div>

          </div>
          <div>


          </div>
          <BusinessPhoneVerificationModal
            phoneVerify={phoneVerify}
            setPhoneVerify={setPhoneVerify}
            phoneToBeVerified={BusinessPhone}
            setPhoneStatus={setBusinessPhoneVerified}
          />
          {/* <div className="row mt-4">
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Product Approval</label>
              <div className="d-flex" style={{ alignItems: "end" }}>
                <div className="cs-bi-radios">
                  <label>
                    <input
                      type="radio"
                      className="cs-bi-radios-input"
                      name="allowDelivery"
                    />{" "}
                    Yes
                  </label>
                </div>
                <div className="cs-bi-radios">
                  <label>
                    <input
                      type="radio"
                      className="cs-bi-radios-input"
                      name="allowDelivery"
                    />{" "}
                    No
                  </label>
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
              <label>Created Date</label>
              <input className="form-control cs-date-input" type="date" />
            </div>
          </div> */}

          {/* <div className="row mt-4">
            <div className="col-lg-12 col-xl-12 col-md-12 col-sm-12 col-xs-12">
              <label>Admin Note</label>
              <textarea className="form-control" rows={"5"} />
            </div>
          </div> */}
        </div>
      </div>
      <BusinessEmailVerificationModal
        emailVerify={emailModal}
        setEmailVerify={setEmailModal}
        setEmailVerified={setBusinessEmailVerified}
        status="1"
      />
    </>
  );
}
export default SellStep2;