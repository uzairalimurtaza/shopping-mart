import { Collapse } from "reactstrap";
import { useState, useContext } from "react";
import PhoneInput from "react-phone-input-2";
import ReactFlagsSelect from "react-flags-select";
import VendorRegistrationContext from "./../../../../Contexts/VendorRegistrationContext";
import { RequiredField } from "../../../../../Utils/Required-field";
function StoreInformation() {
  const [Open, SetOpen] = useState(true);
  var {
    BusinessEmail,
    setStoreName,
    setStoreAddress1,
    setStoreAddress2,
    setStoreEmail,
    setStorePhone,
    setStoreFAX,
    setStoreURL,
    setActive,
    CountryList,
    StateList,
    setStoreCountryID,
    setStoreState,
    setStoreCityID,
    setStoreCity,
    CityList,
    Active,
    StoreZipCode,
    setStoreZipCode,
    StorePhoneVerified,
    setStorePhoneVerified,
  } = useContext(VendorRegistrationContext);
  return (
    <div>
      <h4 className="ftw-400 text-default">Store Information</h4>
      <div className="card cstore-card">
        <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
          <h6 className="ftw-400">Store Info.</h6>
          <button onClick={() => SetOpen(!Open)}>
            {Open ? (
              <i className="fas fa-angle-up text-default"></i>
            ) : (
              <i className="fas fa-angle-down text-default"></i>
            )}
          </button>
        </div>
        <Collapse isOpen={Open}>
          <div className="card-body mb-5">
            <div className="row">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Store Name</label>
                <input
                  className="form-control"
                  type="text"
                  onChange={(e) => setStoreName(e.target.value)}
                />
              </div>
            </div>
            <div className="row ">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Store Email</label>
                <input
                  className="form-control"
                  defaultValue={BusinessEmail}
                  type="email"
                  onChange={(e) => setStoreEmail(e.target.value)}
                />
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Store Phone</label>
                <PhoneInput
                  value={""}
                  country={"bd"}
                  inputClass="adduser-phone"
                  onChange={(e) => setStorePhone("+" + e)}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Address 1</label>
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
                <label>Country</label>
                <select
                  onChange={(e) => setStoreCountryID(e.target.value)}
                  className="form-control"
                >
                  <option>Select</option>
                  {CountryList &&
                    CountryList.map((item, index) => (
                      <option value={item.CountryID} key={index}>
                        {" "}
                        {item.Country}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>State</label>
                <select
                  className="form-control"
                  onChange={(e) => setStoreState(e.target.value)}
                >
                  <option>Select...</option>
                  {StateList &&
                    StateList.map((item, index) => (
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
                    setStoreCity(item.City);
                    setStoreCityID(item.CityID);
                  }}
                >
                  <option>Select City</option>
                  {CityList &&
                    CityList.map((item, index) => (
                      <option key={index} value={JSON.stringify(item)}>
                        {item.City}
                      </option>
                    ))}
                </select>
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>ZipCode <RequiredField/></label>
                <input
                  className="form-control"
                  type="text"
                  value={StoreZipCode}
                  onChange={(e) => setStoreZipCode(e.target.value)}
                  placeholder="Enter ZipCode"
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Store Fax</label>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Enter Store Fax"
                  onChange={(e) => setStoreFAX(e.target.value)}
                />
              </div>
              <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                <label>Store URL</label>
                <input
                  className="form-control"
                  type="text"
                  onChange={(e) => setStoreURL(e.target.value)}
                />
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </div>
  );
}
export default StoreInformation;
