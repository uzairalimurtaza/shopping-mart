import React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint, { Host_Name, WebUrl } from "./../../../../Utils/Endpoint";
import { useHistory } from "react-router-dom";
import Loading from "./../../../../Utils/Loading";
import PhoneInput from "react-phone-input-2";
import { Collapse } from "reactstrap";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import { CurrentUser } from "./../../../../Helpers/Auth";
import { Button, Modal, ModalFooter } from "reactstrap";
import { ModalHeader } from "reactstrap";
import { ModalBody } from "reactstrap";
import BusinessEmailVerificationModal from "./../../Web App/Sell Components/BusinessEmailVerificationModal";
import moment from "moment";
import { BusinessPhoneVerificationModal } from "./../../Web App/Sell Components/BusinessPhoneVerificationModal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { RequiredField } from "./../../../../Utils/Required-field";
import CreatableSelect from "react-select/creatable";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import Select from "react-select";
function VendorBusinessStoreDetail() {
  var { id } = useParams();
  var history = useHistory();
  const [business, setBusiness] = useState(null);
  const [store, setStore] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [Open1, SetOpen1] = useState(true);
  const [Open2, SetOpen2] = useState(true);
  const [Open3, SetOpen3] = useState(true);
  const [Open4, SetOpen4] = useState(true);
  const [Open5, SetOpen5] = useState(true);
  const [About, setAbout] = useState("");
  const [ShowContent, setShowContent] = useState(true);
  const [Policies, setPolicies] = useState("");
  {
    /*data*/
  }
  const [CompanyName, setCompanyName] = useState("");
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
  const [CompanyLogo2, setCompanyLogo2] = useState(null);
  const [TaxIDPic, setTaxIDPic] = useState(null);
  const [TaxID, setTaxID] = useState(null);
  const [GovernmentIDPic, setGovernmentIDPic] = useState(null);
  const [GovernmentID, setGovernmentID] = useState(null);
  const [PageURL, setPageURL] = useState("");
  const [BannerImage, setBannerImage] = useState("");
  const [ZoneList, setZoneList] = useState([]);

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
  const [ReviewedBySuperAdmin, setReviewedBySuperAdmin] = useState("");
  const [ReviewedByAdmin, setReviewedByAdmin] = useState("");
  const [isAdmin, setIsAdmin] = useState("");
  const [isSuperAdmin, setIsSuperAdmin] = useState("");
  const [modal, setModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailModal2, setEmailModal2] = useState(false);
  const [emailChange, setEmailChange] = useState(false);
  const [StoreEmailVerified, setStoreEmailVerified] = useState(false);
  const [StorePhoneVerified, setStorePhoneVerified] = useState(false);
  const [phoneChange, setPhoneChange] = useState(false);
  const [prevEmail, setPrevEmail] = useState("");
  const [prevPhone, setPrevPhone] = useState("");
  const [phoneModal, setphoneModal] = useState(false);
  const [StoreEmailChange, setStoreEmailChange] = useState(false);
  const [CountryCode, setCountryCode] = useState([]);
  const [ProductApproval, setProductApproval] = useState("Y");
  const [PathaoToken, setPathaoToken] = useState(null);
  const [ZoneId, setZoneId] = useState(null);
  const [AreaList, setAreaList] = useState([]);
  const [AreaId, setAreaId] = useState(null);
  const [ApprovalModal, setApprovalModal] = useState(false);
  const [CommissionRate, setCommissionRate] = useState(0);
  const [StartEffectiveDate, setStartEffectiveDate] = useState(null);
  const [EndEffectiveDate, setEndEffectiveDate] = useState(null);
  const [AdminNoteCommission, setAdminNoteCommission] = useState("");
  const [_VendorComissionRate, _setVendorComissionRate] = useState(null);
  const [Open6, SetOpen6] = useState(true);
  const [Options, setOptions] = useState([]);
  const [SelectedOptions, setSelectedOptions] = useState([]);
  const [SubCategoryAdminNote, setSubCategoryAdminNote] = useState("");
  const [Open7, SetOpen7] = useState(true);
  const [VendorSubCategories, setVendorSubCategories] = useState([]);
  const [SelectedVendorSubCatogories, setSelectedVendorSubCatogories] =
    useState([]);
  const [AllowCOD, setAllowCOD] = useState(null);
  {
    /**/
  }
  useEffect(async () => {
    getPathaoToken();

    setIsAdmin(CurrentUser.Admin);
    setIsSuperAdmin(CurrentUser.SuperAdmin);
    getVendorBusiness();
    getAllStores();
    getCountries();
    setCountryCode(await CountryCodes());
    getSubCategories();
    getVendorSubCategories();
  }, []);
  var getVendorSubCategories = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get-vendorSubCategory/${id}`
      );
      var data = response.data.getVendorSubcategory;
      var temp = [];
      for (var i = 0; i < data.length; i++) {
        temp.push({ label: data[i].SubCategory, value: data[i].SubCategoryID });
      }
      setVendorSubCategories(response.data.getVendorSubcategory);
      setSelectedVendorSubCatogories(temp);
    } catch (e) {
      console.log(e);
      firetoast("Something went wrong", "error", 3000, "top-center");
    }
  };
  var getPathaoToken = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/pathao/get-access-token`
      );
      setPathaoToken(response.data.token);
    } catch (e) {
      console.log(e);
    }
  };
  var getSubCategories = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/category/get-allSubCategory`
      );
      var subs = response.data.SubCategory;
      var _options = [];
      for (let i = 0; i < subs.length; i++) {
        _options.push({
          label: subs[i]["SubCategory"],
          value: subs[i]["SubCategoryID"],
        });
      }
      setOptions(_options);
    } catch (e) {
      firetoast("Something went wrong!", "default-error");
      console.log(e);
    }
  };
  var getCities = async (id) => {
    console.log(id);
    try {
      var response = "";
      var form = new URLSearchParams();
      form.append("CountryID", id);
      if (parseInt(id) === 16) {
        response = await BanglaBazarApi.post(
          Endpoint + "/api/pathao/get-pathao-cities",
          { token: PathaoToken }
        );
        setCityList(response.data.cities);
      } else {
        response = await BanglaBazarApi.post(
          Endpoint + "/api/location/get-vendorAllowedCities",
          form
        );
        setCityList(response.data.Cities);
      }
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
  var getVendorBusiness = async () => {
    setIsLoading(true);
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + `/api/store-management/buisness-details/${id}`
      );
      if (response.data.status) {
        var {
          CompanyName,
          Address1,
          BannerImage,
          Address2,
          ZipCode,
          BusinessEmail,
          BusinessPhone,
          AllowDelivery,
          AllowStorePickup,
          PaymentAccount,
          PaymentRouting,
          BusinessURL,
          CityID,
          GatewayID,
          City,
          State,
          CountryID,
          CompanyLogo,
          TaxIDPic,
          TaxID,
          GovernmentIDPic,
          GovernmentID,
          PageURL,
          AdminNote,
          Active,
          About,
          ReviewedByAdmin,
          ReviewedBySuperAdmin,
          Policies,
          ProductApproval,
          VendorCodStatus,
        } = response.data.business;
        setProductApproval(ProductApproval);

        setReviewedByAdmin(ReviewedByAdmin);
        setReviewedBySuperAdmin(ReviewedBySuperAdmin);
        setBusiness(response.data.business);
        setCompanyName(CompanyName);
        setAddress1(Address1);
        setAddress2(Address2);
        setZipCode(ZipCode);
        setBannerImage(BannerImage);
        setBusinessEmail(BusinessEmail);
        setPrevEmail(BusinessEmail);
        setBusinessPhone(BusinessPhone);
        setPrevPhone(BusinessPhone);
        setAllowDelivery(AllowDelivery);
        setAllowStorePickup(AllowStorePickup);
        setPaymentAccount(PaymentAccount);
        setPaymentRouting(PaymentRouting);
        setBusinessURL(BusinessURL);
        setGatewayID(GatewayID);
        setCityID(CityID);
        setCity(City);
        setState(State);
        setCompanyLogo(CompanyLogo);
        setCompanyLogo2(CompanyLogo);
        setCountryID(CountryID);
        setTaxIDPic(TaxIDPic);
        setTaxID(TaxID);
        setGovernmentIDPic(GovernmentIDPic);
        setGovernmentID(GovernmentID);
        setPageURL(PageURL);
        setAdminNote(AdminNote);
        setPolicies(Policies ? Policies : "Place Text Here!");
        setAbout(About ? About : "Place Text Here!");
        setIsLoading(false);
        setStoreCountryID(CountryID);
        getStates(CountryID);
        getCities(CountryID);
        _setVendorComissionRate(response.data.vendorCommissionRate);
        setAllowCOD(VendorCodStatus === "Y" ? true : false);
      } else {
        setBusiness(null);
        setIsLoading(false);
        history.push(`/sell`);
      }
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      firetoast("Something went wrong!", "error", 4000, "top-right");
    }
  };
  var getAllStores = async () => {
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + `/api/store-management/store-details/${id}`
      );

      setStore(response.data.Store);
      if (response.data.Store.length > 0) {
        setShowContent(false)
      }
    } catch (e) {
      firetoast("Something went wrong!", "error", 4000, "top-right");
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
    if (CheckEmpty(Address1)) {
      errors.push("Provide address # 1 of your business");
    }
    if (CheckEmpty(CountryID)) {
      errors.push("Please select country");
    }
    if (CheckEmpty(ZipCode)) {
      errors.push("Provide zipcode");
    }
    // if (CheckEmpty(State)) {
    //   errors.push("State not selected!");
    // }
    // if (CheckEmpty(City)) {
    //   errors.push("Please select your city!");
    // }
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
    // if (CheckEmpty(BusinessURL)) {
    //   errors.push("Provide your business url");
    // }
    if (CheckEmpty(GatewayID)) {
      errors.push("Provide Gateway id");
    }
    // if (CheckEmpty(PageURL)) {
    //   errors.push("Provide page url");
    // }

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
      var response = await BanglaBazarApi.put(
        Endpoint + `/api/store-management/update-buisness/${id}`,
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
        AdminNote,
        TaxID,
        City,
        GovernmentID,
        CompanyLogo,
        TaxIDPic,
        GovernmentIDPic,
        ProductApproval,
        PhoneVerified: "Y",
        EmailVerified: "Y",
        BannerImage,
        Active,
        About,
        Policies,
      };
      var response = await submitBusinessDetails(data);
      if (response) {
        firetoast("Created Successfully!", "success", 3000, "top-right");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
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
  var submitFormYesPickUp = async () => {
    var [error, errors] = validateStep1Fields();
    // var [error2, errors2] = validateStep2Fields();

    if (error) {
      for (let i = 0; i < errors.length; i++) {
        firetoast(errors[i], "error", 3000, "top-right");
      }
      return;
    } else if (store.length < 1) {
      firetoast("Please add atleast One Store", "error", 3000, "top-right");
      return;
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
        TaxID,
        City,
        GovernmentID,
        BannerImage,
        CompanyLogo,
        TaxIDPic,
        GovernmentIDPic,
        PhoneVerified: "Y",
        EmailVerified: "Y",
        AdminNote,
        ProductApproval: "Y",
        Active,
        About,
        Policies,
      });
      if (resp) {
        firetoast("Updated Successfully", "success", 3000, "top-right");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
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
    if (CheckEmpty(StorePhone) || StorePhone.length !== 11) {
      errors.push("Please provide 11 digits valid store phone starting with 0");
    }
    if (CheckEmpty(StoreAddress1) || StoreAddress1.length < 15 || StoreAddress1.length > 120) {
      errors.push("Please provide store address #1 between 15 and 120 characters.");
    }
    if (CheckEmpty(StoreCountryID)) {
      errors.push("Please select the store country");
    }
    if (CheckEmpty(StoreZipCode)) {
      errors.push("Please provide store zip code");
    }
    if (CheckEmpty(AreaId)) {
      errors.push("Store area is not selected");
    }
    if (CheckEmpty(StoreCity)) {
      errors.push("Store city is not selected");
    }
    if (CheckEmpty(ZoneId)) {
      errors.push("Store zone is not selected");
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
      var response = await BanglaBazarApi.put(
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
  var submitStoreDetails = async (data) => {
    try {
      var form = new URLSearchParams();
      for (var key in data) {
        form.append(key, data[key]);
      }
      var response = await BanglaBazarApi.post(
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
      var data = "";
      if (parseInt(CountryID) === 16) {
        data = {
          VendorID: business.VendorID,
          StoreName,
          Address1: StoreAddress1,
          Address2: StoreAddress2,
          city_id: CityID,
          zone_id: ZoneId,
          area_id: AreaId,
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
          pathaoToken: PathaoToken,
          CityID: StoreCityID,
        };
      } else {
        data = {
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
        };
      }
      // console.log(data);
      var resp_ = await submitStoreDetails(data);
      if (resp_) {
        firetoast("Created Successfully", "success", 3000, "top-right");

        setModal(!modal);
        getAllStores();
      }
    }
  };
  var setSuperAdminApproval = async () => {
    setApprovalModal(true);
    // try {
    //   var response = await BanglaBazarApi.put(
    //     `${Endpoint}/api/admin/update-vendorSuperAdminStatus/${id}`
    //   );
    //   if (response.data.status) {
    //     getVendorBusiness();
    //     firetoast("Store Approved", "success", 3000, "top-right");
    //   } else {
    //     firetoast(
    //       response.data.error || response.data.message,
    //       "error",
    //       3000,
    //       "top-right"
    //     );
    //   }
    // } catch (e) {
    //   console.log(e);
    //   firetoast(
    //     "Error while updating vendor store",
    //     "error",
    //     3000,
    //     "top-right"
    //   );
    // }
  };
  var removeSubCategory = async (item) => {
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/delete-vendorSubCategory`,
        {
          SubCategoryID: item.SubCategoryID,
          VendorID: id,
          ID: item.ID,
        }
      );

      if (response.data.status) {
        getVendorSubCategories();
        firetoast(
          "SubCategory removed successfully!",
          "success",
          3000,
          "top-center"
        );
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      console.log(e);
      firetoast("Something went wrong", "default-error");
    }
  };
  var ApproveVendorBusiness = async () => {
    if (!CommissionRate) {
      return firetoast(
        "Commission rate is required",
        "error",
        3000,
        "top-center"
      );
    }
    if (!StartEffectiveDate) {
      return firetoast(
        "Effective start date is required",
        "error",
        3000,
        "top-center"
      );
    }
    if (!EndEffectiveDate) {
      return firetoast(
        "Effective end date is required",
        "error",
        3000,
        "top-center"
      );
    }
    if (SelectedOptions.length < 1) {
      return firetoast(
        "Select atleast one sub category",
        "error",
        3000,
        "top-center"
      );
    }
    if (CheckEmpty(SubCategoryAdminNote)) {
      return firetoast(
        "Admin note shouldn't be empty",
        "error",
        3000,
        "top-center"
      );
    }
    var SubCategoryID = [];
    for (let i = 0; i < SelectedOptions.length; i++) {
      SubCategoryID.push(SelectedOptions[i].value);
    }
    try {
      var response;
      var data = {
        CommissionRate: CommissionRate,
        EffectiveStartDate: StartEffectiveDate,
        EffectiveEndDate: EndEffectiveDate,
        AdminNote: AdminNoteCommission,
        SubCategoryID,
        SubCategoryNote: SubCategoryAdminNote,
      };

      response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/update-vendorSuperAdminStatus/${id}`,
        data
      );

      if (response.data.status) {
        setApprovalModal(false);
        getVendorBusiness();
        firetoast("Store Approved", "success", 3000, "top-right");
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      firetoast("Something went wrong!", "default-error");
    }
  };
  var setAdminApproval = async () => {
    try {
      var response = await BanglaBazarApi.put(
        `${Endpoint}/api/admin/update-vendorAdminStatus/${id}`
      );
      if (response.data.status) {
        firetoast("Marked as Reviewed", "success", 3000, "top-right");
        getVendorBusiness();
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      console.log(e);
      firetoast(
        "Error while updating vendor store",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var ApprovalButtons = () => {
    if (isSuperAdmin === "Y") {
      return (
        <>
          {ReviewedBySuperAdmin !== "Y" && (
            <Link
              to="#"
              className="btn btn-md btn-success"
              style={{ marginRight: "10px" }}
              onClick={() => setSuperAdminApproval()}
            >
              Approve Store
            </Link>
          )}
        </>
      );
    } else if (isAdmin === "Y") {
      return (
        <>
          {ReviewedByAdmin !== "Y" && (
            <Link
              to="#"
              className="btn btn-md btn-success"
              style={{ marginRight: "10px" }}
              onClick={() => setAdminApproval()}
            >
              Mark As Reviewed
            </Link>
          )}
        </>
      );
    } else {
      return null;
    }
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
  var updateCommissionRate = async () => {
    try {
      var data = { ..._VendorComissionRate };
      data["VendorID"] = id;
      data["EffectiveEndDate"] = moment(data["EffectiveEndDate"]).toISOString();

      data["EffectiveStartDate"] = moment(
        data["EffectiveStartDate"]
      ).toISOString();
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/update-commissionRate`,
        data
      );
      if (response.data.status) {
        firetoast("Commission rate updated!", "success", 3000, "top-center");
        getVendorBusiness();
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-center"
        );
      }
    } catch (e) {
      firetoast("Something went wrong", "default-error");
    }
  };
  var updateVendorSubCategories = async () => {
    try {
      var temp = [];
      for (var i = 0; i < SelectedVendorSubCatogories.length; i++) {
        temp.push(SelectedVendorSubCatogories[i].value);
      }
      var obj = {
        VendorID: id,
        SubCategoryID: temp,
        SubCategoryNote: SubCategoryAdminNote,
      };
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/update-vendorSubCategory`,
        obj
      );
      if (response.data.status) {
        firetoast(
          "SubCategory updated successfully!",
          "success",
          3000,
          "top-center"
        );
        getVendorSubCategories();
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      console.log(e);
    }
  };
  var ChangeCODServiceStatus = async (e) => {
    var Status = e.target.checked ? "Y" : "N";
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/update-vendorCodStatus`,
        {
          VendorID: id,
          Status,
        }
      );

      if (response.data.status) {
        firetoast("Service status changed!", "success", 3000, "top-center");
        setAllowCOD(e.target.checked);
      } else {
        var { message, error } = response.data;

        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast(
        "Something went wrong while changing COD service status",
        "default-error"
      );
    }
  };
  return (
    <div>
      {isLoading ? (
        <Loading text="Please Wait" />
      ) : (
        <>
          <div className="d-flex justify-content-between mt-5">
            <h3 className="ftw-400">Business Details</h3>
            {/* <Button
          className="btn-default"
          onClick={() => history.push("/panel/createStore")}
        >
          <i className="fas fa-store"></i> Create Store
        </Button> */}
          </div>
          <div className="card mt-2">
            <div className="card-body">
              <div
                className="d-flex justify-content-between"
                style={{ alignItems: "center" }}
              >
                <div className="d-flex" style={{ alignItems: "center" }}>
                  {" "}
                  <img
                    src={`${Endpoint}/${CompanyLogo2}`}
                    alt="Company Logo"
                    //   className="img-fluid"
                    style={{
                      borderRadius: "100px",
                      height: "100px",
                      width: "100px",
                    }}
                  />{" "}
                  <h4 className="ftw-400 " style={{ marginLeft: "20px" }}>
                    {CompanyName}
                  </h4>
                </div>
                <div>
                  {ApprovalButtons()}
                  {/* <Link
                    to="#"
                    className="btn btn-md btn-success"
                    style={{ marginRight: "10px" }}
                    onClick={() => history.push(`/panel/vendor/subcategories`)}
                  >
                    Manage SubCategories
                  </Link> */}
                  <Link
                    to="#"
                    className="btn btn-md btn-success"
                    onClick={() =>
                      (window.location.href = `${WebUrl}${PageURL}`)
                    }
                  >
                    View Store
                  </Link>
                  <Link
                    to="#"
                    style={{ marginLeft: "10px" }}
                    className="btn btn-md btn-success"
                    onClick={() =>
                      history.push(`/panel/userEdit/${CurrentUser.UserID}`)
                    }
                  >
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="mt-3">
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
                                  navigator.clipboard.writeText(
                                    `${Host_Name}${PageURL}`
                                  );
                                  firetoast(
                                    "Copied",
                                    "success",
                                    1000,
                                    "top-center"
                                  );
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
                          {!CheckEmpty(CompanyLogo) &&
                            (
                              <a
                                href={`${Endpoint}/${CompanyLogo}`}
                                target="_blank"
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                            )}
                          <input
                            className="form-control"
                            type="file"
                            onChange={(e) => setCompanyLogo(e.target.files[0])}
                          />
                        </div>
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>
                            Company Banner <RequiredField />
                          </label>{" "}
                          {!CheckEmpty(BannerImage) &&
                            typeof TaxIDPic !== "object" && (
                              <a
                                href={`${Endpoint}/${BannerImage}`}
                                target="_blank"
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                            )}
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
                          <label>
                            Country <RequiredField />
                          </label>
                          <select
                            className="form-control"
                            onChange={(e) => {
                              setCountryID(e.target.value);
                              getStates(e.target.value);
                              getCities(e.target.value);
                              setState("");
                              setCity("");
                              setCityID("");
                            }}
                          >
                            <option>Select...</option>
                            {CountryList.map((item, index) => (
                              <option
                                value={item.CountryID}
                                key={index}
                                selected={CountryID === item.CountryID}
                              >
                                {item.Country}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>State / District / Province</label>
                          {/* <CreatableSelect
                            isClearable
                            value={{ label: State, value: State }}
                            onChange={async (e) => {
                              if (e) {
                                if (e.__isNew__) {
                                  // var value = await createCity(e);
                                  setState(e.label);
                                  // setCityID(value);
                                  // setselectedCity(e);
                                } else {
                                  setState(e.label);

                                  // setselectedCity(e);
                                }
                              } else {
                                // setselectedCity(null);
                                setState("");
                              }
                            }}
                            // onInputChange={(e) => console.log(e)}
                            options={CityList}
                          /> */}
                          {StateList.length > 0 ? (
                            <select
                              className="form-control"
                              onChange={(e) => {
                                setState(JSON.parse(e.target.value).State);
                                getCitiesByState(
                                  JSON.parse(e.target.value).StateID
                                );
                              }}
                            >
                              <option>Select...</option>
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
                          <label>City</label>
                          {/* <CreatableSelect
                            value={{ label: City, value: CityID }}
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
                              type="text"
                              placeholder="Enter City"
                              onChange={(e) => {
                                var item = JSON.parse(e.target.value);
                                setCity(item.PathaoCityName);
                                setCityID(item.DBCityID);
                              }}
                            >
                              <option>Select City</option>
                              {CityList.map((item, index) => (
                                <option
                                  key={index}
                                  value={JSON.stringify(item)}
                                  selected={City === item.PathaoCityName}
                                >
                                  {item.PathaoCityName}
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
                      </div>
                      <div className="row mt-4">
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
                          <label>Tax ID Picture</label>{" "}
                          {!CheckEmpty(TaxIDPic) &&
                            typeof TaxIDPic !== "object" && (
                              <a
                                href={`${Endpoint}/${TaxIDPic}`}
                                target="_blank"
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                            )}
                          <input
                            className="form-control"
                            type="file"
                            onChange={(e) => setTaxIDPic(e.target.files[0])}
                          />
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>Government ID / NIC</label>
                          <input
                            className="form-control"
                            type="text"
                            placeholder="Enter Government ID"
                            value={GovernmentID}
                            onChange={(e) => setGovernmentID(e.target.value)}
                          />
                        </div>
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>Government ID Picture</label>{" "}
                          {!CheckEmpty(GovernmentIDPic) &&
                            typeof GovernmentIDPic !== "object" && (
                              <a
                                href={`${Endpoint}/${GovernmentIDPic}`}
                                target="_blank"
                              >
                                <i className="fas fa-eye"></i>
                              </a>
                            )}
                          <input
                            className="form-control"
                            type="file"
                            onChange={(e) =>
                              setGovernmentIDPic(e.target.files[0])
                            }
                          />
                        </div>
                      </div>
                      {/* <div className="row mt-4">
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>Page Url</label>
                          <input
                            className="form-control"
                            type="text"
                            value={PageURL}
                            onChange={(e) => setPageURL(e.target.value)}
                          />
                        </div>
                      </div> */}
                      {(CurrentUser.SuperAdmin === "Y" ||
                        CurrentUser.Admin === "Y") && (
                          <div className="row mt-4">
                            <div className="col-lg-12 col-xl-12 col-md-11112 col-sm-12 col-xs-12">
                              <label>Admin Note</label>{" "}
                              <textarea
                                className="form-control"
                                value={AdminNote}
                                onChange={(e) => setAdminNote(e.target.value)}
                              />
                            </div>
                          </div>
                        )}
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
                          <label>
                            Business Email <RequiredField />
                          </label>
                          <input
                            className="form-control"
                            type="email"
                            defaultValue={BusinessEmail}
                            onChange={(e) => {
                              if (e.target.value !== prevEmail) {
                                setEmailChange(true);
                              } else {
                                setEmailChange(false);
                              }
                              setBusinessEmail(e.target.value);
                            }}
                          />
                          {!StoreEmailVerified &&
                            emailChange &&
                            !CheckEmpty(BusinessEmail) && (
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
                          <label>
                            Business Phone <RequiredField />
                          </label>
                          <PhoneInput
                            value={BusinessPhone}
                            country={"bd"}
                            onlyCountries={CountryCode}
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
                              if (e !== prevPhone) {
                                setPhoneChange(true);
                              } else {
                                setPhoneChange(false);
                              }
                              setBusinessPhone("+" + e);
                            }}
                          />
                          {BusinessPhone !== prevPhone &&
                            !StorePhoneVerified &&
                            phoneChange &&
                            !CheckEmpty(phoneChange) && (
                              <>
                                <Link
                                  to="#"
                                  className="text-default mt-2"
                                  onClick={() => {
                                    setphoneModal(!phoneModal);
                                  }}
                                >
                                  Verify
                                </Link>{" "}
                                your Phone Number
                              </>
                            )}
                          <BusinessPhoneVerificationModal
                            phoneVerify={phoneModal}
                            setPhoneVerify={setphoneModal}
                            phoneToBeVerified={BusinessPhone}
                            setPhoneStatus={setStorePhoneVerified}
                          />
                        </div>
                      </div>
                      <div className="row mt-4">
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>
                            Business URL <small>(Optional)</small>
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
                        {(CurrentUser.SuperAdmin === "Y" ||
                          CurrentUser.Admin === "Y") && (
                            <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                              <label>Prodouct Approval</label>
                              <div
                                className="d-flex"
                                style={{ alignItems: "end" }}
                              >
                                <div className="cs-bi-radios">
                                  <label>
                                    <input
                                      type="radio"
                                      className="cs-bi-radios-input"
                                      name="ProductApproval"
                                      defaultChecked={ProductApproval === "Y"}
                                      onChange={() => setProductApproval("Y")}
                                    />{" "}
                                    Yes
                                  </label>
                                </div>
                                <div className="cs-bi-radios">
                                  <label>
                                    <input
                                      type="radio"
                                      className="cs-bi-radios-input"
                                      name="ProductApproval"
                                      defaultChecked={ProductApproval === "N"}
                                      onChange={() => setProductApproval("N")}
                                    />{" "}
                                    No
                                  </label>
                                </div>
                              </div>
                            </div>
                          )}
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
              {AllowStorePickup === "Y" && (
                <>
                  <div className="mt-4">
                    <h4 className="ftw-400 text-default">Store Locations</h4>
                    <div className="card cstore-card">
                      <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
                        <h6 className="ftw-400">Store List</h6>
                        <button onClick={() => SetOpen4(!Open4)}>
                          {Open3 ? (
                            <i className="fas fa-angle-up text-default"></i>
                          ) : (
                            <i className="fas fa-angle-down text-default"></i>
                          )}
                        </button>
                      </div>
                      <Collapse isOpen={Open4}>
                        <div className="card-body mb-5">
                          {store.length > 0 ? (
                            <div className="table-responsive">
                              <div style={{ float: "right" }}>
                                <button
                                  className="btn btn-success btn-md "
                                  onClick={() => setModal(!modal)}
                                >
                                  <i className="fas fa-plus"></i> Add Store
                                  Location{" "}
                                </button>
                              </div>
                              <table
                                className="table table-borderless"
                                id="myTable"
                              >
                                <thead>
                                  <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Address# 1</th>
                                    <th>Address# 2</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>ZipCode</th>
                                    <th>Store FAX</th>
                                    <th>Last Update</th>

                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {store.length > 0 &&
                                    store.map((item, index) => (
                                      <tr key={index}>
                                        <td className="pt-18">
                                          {item.StoreName}
                                        </td>
                                        <td className="pt-18">
                                          {item.StoreEmail}
                                        </td>
                                        <td className="pt-18">
                                          {item.StorePhone}
                                        </td>
                                        <td className="pt-18">
                                          {item.Address1}
                                        </td>
                                        <td className="pt-18">
                                          {item.Address2}
                                        </td>
                                        <td className="pt-18">{item.City}</td>
                                        <td className="pt-18">{item.State}</td>
                                        <td className="pt-18">
                                          {item.ZipCode}
                                        </td>

                                        <td className="pt-18">
                                          {item.StoreFAX}
                                        </td>
                                        <td className="pt-18">
                                          {moment(item.LastUpdate).format(
                                            "DD-MM-YYYY"
                                          )}
                                        </td>

                                        <td>
                                          <button className="btn btn-light">
                                            <i
                                              className="far fa-edit text-dark"
                                              onClick={() => {
                                                history.push(
                                                  `/panel/update-single-store/${index}/${item.VendorID}/${BusinessEmail}`
                                                );
                                              }}
                                            ></i>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="text-center mt-4">
                              No Store Data Exist{" "}
                              <button
                                className="btn btn-success btn-sm "
                                onClick={() => setModal(!modal)}
                              >
                                <i className="fas fa-plus"></i> Add Store
                                Location{" "}
                              </button>
                            </div>
                          )}
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </>
              )}
              <div className="mt-3">
                <div className="card cstore-card">
                  <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
                    <h6 className="ftw-400">Others</h6>
                    <button onClick={() => SetOpen5(!Open5)}>
                      {Open3 ? (
                        <i className="fas fa-angle-up text-default"></i>
                      ) : (
                        <i className="fas fa-angle-down text-default"></i>
                      )}
                    </button>
                  </div>
                  <Collapse isOpen={Open5}>
                    {" "}
                    <div className="card-body mb-5">
                      <h4 className="ftw-400 text-default">About Store</h4>
                      <div>
                        <CKEditor
                          editor={ClassicEditor}
                          data={About}
                          // onReady={(editor) => {
                          //   // You can store the "editor" and use when it is needed.
                          //   console.log("Editor is ready to use!", editor);
                          // }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setAbout(data);
                          }}
                        // onBlur={(event, editor) => {
                        //   console.log("Blur.", editor);
                        // }}
                        // onFocus={(event, editor) => {
                        //   console.log("Focus.", editor);
                        // }}
                        />
                      </div>
                    </div>
                    <div className="card-body mb-5">
                      <h4 className="ftw-400 text-default">Store Policies</h4>
                      <div>
                        <CKEditor
                          editor={ClassicEditor}
                          data={Policies}
                          // onReady={(editor) => {
                          //   // You can store the "editor" and use when it is needed.
                          //   console.log("Editor is ready to use!", editor);
                          // }}
                          onChange={(event, editor) => {
                            const data = editor.getData();
                            setPolicies(data);
                          }}
                        // onBlur={(event, editor) => {
                        //   console.log("Blur.", editor);
                        // }}
                        // onFocus={(event, editor) => {
                        //   console.log("Focus.", editor);
                        // }}
                        />
                      </div>
                    </div>
                    <div className="card-body mb-5">
                      <h4 className="ftw-400 text-default">COD Service</h4>
                      <div>
                        <div className="d-flex" style={{ alignItems: "end" }}>
                          <label>
                            <input
                              className="form-check-input default-check-color"
                              type="checkbox"
                              name="CODService"
                              defaultChecked={AllowCOD && AllowCOD}
                              onChange={(e) => ChangeCODServiceStatus(e)}
                            />{" "}
                            Allow COD service as payment option
                          </label>
                        </div>
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
              {_VendorComissionRate && (
                <div className="mt-3">
                  <h4 className="ftw-400 text-default">
                    Commission Information
                  </h4>
                  <div className="card cstore-card">
                    <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
                      <h6 className="ftw-400">Vendor Commission Rate</h6>
                      <button onClick={() => SetOpen6(!Open6)}>
                        {Open6 ? (
                          <i className="fas fa-angle-up text-default"></i>
                        ) : (
                          <i className="fas fa-angle-down text-default"></i>
                        )}
                      </button>
                    </div>
                    <Collapse isOpen={Open6}>
                      <div className="card-body mb-5">
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                            <div class="form-group">
                              <label for="exampleInputEmail1">
                                Commission Rate
                              </label>
                              <input
                                type="number"
                                class="form-control"
                                min={0}
                                max={100}
                                defaultValue={
                                  _VendorComissionRate &&
                                  parseFloat(
                                    _VendorComissionRate["CommissionRate"]
                                  )
                                }
                                onChange={(e) => {
                                  var temp = { ..._VendorComissionRate };
                                  temp["CommissionRate"] = e.target.value;
                                  _setVendorComissionRate(temp);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                            <div class="form-group">
                              <label for="exampleInputEmail1">
                                Effective Start Date
                              </label>
                              <input
                                type="datetime-local"
                                class="form-control"
                                defaultValue={
                                  _VendorComissionRate &&
                                  moment(
                                    _VendorComissionRate["EffectiveStartDate"]
                                  ).format("YYYY-MM-DDTHH:mm:ss")
                                }
                                onChange={(e) => {
                                  var temp = { ..._VendorComissionRate };
                                  temp["EffectiveStartDate"] = e.target.value;
                                  _setVendorComissionRate(temp);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                            <div class="form-group">
                              <label for="exampleInputEmail1">
                                Effective End Date
                              </label>
                              <input
                                type="datetime-local"
                                class="form-control"
                                defaultValue={
                                  _VendorComissionRate &&
                                  moment(
                                    _VendorComissionRate["EffectiveEndDate"]
                                  ).format("YYYY-MM-DDTHH:mm:ss")
                                }
                                onChange={(e) => {
                                  var temp = { ..._VendorComissionRate };
                                  temp["EffectiveEndDate"] = e.target.value;
                                  _setVendorComissionRate(temp);
                                }}
                              />
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                            <div class="form-group">
                              <label for="exampleInputEmail1">Note</label>
                              <textarea
                                className="form-control"
                                defaultValue={
                                  _VendorComissionRate &&
                                  _VendorComissionRate["AdminNote"]
                                }
                                onChange={(e) => {
                                  var temp = { ..._VendorComissionRate };
                                  temp["AdminNote"] = e.target.value;
                                  _setVendorComissionRate(temp);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className=" mt-2">
                          <button
                            className="btn btn-default"
                            onClick={() => updateCommissionRate()}
                          >
                            Update Commission Rate
                          </button>
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              )}
              <div className="mt-3">
                <h4 className="ftw-400 text-default">
                  Vendor SubCategories Detail
                </h4>
                <div className="card cstore-card">
                  <div className="card-header d-flex justify-content-between cstore-cardheader mt-2 mb-2">
                    <h6 className="ftw-400">Vendor SubCategories </h6>
                    <button onClick={() => SetOpen7(!Open7)}>
                      {Open7 ? (
                        <i className="fas fa-angle-up text-default"></i>
                      ) : (
                        <i className="fas fa-angle-down text-default"></i>
                      )}
                    </button>
                  </div>
                  <Collapse isOpen={Open7}>
                    <div className="card-body mb-5">
                      <div className="row">
                        {VendorSubCategories.map((item, index) => (
                          <div className="col-3" key={index}>
                            <button
                              type="button"
                              class="btn btn-outline-success"
                            >
                              {item.SubCategory}{" "}
                              <span
                                class="badge bg-light"
                                onClick={() => removeSubCategory(item)}
                              >
                                <i class="fas fa-times text-dark"></i>
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 row alin-items-center">
                        <div className="col-6">
                          <label>SubCategories</label>
                          <Select
                            options={Options}
                            isMulti
                            value={SelectedVendorSubCatogories}
                            onChange={(e) => setSelectedVendorSubCatogories(e)}
                          />
                        </div>
                        <div className="col-6">
                          <label>Admin Note</label>
                          <textarea
                            className="form-control"
                            onChange={(e) =>
                              setSubCategoryAdminNote(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="mt-2 row alin-items-center">
                        <div className="col-6">
                          <button
                            className="btn btn-default"
                            onClick={() => updateVendorSubCategories()}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                      {/* <div className=" mt-2">
                        <button
                          className="btn btn-default"
                          // onClick={() => updateCommissionRate()}
                        >
                          Update SubCategories
                        </button>
                      </div> */}
                    </div>
                  </Collapse>
                </div>
              </div>
              <div className="d-flex justify-content-between mt-2">
                {/* <button className="btn btn-success">Add New</button> */}
                <div></div>

                {
                  ShowContent ?
                    <><h2 className=" text-danger font-weight-bold ">Store is not approved by Pathao yet </h2></>
                    : <></>
                }


                <button
                  className="btn btn-success"
                  disabled={
                    (emailChange && !StoreEmailVerified) ||
                    (phoneChange && !StorePhoneVerified) || !store.length
                  }

                  onClick={() => {
                    if (AllowStorePickup === "Y") {
                      submitFormYesPickUp();
                    } else {
                      submitFormNoPickUp();
                    }

                  }}
                >
                  Save Changes
                </button>

              </div>
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
                              setStoreEmailChange(false);
                              setStoreEmailVerified(true);
                              setStoreEmail(e.target.value);
                            } else {
                              setStoreEmailChange(true);
                              setStoreEmail(e.target.value);
                            }
                          }}
                        />
                        {!StoreEmailVerified &&
                          StoreEmailChange &&
                          !CheckEmpty(StoreEmail) && (
                            <>
                              <Link
                                to="#"
                                className="text-default mt-2"
                                onClick={() => setEmailModal2(!emailModal2)}
                              >
                                Verify
                              </Link>{" "}
                              your Email Address
                            </>
                          )}
                        <BusinessEmailVerificationModal
                          emailVerify={emailModal2}
                          setEmailVerify={setEmailModal2}
                          setEmailVerified={setStoreEmailVerified}
                          status="3"
                          email={StoreEmail}
                        />
                      </div>
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                        <label>Store Phone <RequiredField /></label>
                        {/* {CountryCode.length > 0 && (
                          <PhoneInput
                            value={""}
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
                            
                          />
                        )} */}
                        <input
                          onChange={(e) => setStorePhone(e.target.value)}
                          placeholder="Store Phone Number"
                          type="Number"
                          className="form-control"
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
                        >
                          {CountryList &&
                            CountryList.map((item, index) => (
                              <option
                                value={item.CountryID}
                                key={index}
                                disabled
                                selected={item.CountryID === CountryID}
                              >
                                {" "}
                                {item.Country}
                              </option>
                            ))}
                        </select>
                        <> It will be same as your store country </>
                      </div>
                    </div>
                    {parseInt(CountryID) !== 16 && (
                      <div className="row mt-4">
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>State /District/Province</label>
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
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>City <RequiredField /></label>
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
                          {CityList.length > 0 ? (
                            <select
                              className="form-control"
                              type="text"
                              placeholder="Enter City"
                              onChange={(e) => {
                                if (e.target.value === "select") {
                                  return e.preventDefault()
                                }
                                var item = JSON.parse(e.target.value);
                                setStoreCity(item.City);
                                setStoreCityID(item.CityID);
                              }}
                            >
                              <option value="select">Select City</option>
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
                      </div>
                    )}
                    {parseInt(CountryID) === 16 && (
                      <div className="row mt-4">
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>City <RequiredField /></label>

                          <select
                            className="form-control"
                            type="text"
                            placeholder="Enter City"
                            onChange={(e) => {
                              if (e.target.value === "select") {
                                return e.preventDefault()
                              }
                              var item = JSON.parse(e.target.value);
                              getZones(item);
                              setStoreCity(item.PathaoCityName);
                              setStoreCityID(item.DBCityID);
                            }}
                          >
                            <option value="select">Select City</option>
                            {CityList &&
                              CityList.map((item, index) => (
                                <option
                                  key={index}
                                  value={JSON.stringify(item)}
                                >
                                  {item.PathaoCityName}
                                </option>
                              ))}
                          </select>
                        </div>
                        <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                          <label>Zone <RequiredField /></label>

                          <select
                            className="form-control"
                            onChange={(e) => {
                              if (e.target.value === "select") {
                                return e.preventDefault()
                              }
                              var item = JSON.parse(e.target.value);
                              setZoneId(item.zone_id);
                              getAreas(item);
                            }}
                          >
                            <option value="select">Select Zone </option>
                            {ZoneList.map((item, index) => (
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
                            onChange={(e) => {
                              if (e.target.value === "select") {
                                return e.preventDefault()
                              }
                              var item = JSON.parse(e.target.value);
                              setAreaId(item.area_id);
                            }}
                          >
                            <option value="select">Select Zone </option>
                            {AreaList.map((item, index) => (
                              <option key={index} value={JSON.stringify(item)}>
                                {item.area_name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
                    <div className="row mt-4">
                      <div className="col-lg-6 col-xl-6 col-md-6 col-sm-12 col-xs-12">
                        <label>ZipCode <RequiredField /></label>
                        <input
                          className="form-control"
                          type="text"
                          value={StoreZipCode}
                          onChange={(e) =>

                            setStoreZipCode(e.target.value)}
                          placeholder="Enter Zipcode"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div>
                  <span>
                    {" "}
                    {!StoreEmailChange && !CheckEmpty(StoreEmail) && (
                      <span
                        className="text-danger"
                        style={{ marginRight: "10px" }}
                      >
                        Verify your store email
                      </span>
                    )}
                    <Button
                      color="success"
                      onClick={() => submitStore()}
                      disabled={!StoreEmailVerified}
                    >
                      Create
                    </Button>{" "}
                  </span>
                </div>
              </ModalFooter>
            </Modal>
            <BusinessEmailVerificationModal
              emailVerify={emailModal}
              setEmailVerify={setEmailModal}
              setEmailVerified={setStoreEmailVerified}
              status="3"
              email={BusinessEmail}
            />
            <Modal
              toggle={() => setApprovalModal(!ApprovalModal)}
              isOpen={ApprovalModal}
              size="lg"
            >
              <ModalHeader toggle={() => setApprovalModal(!ApprovalModal)}>
                {" "}
                <h4 className="ftw-400">Vendor Approval</h4>
              </ModalHeader>
              <ModalBody>
                <form>
                  <h5>Set Vendor Commission Rate </h5>

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                      <div class="form-group">
                        <label for="exampleInputEmail1">Commission Rate  <RequiredField /></label>
                        <input
                          type="number"
                          class="form-control"
                          min={0}
                          max={100}
                          onChange={(e) => setCommissionRate(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                      <div class="form-group">
                        <label for="exampleInputEmail1">
                          Effective Start Date <RequiredField />
                        </label>
                        <input
                          type="datetime-local"
                          class="form-control"
                          onChange={(e) =>
                            setStartEffectiveDate(moment(e.target.value).format('YYYY-MM-DDTHH:mm:ss'))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                      <div class="form-group">
                        <label for="exampleInputEmail1">
                          Effective End Date <RequiredField />
                        </label>
                        <input
                          type="datetime-local"
                          class="form-control"
                          onChange={(e) => setEndEffectiveDate(moment(e.target.value).format('YYYY-MM-DD HH:mm:ss'))}
                        />
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                      <div class="form-group">
                        <label for="exampleInputEmail1">Note</label>
                        <textarea
                          className="form-control"
                          onChange={(e) =>
                            setAdminNoteCommission(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <h5>Assign SubCategories </h5>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                      <div class="form-group">
                        <label for="exampleInputEmail1">
                          SubCategories  <RequiredField />
                        </label>
                        <Select
                          options={Options}
                          isMulti
                          onChange={(e) => setSelectedOptions(e)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12 mt-2">
                      <div class="form-group">
                        <label for="exampleInputEmail1">
                          Admin Note <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className="form-control"
                          onChange={(e) =>
                            setSubCategoryAdminNote(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <div>
                  <span>
                    <div >
                      {
                        ShowContent ?
                          <><h2 className=" text-danger ">Store is not approved by Pathao yet </h2></>
                          : <></>
                      }
                    </div>
                    <Button
                      color="success"
                      className="float-right"
                      disabled={
                        !store.length
                      }
                      onClick={() => ApproveVendorBusiness()}
                    >
                      Save and Approve
                    </Button>{" "}
                  </span>
                </div>
              </ModalFooter>
            </Modal>
          </div>
        </>
      )}
    </div>
  );
}
export default VendorBusinessStoreDetail;
