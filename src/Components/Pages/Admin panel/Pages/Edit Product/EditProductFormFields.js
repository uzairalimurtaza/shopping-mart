import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useContext, useState } from "react";
import { PRODUCT_FORM_CONTEXT } from "./../../../../Contexts/ProductFormContext";
import firetoast from "./../../../../../Helpers/FireToast";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../../Utils/Endpoint";
import Select from "react-select";
import { Modal, ModalBody, ModalFooter, ModalHeader, Button } from "reactstrap";
import { Link, useParams } from "react-router-dom";
import CheckEmpty from "./../../../../../Utils/CheckEmpty";
import { CurrentUser } from "./../../../../../Helpers/Auth";
import { RequiredField } from "./../../../../../Utils/Required-field";
ClassicEditor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "|",
      "bulletedList",
      "numberedList",
      "|",
      "undo",
      "redo",
    ],
  },
  //   image: {
  //     toolbar: [
  //       "imageStyle:full",
  //       "imageStyle:side",
  //       "|",
  //       "imageTextAlternative",
  //     ],
  //   },
  //   table: {
  //     contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
  //   },
  language: "en",
};
function EditProductFormFields() {
  var [modal, setModal] = useState(false);
  var { productID } = useParams();
  var [VariationName, setVariationName] = useState("");
  var [VariationToDelete, setVariationToDelete] = useState("");
  var [modal2, setModal2] = useState(false);
  var [DisableVariantButton, setDisableVariantButton] = useState(false);
  var [CityList, setCityList] = useState([]);
  var {
    Business,
    ProductApproval,
    setProductApproval,
    getOptions,
    subcategories,
    Title,
    setTitle,
    SubCategoryID,
    setSubCategoryID,
    Currency,
    setCurrency,
    CostPrice,
    setCostPrice,
    Price,
    setPrice,
    PromotionPrice,
    setPromotionPrice,
    PromotionRate,
    setPromotionRate,
    PromotionStartDate,
    setPromotionStartDate,
    PromotionEndDate,
    setPromotionEndDate,
    Weight,
    setWeight,
    Height,
    setHeight,
    Length,
    setLength,
    Width,
    setWidth,
    Description,
    setDescription,
    SpecialInstruction,
    setSpecialInstruction,
    ReturnPolicy,
    setReturnPolicy,
    AllowStorePickup,
    setAllowStorePickup,
    ShippingAvailable,
    setShippingAvailable,
    ShippingGlobal,
    setShippingGlobal,
    ShippingByAdmin,
    setShippingByAdmin,
    ShippingByVendor,
    setShippingByVendor,
    ShippingCostAdmin,
    setShippingCostAdmin,
    ShippingCostVendor,
    setShippingCostVendor,
    ReviewedByAdmin,
    setReviewedByAdmin,
    TaxVATApply,
    setTaxVATApply,
    Active,
    setActive,
    LockEdit,
    setLockEdit,
    submitProduct,
    getOptions,
    ShippingCostVendorCountry,
    setShippingCostVendorCountry,
    ShippingCostKiloVendorCountry,
    setShippingCostKiloVendorCountry,
    CityShippingCost,
    setCityShippingCost,
    // AvailableInventory,
    // setAvailableInventory,
    UnitPrice,
    setUnitPrice,
    TotalPrice,
    setTotalPrice,
    // SKU,
    // setSKU,
    Inventory,
    setInventory,
    Status,
    setStatus,
    Options,
    StoreName,
    setStoreName,
    VendorStores,
    setOptions,
    setSubCategoriesVariants,
    Quantity1,
    setQuantity1,
    Quantity2,
    setQuantity2,
    Quantity3,
    setQuantity3,
    PriceQuantity1,
    setPriceQuantity1,
    PriceQuantity2,
    setPriceQuantity2,
    PriceQuantity3,
    setPriceQuantity3,
    Variations,
    setVariations,
    step1Submission,
    setIsNew,
    isNew,
    AvailableVariations,
    CodStatus,
    setCodStatus,
    FreeProductReturn,
    setFreeProductReturn,
  } = useContext(PRODUCT_FORM_CONTEXT);
  const updateVariationValue = (value, index) => {
    var array = [...Variations];
    array[index].label = value;
    setVariations(array);
  };
  var AddNewCityRateRow = () => {
    var temp = [...CityShippingCost];
    var obj = {
      CityID: "",
      ShippingCostVendorCity: "",
      ShippingCostKiloVendorCity: "",
    };
    temp.push(obj);
    setCityShippingCost(temp);
  };
  var removeCityRateRow = (index) => {
    var temp = [...CityShippingCost];
    var array = [];
    for (let i = 0; i < temp.length; i++) {
      if (i !== index) {
        array.push(temp[i]);
      }
    }
    setCityShippingCost(array);
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
  var handleCityShippings = (index, e) => {
    var temp = [...CityShippingCost];
    var current = temp[index];
    current[e.target.name] = e.target.value;
    temp[index] = current;
    setCityShippingCost(temp);
  };
  var setDeliveryMethod = (e) => {
    if (e) {
      if (e === "1") {
        setShippingCostAdmin("Y");
        setShippingCostVendor("N");
        setShippingByAdmin("Y");
        setShippingByVendor("N");
      } else if (e === "2") {
        setShippingCostVendor("Y");
        setShippingCostAdmin("N");
        setShippingByAdmin("N");
        setShippingByVendor("Y");
      }
    }
  };
  var handleCostBy = (e) => {
    if (e) {
      if (e === "1") {
        setShippingCostAdmin("Y");
        setShippingCostVendor("N");
      } else if (e === "2") {
        setShippingCostVendor("Y");
        setShippingCostAdmin("N");
      }
    }
  };
  const AddNewVariation = async () => {
    try {
      if (CheckEmpty(VariationName)) {
        return firetoast("Variation Name is required!", "default-error");
      } else {
        const form = new URLSearchParams();
        form.append("Variations[0]", VariationName);
        const response = await BanglaBazarApi.post(
          `${Endpoint}/api/product/add-productVariant/${productID}`,
          form
        );
        if (response.data.status) {
          setModal(false);
          setVariationName("");
          firetoast(
            "New variation created successfully",
            "success",
            3000,
            "top-right"
          );
          await getOptions(productID);
        } else {
          var { error, message } = response.data;
          return firetoast(error || message, "default-error");
        }
      }
    } catch (e) {
      console.log(e);
      firetoast(
        "Something went wrong while creating variation",
        "default-error"
      );
    }
  };
  const getSubCategoryVariants = async (id) => {
    setOptions([]);
    setSubCategoriesVariants([]);
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/product/get-subCategoryVariants/${id}`
      );
      var array = [];
      if (response.data.status) {
        var data = response.data.SubCategoryVariant;
        for (let i = 0; i < data.length; i++) {
          var obj = {
            OptionName: data[i].Variant,
            OptionValue: data[i].VariantValue.split(","),
            isCustom: false,
          };
          array.push(obj);
        }
        // console.log(array);
        setSubCategoriesVariants(array);
      }
      // console.log(response);
    } catch (e) {
      firetoast(
        "Something went wrong while getting variants",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var deleteVariation = async () => {
    try {
      const response = await BanglaBazarApi.delete(
        `${Endpoint}/api/product/delete-productVariant/${VariationToDelete}`
      );
      if (response.data.status) {
        firetoast("Variation removed", "success", 3000, "top-right");
        setVariationToDelete("");
        setModal2(false);
        await getOptions(productID);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast(
        "Something went wrong while removing variation",
        "default-error"
      );
    }
  };
  return (
    <>
      <div className="product-form">
        <div className="row">
          <div className="col-xl-6 col-md-6 col-sm-12">
            <label>
              Title <RequiredField />
            </label>
            <input
              className="form-control product-field"
              type="input"
              defaultValue={Title}
              id="title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="col-xl-6 col-md-6 col-sm-12" id="storename">
            <label>Store Name</label>
            <select
              className="form-control product-field"
              onChange={(e) => {
                setStoreName(e.target.value);
              }}
            >
              <option>Select</option>
              {VendorStores.map((item, index) => (
                <option
                  value={item.StoreName}
                  key={index}
                  selected={StoreName === item.StoreName}
                >
                  {item.StoreName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 col-md-6 col-sm-12">
            <label>
              Subcategory <RequiredField />
            </label>
            <select
              className="form-control product-field"
              id="subcategory"
              onChange={(e) => {
                setSubCategoryID(e.target.value);
                getSubCategoryVariants(e.target.value);
              }}
            >
              <option>Select</option>
              {subcategories.map((item, index) => (
                <option
                  value={item.SubCategoryID}
                  key={index}
                  selected={SubCategoryID === item.SubCategoryID}
                >
                  {item.SubCategory}
                </option>
              ))}
            </select>
          </div>
          <div className="col-xl-6 col-md-6 col-sm-12" id="currency">
            <label>
              Currency <RequiredField />
            </label>
            <input
              className="form-control product-field"
              value={Currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 col-md-6 col-sm-12">
            <label>Cost Price</label>
            <input
              className="form-control product-field"
              type="text"
              Value={CostPrice}
              onChange={(e) => setCostPrice(e.target.value)}
            />
          </div>
          <div className="col-xl-6 col-md-6 col-sm-12" id="price">
            <label>
              Price <RequiredField />
            </label>
            <input
              className="form-control product-field"
              type="text"
              Value={parseInt(Price)}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 col-md-6 col-sm-12">
            <label>Promotion price</label>
            <input
              className="form-control product-field"
              type="text"
              Value={parseInt(PromotionPrice)}
              onChange={(e) => setPromotionPrice(e.target.value)}
            />
          </div>
          <div className="col-xl-6 col-md-6 col-sm-12">
            <label>Promotion rate</label>
            <input
              className="form-control product-field"
              type="text"
              Value={parseInt(PromotionRate)}
              onChange={(e) => setPromotionRate(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-6 col-md-6 col-sm-12">
            <label>Promotion Start Date</label>
            <input
              className="form-control product-field"
              type="date"
              Value={PromotionStartDate}
              onChange={(e) => setPromotionStartDate(e.target.value)}
            />
          </div>
          <div className="col-xl-6 col-md-6 col-sm-12">
            <label>Promotion End Date</label>
            <input
              className="form-control product-field"
              type="date"
              Value={PromotionEndDate}
              onChange={(e) => setPromotionEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6" id="weight">
            <label>
              Weight <RequiredField />
            </label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control product-field"
                Value={parseInt(Weight)}
                onChange={(e) => setWeight(e.target.value)}
              />
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">
                  kg
                </span>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6" id="height">
            <label>
              Height <RequiredField />
            </label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control product-field"
                Value={parseInt(Height)}
                onChange={(e) => setHeight(e.target.value)}
              />
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">
                  cm
                </span>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6" id="length">
            <label>
              Length <RequiredField />
            </label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control product-field"
                Value={parseInt(Length)}
                onChange={(e) => setLength(e.target.value)}
              />
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">
                  cm
                </span>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6" id="width">
            <label>
              Width <RequiredField />
            </label>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control product-field"
                Value={parseInt(Width)}
                onChange={(e) => setWidth(e.target.value)}
              />
              <div className="input-group-append">
                <span className="input-group-text" id="basic-addon2">
                  cm
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-6">
            <label>Quantity 1</label>
            <input
              className="form-control"
              value={Quantity1}
              type="text"
              onChange={(e) => setQuantity1(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Price of Quantity 1</label>
            <input
              className="form-control"
              value={PriceQuantity1}
              type="text"
              onChange={(e) => setPriceQuantity1(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <label>Quantity 2</label>
            <input
              className="form-control"
              value={Quantity2}
              type="text"
              onChange={(e) => setQuantity2(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Price of Quantity 2</label>
            <input
              className="form-control"
              value={PriceQuantity2}
              type="text"
              onChange={(e) => setPriceQuantity2(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-6">
            <label>Quantity 3</label>
            <input
              className="form-control"
              value={Quantity3}
              type="text"
              onChange={(e) => setQuantity3(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Price of Quantity 3</label>
            <input
              className="form-control"
              value={PriceQuantity3}
              type="text"
              onChange={(e) => setPriceQuantity3(e.target.value)}
            />
          </div>
        </div>
        <div className="row" id="variations">
          <div className="col-8">
            <div className="d-flex justify-content-between">
              <label>Variations </label>
              <div>
                <Link
                  to="#"
                  className="text-default td-none"
                  onClick={() => setModal(!modal)}
                >
                  Add Variation
                </Link>
              </div>
            </div>
            <div className="row">
              {Variations.map((item, index) => (
                <div className="col-6 p-1 d-flex justify-content-between align-items-center">
                  <input
                    className="form-control"
                    value={item.label}
                    disabled
                    onChange={(e) => {
                      updateVariationValue(e.target.value, index);
                    }}
                  />
                  {index !== 0 && (
                    <div
                      style={{ cursor: "pointer", marginLeft: "2px" }}
                      onClick={() => {
                        setVariationToDelete(item.value);
                        setModal2(!modal2);
                      }}
                    >
                      <i className="fas fa-trash-alt text-danger"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="row">
            <div className="col-6">
              <label>Product Shipping By</label>
              <select
                className="form-control"
                onChange={(e) => setDeliveryMethod(e.target.value)}
              >
                <option> Select Delivery Method...</option>
                <option value={"1"} selected={ShippingByAdmin === "Y"}>
                  By BanglaBazar
                </option>
                <option
                  value={"2"}
                  selected={ShippingByVendor === "Y"}
                  disabled={Business && Business.AllowDelivery === "N"}
                >
                  By Vendor
                </option>
              </select>
            </div>
            {/* {ShippingByAdmin === "Y" && (
            <div className="col-6">
              <label>Shipping Cost By BanglaBazar </label>
              <select className="form-control" onChange={handleCostBy}>
                <option> Select...</option>
                <option value={"1"} selected={ShippingCostAdmin === "Y"}>
                  BanglaBazar Delivery Man
                </option>
                <option value={"2"} selected={ShippingCostAdmin === "N"}>
                  Vendor Shipping level
                </option>
              </select>
            </div>
          )} */}
          </div>
          {ShippingByVendor === "Y" && (
            <>
              <h6 className="mt-2">
                <b>Vendor Shipping Price</b>
              </h6>
              <div className="mt-3">
                <div className="d-flex">
                  <div>
                    <label>
                      Country Shipping Cost <RequiredField />
                    </label>
                    <div>
                      <input
                        className="form-control"
                        type="number"
                        value={ShippingCostVendorCountry}
                        onChange={(e) =>
                          setShippingCostVendorCountry(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div style={{ marginLeft: "10px" }}>
                    <label>
                      Country Shipping Cost Per Kilo <RequiredField />
                    </label>
                    <div>
                      <input
                        className="form-control"
                        type="number"
                        value={ShippingCostKiloVendorCountry}
                        onChange={(e) =>
                          setShippingCostKiloVendorCountry(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                {
                  <>
                    {CityShippingCost.map((row, index) => (
                      <div className="d-flex align-items-center">
                        <div>
                          <label>City</label>
                          <select
                            className="form-control w-100"
                            name="CityID"
                            onChange={(e) => handleCityShippings(index, e)}
                          >
                            <option>Select City</option>
                            {CityList.map((City, index) => (
                              <option key={index} value={City.CityID}>
                                {City.City}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div style={{ marginLeft: "15px" }}>
                          <label>Shipping Cost </label>
                          <div>
                            <input
                              className="form-control"
                              type="number"
                              onChange={(e) => handleCityShippings(index, e)}
                              name="ShippingCostVendorCity"
                            />
                          </div>
                        </div>
                        <div style={{ marginLeft: "15px" }}>
                          <label>Shipping Cost Per Kilo</label>
                          <div>
                            <input
                              className="form-control"
                              type="number"
                              onChange={(e) => handleCityShippings(index, e)}
                              name="ShippingCostKiloVendorCity"
                            />
                          </div>
                        </div>
                        <div style={{ marginLeft: "15px" }}>
                          <label className="text-white">Remove</label>
                          <div>
                            <i
                              class="fal fa-trash-alt text-danger cursor-pointer"
                              onClick={() => removeCityRateRow(index)}
                            ></i>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                }
                <div className="mt-2">
                  <Link
                    to="#"
                    className="btn btn-default-outline td-none"
                    onClick={() => AddNewCityRateRow()}
                  >
                    Add City Rate
                  </Link>
                </div>
              </div>
            </>
          )}
          {/* {ShippingByAdmin === "Y" && (
            <div className="col-6">
              <label>Shipping Cost By BanglaBazar </label>
              <select className="form-control" onChange={handleCostBy}>
                <option> Select...</option>
                <option value={"1"} selected={ShippingCostAdmin === "Y"}>
                  BanglaBazar Delivery Man
                </option>
                <option value={"2"} selected={ShippingCostAdmin === "N"}>
                  Vendor Shipping level
                </option>
              </select>
            </div>
          )} */}
        </div>
        {/* <div className="row">
          <label>Shipping By</label>
          <div className="col-6 row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="cs-bi-radios-input"
                  name="activefield"
                  defaultChecked={ShippingByAdmin === "Y"}
                  onChange={() => {
                    setShippingByAdmin(ShippingByAdmin === "Y" ? "N" : "Y");
                    setShippingByVendor(ShippingByAdmin === "Y" ? "N" : "Y");
                  }}
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Shipping by admin
                </label>
              </div>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
              <div className="form-check form-check-inline">
                <input
                  type="radio"
                  className="cs-bi-radios-input"
                  name="activefield"
                  defaultChecked={ShippingByVendor === "Y"}
                  onChange={() => {
                    setShippingByVendor(ShippingByVendor === "Y" ? "N" : "Y");
                    setShippingByAdmin(ShippingByVendor === "Y" ? "N" : "Y");
                  }}
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Shipping by vendor
                </label>
              </div>
            </div>
          </div>
        </div> */}
        <div className="row">
          <div className="col-12">
            <label>
              Description <RequiredField />
            </label>
            <div id="description"></div>
            <CKEditor
              editor={ClassicEditor}
              data={Description}
              onChange={(event, editor) => {
                const data = editor.getData();
                setDescription(data);
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <label>
              Special instruction <RequiredField />
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={SpecialInstruction}
              onChange={(event, editor) => {
                const data = editor.getData();
                setSpecialInstruction(data);
              }}
            />
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div id="returnpolicy"></div>
            <label>
              Return policy <RequiredField />
            </label>
            <CKEditor
              editor={ClassicEditor}
              data={ReturnPolicy}
              onChange={(event, editor) => {
                const data = editor.getData();
                setReturnPolicy(data);
              }}
            />
          </div>
        </div>
        <hr />
        <div className="row">
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                disabled={Business && Business.AllowStorePickup === "N"}
                defaultChecked={AllowStorePickup === "Y"}
                onChange={() =>
                  setAllowStorePickup(AllowStorePickup === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Allow store pickup
              </label>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ShippingAvailable === "Y"}
                onChange={() =>
                  setShippingAvailable(ShippingAvailable === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Shipping available
              </label>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ShippingGlobal === "Y"}
                onChange={() =>
                  setShippingGlobal(ShippingGlobal === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Shipping global
              </label>
            </div>
          </div>
          {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ShippingByAdmin === "Y"}
                onChange={() =>
                  setShippingByAdmin(ShippingByAdmin === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Shipping by admin
              </label>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ShippingByVendor === "Y"}
                onChange={() =>
                  setShippingByVendor(ShippingByVendor === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Shipping by vendor
              </label>
            </div>
          </div> */}
          {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ShippingCostAdmin === "Y"}
                onChange={() =>
                  setShippingCostAdmin(ShippingCostAdmin === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Shipping cost admin
              </label>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ShippingCostVendor === "Y"}
                onChange={() =>
                  setShippingCostVendor(ShippingCostVendor === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Shipping cost vendor
              </label>
            </div>
          </div> */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            {/* <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ReviewedByAdmin === "Y"}
                onChange={() =>
                  setReviewedByAdmin(ReviewedByAdmin === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Reviewed by admin
              </label>
            </div> */}
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={TaxVATApply === "Y"}
                onChange={() => setTaxVATApply(TaxVATApply === "Y" ? "N" : "Y")}
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Tax Vat Apply
              </label>
            </div>
          </div>
          {/* <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            
          </div> */}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={LockEdit === "Y"}
                onChange={() => setLockEdit(LockEdit === "Y" ? "N" : "Y")}
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Lock Edit
              </label>
            </div>
          </div>
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            <div className="form-check form-check-inline">
              {FreeProductReturn && (
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox5"
                  checked={FreeProductReturn === "Y"}
                  onChange={() =>
                    setFreeProductReturn(FreeProductReturn === "Y" ? "N" : "Y")
                  }
                />
              )}
              <label className="form-check-label" for="inlineCheckbox5">
                Free Product Return
              </label>
            </div>
          </div>

          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
            {/* {(CurrentUser.SuperAdmin === "Y" || CurrentUser.Admin === "Y") && ( */}
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={ProductApproval === "Y"}
                onChange={() =>
                  setProductApproval(ProductApproval === "Y" ? "N" : "Y")
                }
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Product Approval
              </label>
            </div>

            {Business && Business.VendorCodStatus === "Y" && (
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox3"
                  onChange={(e) => {
                    setCodStatus(e.target.checked ? "Y" : "N");
                  }}
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Allow COD
                </label>
              </div>
            )}
            {/* // )} */}
            {/* <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={Status === "Y"}
                onChange={() => setStatus(Active === "Y" ? "N" : "Y")}
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Status
              </label>
            </div> */}
          </div>
        </div>
        <div className="row w-100">
          <div className="col-3 " style={{ marginLeft: "auto" }}>
            <button
              className="btn btn-lg btn-success w-100"
              onClick={() => submitProduct()}
              disabled={step1Submission}
            >
              Update
            </button>
          </div>
        </div>
      </div>
      <Modal toggle={() => setModal(!modal)} isOpen={modal}>
        <ModalHeader toggle={() => setModal(!modal)}>New Variation</ModalHeader>
        <ModalBody>
          <div className="mt-1">
            <label>Variation Name</label>
            {/* <input
              className="form-control"
              onChange={(e) => setVariationName(e.target.value)}
            /> */}
            <Select
              // defaultValue={Variations}
              // value={AvailableVariations}
              onChange={(e) => {
                let found = false;
                for (let i = 0; i < Variations.length; i++) {
                  if (Variations[i].label === e.value) {
                    found = true;
                  }
                }
                if (found) {
                  setDisableVariantButton(true);
                  return firetoast(
                    "Variation with this name already exist!",
                    "default-error"
                  );
                } else {
                  setDisableVariantButton(false);
                  setVariationName(e.value);
                }
                // setIsNew(true);
                // setVariations(e);
              }}
              options={AvailableVariations}
            />
            <small>E.g; Color, Size etc</small>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => AddNewVariation()}
            disabled={DisableVariantButton}
          >
            Create
          </Button>{" "}
        </ModalFooter>
      </Modal>
      <Modal toggle={() => setModal2(!modal2)} isOpen={modal2}>
        <ModalHeader toggle={() => setModal2(!modal2)}>Alert!</ModalHeader>
        <ModalBody>
          <h4>Are you sure to delete this variation?</h4>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => deleteVariation()}>
            Remove
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </>
  );
}
export default EditProductFormFields;
