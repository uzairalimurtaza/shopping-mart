import { Link, useHistory, useParams } from "react-router-dom";
import BasicInformation from "./Store Components/BasicInformation";
import { useEffect, useState, useContext } from "react";
import PaymentInformation from "./Store Components/PaymentInformation";
import BusinessInformation from "./Store Components/BusinessInformation";
import StoreInformation from "./Store Components/StoreInformation";
import dummyStore from "../../../../assets/images/dummystore.png";
import VendorRegistrationContext from "./../../../Contexts/VendorRegistrationContext";
import Endpoint from "./../../../../Utils/Endpoint";
import axios from "axios";
import firetoast from "./../../../../Helpers/FireToast";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
function CreateStore() {
  var { id } = useParams();
  const [show, setShow] = useState(1);
  const [CompanyName, setCompanyName] = useState(null);
  const [Address1, setAddress1] = useState(null);
  const [Address2, setAddress2] = useState(null);
  const [ZipCode, setZipCode] = useState(null);
  const [BusinessEmail, setBusinessEmail] = useState("");
  const [BusinessPhone, setBusinessPhone] = useState("");
  const [AllowDelivery, setAllowDelivery] = useState("N");
  const [AllowStorePickup, setAllowStorePickup] = useState("N");
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
  const [StorePhoneVerified, setStorePhoneVerified] = useState(false);
  const [StoreEmailVerified, setStoreEmailVerified] = useState(false);
  const [disable, setDisable] = useState(false);

  const history = useHistory();
  useContext(VendorRegistrationContext);
  useEffect(() => {
    getCities();
    getCountries();
    getStates();
  }, []);
  var getCities = async () => {
    try {
      var response = await axios.get(Endpoint + "/api/location/get-city");
      setCityList(response.data.Cities);
    } catch (e) {
      console.log(e);
    }
  };
  var getCountries = async () => {
    try {
      var response = await axios.get(Endpoint + "/api/location/get-country");
      setCountryList(response.data.Countries);
    } catch (e) {
      console.log(e);
    }
  };
  var getStates = async () => {
    try {
      var response = await axios.get(Endpoint + "/api/location/get-state");
      setStateList(response.data.States);
    } catch (e) {
      console.log(e);
    }
  };
  var Next = () => {
    // var [error, errors] = validateStep1Fields();
    // if (error) {
    //   for (let i = 0; i < errors.length; i++) {
    //     firetoast(errors[i], "error", 3000, "top-right");
    //   }
    // } else {

    // }
    setShow(show + 1);
  };
  var Previous = () => {
    setShow(show - 1);
  };
  var submitFormNoPickUp = async () => {
    var [error, errors] = validateStep1Fields();

    if (error) {
      for (let i = 0; i < errors.length; i++) {
        firetoast(errors[i], "error", 3000, "top-right");
      }
    } else {
      var data = {
        VendorID: id,
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
        BannerImage,
        TaxID,
        City,
        GovernmentID,
        CompanyLogo,
        TaxIDPic,
        GovernmentIDPic,
        AdminNote: "",
        ProductApproval: "Y",
      };
      var response = await submitBusinessDetails(data);
      if (response) {
        firetoast("Created Successfully!", "success", 3000, "top-right");
        setTimeout(() => {
          history.push(`/panel/viewBusiness/${id}`);
        }, 1500);
      }
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
      errors.push("Upload Banner Image!");
    }
    if (CheckEmpty(Address1)) {
      errors.push("Provide address # 1 of your business");
    }
    if (CheckEmpty(CountryID)) {
      errors.push("Please select country");
    }
    if (CheckEmpty(State)) {
      errors.push("State not selected!");
    }
    if (CheckEmpty(City)) {
      errors.push("Please select your city!");
    }
    if (CheckEmpty(ZipCode)) {
      errors.push("Provide page url");
    }
    if (CheckEmpty(TaxID)) {
      errors.push("Tax id not added!");
    }
    if (CheckEmpty(TaxIDPic)) {
      errors.push("Please upload Tax Id picture!");
    }
    if (CheckEmpty(GovernmentID)) {
      errors.push("Provide government id");
    }
    if (CheckEmpty(GovernmentIDPic)) {
      errors.push("Provide government id picture");
    }
    if (CheckEmpty(PaymentAccount)) {
      errors.push("Provide payment account");
    }
    if (CheckEmpty(PaymentRouting)) {
      errors.push("Provide payment routing");
    }
    if (CheckEmpty(BusinessEmail)) {
      errors.push("Provide your business email");
    }
    if (CheckEmpty(BusinessPhone)) {
      errors.push("Provide your business phone");
    }
    if (CheckEmpty(BusinessURL)) {
      errors.push("Provide your business url");
    }
    if (CheckEmpty(GatewayID)) {
      errors.push("Provide Gateway id");
    }
    if (CheckEmpty(PageURL)) {
      errors.push("Provide page url");
    }
   

    if (errors.length > 0) {
      return [true, errors];
    } else {
      return [false, errors];
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
        VendorID: id,
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
        BannerImage,
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
          AdminNote: "",
          ExceptDropOff: "N",
        };

        var resp_ = await submitStoreDetails(data);
        if (resp_) {
          firetoast("Created Successfully", "success", 3000, "top-right");
          setTimeout(() => {
            history.push(`/panel/viewBusiness/${id}`);
          }, 1500);
        }
      }
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
    if (CheckEmpty(StorePhone)) {
      errors.push("Please provide store phone");
    }
    if (CheckEmpty(StoreAddress1)) {
      errors.push("Please provide store address # 1");
    }
    if (CheckEmpty(StoreCountryID)) {
      errors.push("Please select the country");
    }
    if(CheckEmpty(StoreZipCode) || StoreZipCode.length !== 5){
      return firetoast("Please provide a 5 digits valid zipcode", "default-error");
    }
    if (CheckEmpty(StoreState)) {
      errors.push("Store state is not selected");
    }
    if (CheckEmpty(StoreCity)) {
      errors.push("Store city is not selected");
    }
    if (CheckEmpty(StoreFAX)) {
      errors.push("Enter store fax ");
    }
    if (CheckEmpty(StoreURL)) {
      errors.push("Enter store url ");
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
  return (
    <VendorRegistrationContext.Provider
      value={{
        CityList,
        StateList,
        CountryList,
        setStoreName,
        setStoreAddress1,
        setStoreAddress2,
        setStoreEmail,
        setStorePhone,
        setStoreFAX,
        setStoreURL,
        setActive,
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
        setDisable,
        BannerImage,
        setBannerImage,
        StoreEmail,
        StoreEmailVerified,
        setStoreEmailVerified,
      }}
    >
      <div className="mt-5">
        <div className="d-flex justify-content-between">
          <h3 className="ftw-400">Store Management</h3>
        </div>
        <div className="card mt-2">
          <div className="row m-0">
            <div className="col-12">
              <div className="card-body">
                <div className="mt-4 mb-3">
                  <div
                    className="col-lg-5 col-md-8 col-sm-12"
                    style={{ position: "relative" }}
                  >
                    <div className="d-flex cs-admin-tabs justify-content-center">
                      <div className={show === 1 ? "active" : ""}>
                        Business Information
                      </div>
                      <div className={show === 2 ? "active" : ""}>
                        Store Information
                      </div>
                    </div>
                    {/* <div className="cs-admin-tab-bottom"></div> */}
                  </div>
                </div>
                {show === 1 && (
                  <>
                    <BasicInformation />
                  </>
                )}
                {show === 2 && <StoreInformation />}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between m-4">
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
                // disabled={disable}
              >
                Next
              </button>
            )}
            {show === 2 && (
              <button
                className="btn btn-default btn-lg"
                onClick={() => submitFormYesPickUp()}
                // disabled={disable}
              >
                Submit
              </button>
            )}
            {AllowStorePickup === "N" && (
              <div>
                <button
                  className="btn btn-default btn-lg"
                  onClick={() => submitFormNoPickUp()}
                  // disabled={disable}
                >
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </VendorRegistrationContext.Provider>
  );
}
export default CreateStore;
