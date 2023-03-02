// import SellStep1 from "./Sell Components/SellStep1";
import SellStep2 from "./Sell Components/SellStep2";
import { useState, useContext, useEffect } from "react";
import SellStep3 from "./Sell Components/SellStep3";
import SelLStep4 from "./Sell Components/SellStep4";
import SellTopBar from "./Sell Components/SellTopBar";
import VendorRegistrationContext from "../../Contexts/VendorRegistrationContext";
import Endpoint from "./../../../Utils/Endpoint";
import axios from "axios";
import CheckEmpty from "./../../../Utils/CheckEmpty";
import firetoast from "./../../../Helpers/FireToast";
import { ToastContainer } from "react-toastify";
import { useHistory } from "react-router-dom";
import { CurrentUser } from "./../../../Helpers/Auth";
import Loading from "../../../Utils/Loading";
import Step1 from "../../../assets/images/Ystep1.svg";
import Step11 from "../../../assets/images/NStep1.svg";
import Step2 from "../../../assets/images/Step2.svg";
import Step3 from "../../../assets/images/Step3.svg";
import accessdenied from "../../../assets/images/accessdenied.png";
import logo from "../../../assets/images/logo.png";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
function Sell() {
  const history = useHistory();
  useContext(VendorRegistrationContext);
  const [show, setShow] = useState(1);
  const [CompanyName, setCompanyName] = useState("");
  const [Address1, setAddress1] = useState(null);
  const [Address2, setAddress2] = useState(null);
  const [ZipCode, setZipCode] = useState(null);
  const [BusinessEmail, setBusinessEmail] = useState("");
  const [BusinessPhone, setBusinessPhone] = useState("");
  const [AllowDelivery, setAllowDelivery] = useState("N");
  const [AllowStorePickup, setAllowStorePickup] = useState("Y");
  const [PaymentAccount, setPaymentAccount] = useState(null);
  const [PaymentRouting, setPaymentRouting] = useState(null);
  const [BusinessURL, setBusinessURL] = useState(null);
  const [GatewayID, setGatewayID] = useState(null);
  const [CityID, setCityID] = useState(null);
  const [City, setCity] = useState(null);
  const [State, setState] = useState(null);
  const [CityList, setCityList] = useState([]);
  const [StateList, setStateList] = useState([]);
  const [CountryList, setCountryList] = useState([]);
  const [CountryID, setCountryID] = useState(null);
  const [CompanyLogo, setCompanyLogo] = useState(null);
  const [TaxIDPic, setTaxIDPic] = useState(null);
  const [TaxID, setTaxID] = useState(null);
  const [GovernmentIDPic, setGovernmentIDPic] = useState(null);
  const [GovernmentID, setGovernmentID] = useState(null);
  const [BannerImage, setBannerImage] = useState(null);
  {
    /*Store*/
  }
  const [StoreName, setStoreName] = useState(null);
  const [StoreAddress1, setStoreAddress1] = useState(null);
  const [StoreAddress2, setStoreAddress2] = useState(null);
  const [StoreEmail, setStoreEmail] = useState("");
  const [StorePhone, setStorePhone] = useState(null);
  const [StoreFAX, setStoreFAX] = useState(null);
  const [StoreZipCode, setStoreZipCode] = useState(null);
  const [StoreURL, setStoreURL] = useState(null);
  const [Active, setActive] = useState("Y");
  const [StoreCountryID, setStoreCountryID] = useState(null);
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
  const [StateId, setStateId] = useState("");
  const [StoreStateId, setStoreStateId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [ReviewedBySuperAdmin, setReviewedBySuperAdmin] = useState("Y");
  const [selectedVendorCountry, setSelectedVendorCountry] = useState(null);
  const [PathaoToken, setPathaoAccessToken] = useState(null);
  const [zone_id, setZone_id] = useState(null);
  const [area_id, setArea_id] = useState(null);
  useEffect(() => {
    getVendorBusiness();
    // getCities();
    getPathaoToken();
    getCountries();
    // getStates();
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
  var getVendorBusiness = async () => {
    setIsLoading(true);
    try {
      var response = await BanglaBazarApi.get(
        Endpoint +
          `/api/store-management/buisness-details/${CurrentUser.UserID}`
      );
      if (!response.data.business) {
        setIsLoading(false);
        return null;
      }
      if (
        response.data.business.length > 0 ||
        Object.keys(response.data.business).length > 0
      ) {
        setReviewedBySuperAdmin(response.data.business["ReviewedBySuperAdmin"]);
        if (response.data.business.ReviewedBySuperAdmin === "Y") {
          history.push(`/panel/viewBusiness/${CurrentUser.UserID}`);
        }
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      // firetoast("Something went wrong!", "error", 4000, "top-right");
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
      console.log(response.data.Cities,"--------------------------")
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

  var validateStep1Fields = () => {
    var errors = [];

    if (CheckEmpty(CompanyName)) {
      errors.push("Please provide company name");
    }
    if (CheckEmpty(CompanyLogo)) {
      errors.push("Company logo not uploaded!");
    }
    if (CheckEmpty(BannerImage)) {
      errors.push("Provide Banner image ");
    }
    if (CheckEmpty(Address1)) {
      errors.push("Provide address # 1 of your business");
    }
    if (CheckEmpty(CountryID)) {
      errors.push("Please select country");
    }
    // if (CheckEmpty(ZipCode)) {
    //   errors.push("Provide zipcode");
    // }
    if (CheckEmpty(State)) {
      errors.push("State not selected!");
    }
    if (CheckEmpty(City)) {
      errors.push("Please select your city!");
    }
    if (CheckEmpty(TaxID)) {
      errors.push("Tax id not added!");
    }
    if (CheckEmpty(TaxIDPic)) {
      errors.push("Please upload Tax Id picture!");
    }
    if (CheckEmpty(GovernmentID)) {
      errors.push("Provide government id / NIC");
    }
    if (CheckEmpty(GovernmentIDPic)) {
      errors.push("Provide government id picture");
    }
    
    // if (CheckEmpty(PaymentAccount)) {
    //   errors.push("Provide payment account");
    // }
    // if (CheckEmpty(PaymentRouting)) {
    //   errors.push("Provide payment routing");
    // }
    if (CheckEmpty(BusinessEmail)) {
      errors.push("Provide your business email");
    }
    if (CheckEmpty(BusinessPhone)) {
      errors.push("Provide your business phone");
    }
    // if (CheckEmpty(BusinessURL)) {
    //   errors.push("Provide your business url");
    // }
    // if (CheckEmpty(GatewayID)) {
    //   errors.push("Provide Gateway id");
    // }
    // if (CheckEmpty(PageURL)) {
    //   errors.push("Provide page url");
    // }

    if (errors.length > 0) {
      return [true, errors];
    } else {
      return [false, errors];
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
    if (CheckEmpty(StorePhone) || StorePhone.length != 13 ) {
      errors.push("Please provide valid store phone");
    }
    if (CheckEmpty(StoreAddress1) || StoreAddress1.length <15 || StoreAddress1.length > 120 ) {
      errors.push("Please provide store address #1 between 15 and 120 characters.");
    }
    if (CheckEmpty(StoreCountryID)) {
      errors.push("Please select the store country");
    }
    if (CheckEmpty(StoreZipCode)) {
      errors.push("Please provide store zip code");
    }
    if (CheckEmpty(area_id)) {
      errors.push("Store area is not selected");
    }
    if (CheckEmpty(StoreCity)) {
      errors.push("Store city is not selected");
    }
    if (CheckEmpty(zone_id)) {
      errors.push("Store zone is not selected");
    }
    // if (CheckEmpty(StoreURL)) {
    //   errors.push("Enter store url ");
    // }
    if (errors.length > 0) {
      return [true, errors];
    } else {
      return [false, errors];
    }
  };
  var submitFormNoPickUp = async () => {
    var [error, errors] = validateStep1Fields();

    if (error) {
      for (let i = 0; i < errors.length; i++) {
        firetoast(errors[i], "error", 3000, "top-right");
      }
    } else {
      var data = {
        VendorID: CurrentUser.UserID,
        CompanyName,
        Address1,
        Address2,
        CityID,
        State,
        ZipCode,
        GoogleMapID,
        CountryID,
        PaymentAccount,
        PaymentRouting,
        BusinessEmail,
        BusinessPhone,
        BusinessURL,
        PageURL,
        AllowDelivery,
        GatewayID,
        AllowStorePickup,
        PhoneVerified: "Y",
        EmailVerified: "Y",
        TaxID,
        City,
        GovernmentID,
        CompanyLogo,
        TaxIDPic,
        GovernmentIDPic,
        AdminNote: "",
        ProductApproval: "Y",
        BannerImage,
      };
      var response = await submitBusinessDetails(data);
      if (response) {
        firetoast("Created Successfully!", "success", 3000, "top-right");
        var temp = CurrentUser;
        temp.Vendor = "Y";
        localStorage.setItem("user", JSON.stringify(temp));
        setTimeout(
          () => history.push(`/panel/viewBusiness/${CurrentUser.UserID}`),
          2000
        );
      }
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
  var submitBusinessDetails = async (data) => {
    try {
      var form = new FormData();
      for (var key in data) {
        form.append(key, data[key]);
      }
      var response = await axios.post(
        Endpoint + "/api/store-management/vendor",
        form
      );
      if (response.data.status) {
        return true;
      } else {
        return firetoast(response.data.message, "error", 5000, "top-right");
      }
    } catch (e) {
      console.log(e);
      return firetoast("Something went wrong", "error", 5000, "top-right");
    }
  };
  var submitFormYesPickUp = async () => {
    var [error, errors] = validateStep2Fields();
    if (error) {
      for (let i = 0; i < errors.length; i++) {
        firetoast(errors[i], "error", 3000, "top-right");
      }
    } else {
      var resp = await submitBusinessDetails({
        VendorID: CurrentUser.UserID,
        CompanyName,
        Address1,
        Address2,
        CityID,
        State,
        ZipCode,
        GoogleMapID,
        CountryID,
        PaymentAccount,
        PaymentRouting,
        BusinessEmail,
        BusinessPhone,
        BusinessURL,
        PageURL,
        AllowDelivery,
        GatewayID,
        AllowStorePickup,
        PhoneVerified: "Y",
        EmailVerified: "Y",
        TaxID,
        City,
        GovernmentID,
        CompanyLogo,
        TaxIDPic,
        GovernmentIDPic,
        AdminNote: "",
        ProductApproval: "Y",
        BannerImage,
      });
      if (resp) {
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
          zone_id,
          city_id: CityID,
          area_id,
          pathaoToken: PathaoToken,
        };

        var resp_ = await submitStoreDetails(data);
        if (resp_) {
          firetoast("Created Successfully", "success", 3000, "top-right");
          // setTimeout(() => history.push("/"), 2000);

          var temp = CurrentUser;
          temp.Vendor = "Y";
          localStorage.setItem("user", JSON.stringify(temp));
          setShow(3);
        }
      }
    }
  };

  var Next = () => {
    var [error, errors] = validateStep1Fields();
    if (error) {
      for (let i = 0; i < errors.length; i++) {
        firetoast(errors[i], "error", 3000, "top-right");
      }
    } else {
      setShow(show + 1);
    }
  };
  var Previous = () => {
    setShow(show - 1);
  };

  return (
    <>
      <ToastContainer />
      {ReviewedBySuperAdmin === "Y" ? (
        <VendorRegistrationContext.Provider
          value={{
            CityList,
            StateList,
            CountryList,
            setStoreName,
            setStoreAddress1,
            StoreEmail,
            setStoreEmail,
            setStorePhone,
            setStoreFAX,
            setStoreURL,
            setActive,
            CountryID,
            setStoreCountryID,
            setStoreCityID,
            setStoreCity,
            setStoreState,
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
            CityID,
            setCityID,
            CountryID,
            setCountryID,
            CompanyLogo,
            setCompanyLogo,
            City,
            setCity,
            State,
            setState,
            TaxIDPic,
            setTaxIDPic,
            GovernmentIDPic,
            setGovernmentIDPic,
            GovernmentID,
            setGovernmentID,
            show,
            setShow,
            Active,
            TaxID,
            setTaxID,
            StoreZipCode,
            setStoreZipCode,
            PageURL,
            setPageURL,
            emailChange,
            setEmailChange,
            phoneChange,
            setPhoneChange,
            emailVerify,
            setEmailVerify,
            BusinessEmailVerified,
            setBusinessEmailVerified,
            BusinessPhoneVerified,
            setBusinessPhoneVerified,
            StorePhoneVerified,
            setStorePhoneVerified,
            BannerImage,
            setBannerImage,
            StoreEmailVerified,
            setStoreEmailVerified,
            StoreAddress2,
            StoreAddress1,
            StoreName,
            StorePhone,
            StoreCityID,
            StoreCity,
            setStoreAddress2,
            StoreState,
            StoreCountryID,
            StoreFAX,
            StoreURL,
            StateId,
            setStateId,
            StoreStateId,
            setStoreStateId,
            getStates,
            getCities,
            selectedVendorCountry,
            setSelectedVendorCountry,
            getCitiesByState,
            PathaoToken,
            zone_id,
            setZone_id,
            area_id,
            setArea_id,
          }}
        >
          <SellTopBar />
          <div className="container">
            {isLoading ? (
              <>
                <div
                  className="text-center"
                  style={{ height: "100px", marginTop: "25px" }}
                >
                  <Loading text="Please Wait...." />
                </div>
              </>
            ) : (
              <div className="pt-5 pb-3">
                <div className="row">
                  <div className="col-lg-8 col-md-8 col-sm-12 m-auto">
                    <div className="text-center">
                      <h3 className="ftw-400">Business Registration</h3>
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                      </p>
                    </div>
                    <div className="text-center mt-3">
                      {show === 1 && AllowStorePickup === "Y" && (
                        <img src={Step1} className="img-fluid" />
                      )}
                      {show === 1 && AllowStorePickup === "N" && (
                        <img
                          src={Step11}
                          className="img-fluid"
                          style={{ height: "60px" }}
                        />
                      )}
                      {show === 2 && <img src={Step2} className="img-fluid" />}
                      {show === 3 && <img src={Step3} className="img-fluid" />}
                    </div>
                    {/* {show === 1 && <SellStep1 setShow={setShow} />} */}
                    {show === 1 && <SellStep2 />}
                    {show === 2 && <SellStep3 />}
                    {show === 3 && <SelLStep4 />}
                    <div className="d-flex justify-content-between">
                      {show === 2 && (
                        <button
                          className="btn btn-default-outline btn-lg"
                          onClick={() => Previous()}
                        >
                          Previous
                        </button>
                      )}
                      {AllowStorePickup === "Y" && show < 2 && (
                        <button
                          className="btn btn-default btn-lg"
                          onClick={() => Next()}
                          disabled={
                            // !BusinessPhoneVerified 
                            !BusinessPhoneVerified || !BusinessEmailVerified
                          }
                        >
                          Next
                        </button>
                      )}
                      {show === 2 && (
                        <button
                          className="btn btn-default btn-lg"
                          // disabled={!StoreEmailVerified}
                          onClick={() => submitFormYesPickUp()}
                        >
                          Submit
                        </button>
                      )}
                      {AllowStorePickup === "N" && show === 1 && (
                        <div style={{ float: "right" }}>
                          <button
                            className="btn btn-default btn-lg"
                            onClick={() => submitFormNoPickUp()}
                            disabled={
                               !BusinessPhoneVerified || !BusinessEmailVerified
                              //!BusinessPhoneVerified
                            }
                          >
                            Submit
                          </button>
                        </div>
                      )}
                      {show === 4 && (
                        <div style={{ float: "right" }}>
                          <button
                            className="btn btn-default btn-lg"
                            onClick={() =>
                              history.push(
                                `/panel/viewBusiness/${CurrentUser.UserID}`
                              )
                            }
                            disabled={
                              !BusinessPhoneVerified && !BusinessEmailVerified
                            }
                          >
                            Done <i className="fas fa-check"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </VendorRegistrationContext.Provider>
      ) : (
        <div className="mt-5">
          <div className="container">
            <div className="mt-5 mb-5">
              <img src={logo} className="logo" />
            </div>
            <div className="row pt-5">
              <div className="col-md-8 m-auto text-center">
                <img src={accessdenied} className="img-fluid" />
                <h1 style={{ fontSize: "52px" }} className="mt-4">
                  Access Denied
                </h1>
                <p
                  className="default-p mt-3"
                  style={{ fontSize: "20px", fontWeight: "400" }}
                >
                  It seems your business isn't approved by admin yet, please
                  contact administrator for assistance.
                </p>
                <div>
                  <button
                    className="btn-default btn-notify-curved pl-4 pr-4"
                    onClick={() => (window.location.href = "/")}
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default Sell;
// var getCities = async () => {
//   try {
//     var response = await axios.get(Endpoint + "/api/location/get-city");
//     setCityList(response.data.Cities);
//   } catch (e) {
//     console.log(e);
//   }
// };
// var getCountries = async () => {
//   try {
//     var response = await axios.get(Endpoint + "/api/location/get-country");
//     setCountryList(response.data.Countries);
//   } catch (e) {
//     console.log(e);
//   }
// };
// var getStates = async () => {
//   try {
//     var response = await axios.get(Endpoint + "/api/location/get-state");
//     setStateList(response.data.States);
//   } catch (e) {
//     console.log(e);
//   }
// };