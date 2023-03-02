import { Collapse } from "reactstrap";
import { useState, useContext, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import ReactFlagsSelect from "react-flags-select";
import VendorRegistrationContext from "./../../../../Contexts/VendorRegistrationContext";
import { Link } from "react-router-dom";
import { CountryCodes } from "../../../../../Helpers/CountryCodes";
import firetoast from "./../../../../../Helpers/FireToast";
import { Host_Name } from "./../../../../../Utils/Endpoint";
function BasicInformation() {
  const [Open1, SetOpen1] = useState(true);
  const [Open2, SetOpen2] = useState(true);
  const [Open3, SetOpen3] = useState(true);
  const [countryCodes, setCountryCodes] = useState([]);
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
    setDisable,
    BannerImage,
    setBannerImage,
  } = useContext(VendorRegistrationContext);
  useEffect(async () => {
    var temp = await CountryCodes();
    setCountryCodes(temp);
  }, []);
  return (
    <>
      <div>
        <h4 className="ftw-400 text-default">Basic Information</h4>
        <div className="card cstore-card">
          <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
            <h6 className="ftw-400">Basic Info.</h6>
            <button onClick={() => SetOpen1(!Open1)}>
              {Open1 ? (
                <i className="fas fa-angle-up text-default"></i>
              ) : (
                <i className="fas fa-angle-down text-default"></i>
              )}
            </button>
          </div>
          <Collapse isOpen={Open1}>
            <div className="card-body mb-5">
              <div className="row">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Company Name</label>
                  <input
                    className="form-control"
                    value={CompanyName}
                    type="text"
                    onChange={(e) => setCompanyName(e.target.value)}
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
                          navigator.clipboard.writeText(
                            `${Host_Name}${PageURL}`
                          );
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
                  <label>Company Logo</label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={(e) => setCompanyLogo(e.target.files[0])}
                  />
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Company Banner</label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={(e) => {
                      var _URL = window.URL || window.webkitURL;
                      var img, file;
                      if ((file = e.target.files[0])) {
                        img = new Image();
                        var objectUrl = _URL.createObjectURL(file);
                        img.onload = function () {
                          // alert(this.width + " " + this.height);
                          if (this.width <= this.height) {
                            return firetoast(
                              "Please select image with minimum dimensions of 820 x 312",
                              "error",
                              4000,
                              "top-right"
                            );
                          } else if (this.width < 820) {
                            return firetoast(
                              "Please select image with minimum dimensions of 820 x 312",
                              "error",
                              4000,
                              "top-right"
                            );
                          } else if (this.height < 312) {
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
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Address 1</label>
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
                  <label>Country</label>
                  <select
                    className="form-control"
                    onChange={(e) => setCountryID(e.target.value)}
                  >
                    <option>Select...</option>
                    {CountryList.map((item, index) => (
                      <option value={item.CountryID} key={index}>
                        {item.Country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>State</label>
                  <select
                    className="form-control"
                    onChange={(e) => setState(e.target.value)}
                  >
                    <option>Select...</option>
                    {StateList.map((item, index) => (
                      <option value={item.State} key={index}>
                        {item.State}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>City</label>
                  <select
                    className="form-control"
                    type="text"
                    placeholder="Enter City"
                    onChange={(e) => {
                      var item = JSON.parse(e.target.value);
                      setCity(item.City);
                      setCityID(item.CityID);
                    }}
                  >
                    <option>Select City</option>
                    {CityList.map((item, index) => (
                      <option key={index} value={JSON.stringify(item)}>
                        {item.City}
                      </option>
                    ))}
                  </select>
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
                  <label>Tax ID</label>
                  <input
                    className="form-control"
                    type="text"
                    value={TaxID}
                    onChange={(e) => setTaxID(e.target.value)}
                    placeholder="Enter Tax ID"
                  />
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Tax ID Picture</label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={(e) => setTaxIDPic(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Government ID</label>
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Enter Government ID"
                    value={GovernmentID}
                    onChange={(e) => setGovernmentID(e.target.value)}
                  />
                </div>
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Government ID Picture</label>
                  <input
                    className="form-control"
                    type="file"
                    onChange={(e) => setGovernmentIDPic(e.target.files[0])}
                  />
                </div>
              </div>
              <div className="row mt-4">
                <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                  <label>Page Url</label>
                  <input
                    className="form-control"
                    type="text"
                    value={PageURL}
                    onChange={(e) => setPageURL(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Collapse>
        </div>
      </div>
      <div className="mt-4">
        <div className="card cstore-card">
          <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
            <h6 className="ftw-400">Payment Information</h6>
            <button onClick={() => SetOpen2(!Open2)}>
              {Open2 ? (
                <i className="fas fa-angle-up text-default"></i>
              ) : (
                <i className="fas fa-angle-down text-default"></i>
              )}
            </button>
          </div>
          <Collapse isOpen={Open2}>
            <div className="card-body mb-5">
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
          </Collapse>
        </div>
        <div className="mt-4">
          <div className="card cstore-card">
            <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
              <h6 className="ftw-400">Business Information</h6>
              <button onClick={() => SetOpen3(!Open3)}>
                {Open3 ? (
                  <i className="fas fa-angle-up text-default"></i>
                ) : (
                  <i className="fas fa-angle-down text-default"></i>
                )}
              </button>
            </div>
            <Collapse isOpen={Open3}>
              <div className="card-body mb-5">
                <div className="row">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                    <label>Business Email</label>
                    <input
                      className="form-control"
                      type="email"
                      value={BusinessEmail}
                      onChange={(e) => {
                        setBusinessEmail(e.target.value);
                        setEmailChange(true);
                      }}
                    />
                  </div>
                  <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                    <label>Business Phone</label>
                    <PhoneInput
                      value={BusinessPhone}
                      country={"bd"}
                      isValid={(value, country) => {
                        if (value.startsWith(country.countryCode)) {
                          setDisable(false);
                          return true;
                        } else {
                          setDisable(true);
                          return false;
                        }
                      }}
                      inputClass="adduser-phone"
                      onChange={(e) => {
                        setBusinessPhone("+" + e);
                        setPhoneChange(true);
                      }}
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                    <label>Business URL</label>
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
                </div>
              </div>
            </Collapse>
          </div>
        </div>
      </div>
    </>
  );
}
export default BasicInformation;
