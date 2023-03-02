import { useContext, useState, useEffect } from "react";
import { PRODUCT_FORM_CONTEXT } from "./../../../../Contexts/ProductFormContext";
import { Link, useParams } from "react-router-dom";
import firetoast from "./../../../../../Helpers/FireToast";
import Resizer from "react-image-file-resizer";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../../Utils/Endpoint";
import CheckEmpty from "./../../../../../Utils/CheckEmpty";
import { CurrentUser } from "./../../../../../Helpers/Auth";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Alert,
} from "reactstrap";

function EditProductVariants() {
  var [VariationValues, setVariationValues] = useState([]);
  var [optionid, setOptionid] = useState(null);
  var [showModal, setshowModal] = useState(false);
  var [AvailabaleValues, setAvailabaleValues] = useState([]);
  var [isAddCustom, setIsAddCustom] = useState(false);
  var [ModalSmall, setModalSmall] = useState(null);
  var [ModalMedium, setModalMedium] = useState(null);
  var [ModalLarge, setModalLarge] = useState(null);
  var [ModalButton, setModalButton] = useState(false);
  var [ModalPrice, setModalPrice] = useState("0");
  var { productID } = useParams();
  const {
    Options,
    setOptions,
    SubCategoryVariants,
    SKU,
    setSKU,
    Price,
    Status,
    ProductID,
    StoreName,
    setPrice,
    AvailableInventory,
    OptionId,
    setOptionId,
    setAvailableInventory,
    setSmall,
    setMedium,
    setLarge,
    OptionValue,
    setOptionValue,
    MainImage,
    Inventory,
    setInventory,
    UnitPrice,
    setUnitPrice,
    TotalPrice,
    setTotalPrice,
    Small,
    Medium,
    Large,
    Variations,
    getOptions,
    Currency,
    AvailableVariations,
  } = useContext(PRODUCT_FORM_CONTEXT);
  useEffect(async () => {
    await getAllVariantAndValues();
    // console.log(VariationValues);
  }, []);
  var getAllVariantAndValues = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/product/get-productAllDetails/${productID}/${CurrentUser.UserID}`
      );
      setVariationValues(response.data.Product);
    } catch (e) {
      console.log(e);
      firetoast(
        "Something went wrong while getting varaint and values",
        "default-error"
      );
    }
  };
  var UpdateVarantValueImage = async (file) => {
    if (file) {
      // console.log(await VariantImageResizer(file,1,1))

      await Resizer.imageFileResizer(
        file,
        50,
        50,
        "PNG",
        100,
        0,
        (uri) => {
          setSmall(uri);
        },
        "file"
      );
      await Resizer.imageFileResizer(
        file,
        200,
        200,
        "PNG",
        100,
        0,
        (uri) => {
          setMedium(uri);
        },
        "file"
      );
      await Resizer.imageFileResizer(
        file,
        400,
        550,
        "PNG",
        100,
        0,
        (uri) => {
          setLarge(uri);
        },
        "file"
      );
    }
  };
  var submitOptionValueDetail = async (id, item) => {
    var {
      VariantValue,
      SKU,
      Price,
      AvailableInventory,
      Inventory,
      UnitPrice,
      TotalPrice,
      Small,
      Medium,
      Large,
      MainImage,
    } = item;
    if (CheckEmpty(VariantValue)) {
      return firetoast("Option Value Name is required", "default-error");
    }
    if (CheckEmpty(SKU)) {
      return firetoast("SKU is required", "default-error");
    }
    if (CheckEmpty(Price)) {
      return firetoast("Price is required", "default-error");
    }
    if (CheckEmpty(AvailableInventory)) {
      return firetoast("Available Inventory is required", "default-error");
    }
    if (CheckEmpty(Inventory)) {
      return firetoast("Inventory is required", "default-error");
    }
    if (CheckEmpty(UnitPrice)) {
      return firetoast("Unit Price is required", "default-error");
    }
    if (CheckEmpty(TotalPrice)) {
      return firetoast("Total Price is required", "default-error");
    }
    if (MainImage === "Y") {
      var found = false;

      for (var i = 0; i < VariationValues.length; i++) {
        if (
          VariationValues[i].VariantValue !== VariantValue &&
          VariationValues[i].MainImage === "Y"
        ) {
          found = true;
        }
      }
      if (found) {
        return firetoast(
          "Only one Main Image can be set from the available variant values",
          "error",
          3000,
          "top-right"
        );
      }
    }
    try {
      var form = new FormData();
      form.append("ProductID", productID);
      form.append("StoreName", StoreName);
      form.append("OptionID", optionid);
      form.append("OptionValue", VariantValue);
      form.append("MainImage", MainImage);
      form.append("SKU", SKU);
      form.append("Price", Price);
      form.append("AvailableInventory", AvailableInventory);
      form.append("Inventory", Inventory);
      form.append("UnitPrice", UnitPrice);
      form.append("TotalPrice", TotalPrice);
      form.append("Status", Status);
      form.append("Small", Small);
      form.append("Medium", Medium);
      form.append("Large", Large);

      var response = await BanglaBazarApi.put(
        `${Endpoint}/api/product/updateProduct-Form2/${id}`,
        form
      );
      console.log(response);
      if (response.data.status) {
        firetoast(
          "Option Value updated Added Successfully",
          "success",
          3000,
          "top-right"
        );
        getAllVariantAndValues();
      } else {
        var { message, error } = response.data;
        return firetoast(message || error, "default-error");
      }
    } catch (e) {
      console.log(e);
      return firetoast(
        "Something went wrong while updating option value deatils",
        "default-error"
      );
    }
  };
  var AddNewOptionValue = async (item) => {
    var {
      VariantValue,
      SKU,
      Price,
      AvailableInventory,
      Inventory,
      UnitPrice,
      TotalPrice,
      Small,
      Medium,
      Large,
    } = item;
    if (CheckEmpty(VariantValue)) {
      return firetoast("Option Value Name is required", "default-error");
    }
    if (CheckEmpty(SKU)) {
      return firetoast("SKU is required", "default-error");
    }
    if (CheckEmpty(Price)) {
      return firetoast("Price is required", "default-error");
    }
    if (CheckEmpty(AvailableInventory)) {
      return firetoast("Available Inventory is required", "default-error");
    }
    if (CheckEmpty(Inventory)) {
      return firetoast("Inventory is required", "default-error");
    }
    if (CheckEmpty(UnitPrice)) {
      return firetoast("Unit Price is required", "default-error");
    }
    if (CheckEmpty(TotalPrice)) {
      return firetoast("Total Price is required", "default-error");
    }
    if (MainImage === "Y") {
      var found = 0;

      for (var i = 0; i < VariationValues.length; i++) {
        if (
          VariationValues[i].VariantValue !== VariantValue &&
          VariationValues[i].MainImage === "Y"
        ) {
          found += 1;
        }
      }
      if (VariationValues[0].MainImage === "Y") {
        return firetoast(
          "Only one Main Image can be set from the available variant values",
          "error",
          3000,
          "top-right"
        );
      }
    }
    try {
      var form = new FormData();
      form.append("ProductID", productID);
      form.append("StoreName", StoreName);
      form.append("OptionID", optionid);
      form.append("OptionValue", VariantValue);
      form.append("MainImage", MainImage);
      form.append("SKU", SKU);
      form.append("Price", Price);
      form.append("AvailableInventory", AvailableInventory);
      form.append("Inventory", Inventory);
      form.append("UnitPrice", UnitPrice);
      form.append("TotalPrice", TotalPrice);
      form.append("Status", Status);
      form.append("Small", Small);
      form.append("Medium", Medium);
      form.append("Large", Large);

      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/addProduct-Form2`,
        form
      );
      console.log(response);
      if (response.data.status) {
        firetoast(
          "Option Value Details Added Successfully",
          "success",
          3000,
          "top-right"
        );
        getAllVariantAndValues();
        clearDetails();
      } else {
        var { message, error } = response.data;
        return firetoast(message || error, "default-error");
      }
    } catch (e) {
      console.log(e);
      return firetoast(
        "Something went wrong while adding option value deatils",
        "default-error"
      );
    }
  };
  var clearDetails = () => {
    setOptionId("null");
    setOptionValue("");
    setSKU("");
    setPrice("");
    setInventory("");
    setTotalPrice("");
    setAvailableInventory("");
    setSmall("");
    setMedium("");
    setLarge("");
  };
  let getOptionValues = async (id) => {
    try {
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/product/get-productVariantDetail/${id}`
      );
      var data = response.data.ProductVariants;
      for (let i = 0; i < data.length; i++) {
        data[i].isNew = false;
      }
      setVariationValues(data);
    } catch (e) {
      firetoast(
        "Something went wrong while fething option values",
        "default-error"
      );
    }
  };
  let handleVariationValueChange = (e, index) => {
    var array = [...VariationValues];
    array[index][e.target.name] = e.target.value;
    setVariationValues(array);
  };
  let handleVariationValueMainImageChange = (e, index) => {
    var array = [...VariationValues];
    array[index].MainImage = e;
    setVariationValues(array);
  };
  let setVariationList = async () => {
    let foundVariationLabel = "";
    for (let i = 0; i < Variations.length; i++) {
      if (parseInt(Variations[i].value) === parseInt(optionid)) {
        foundVariationLabel = Variations[i].label;
      }
    }
    let foundVariationId = "";
    for (let i = 0; i < AvailableVariations.length; i++) {
      if (AvailableVariations[i].label === foundVariationLabel) {
        foundVariationId = AvailableVariations[i].id;
      }
    }
    console.log(foundVariationId);
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/category/get-subcategoryvariantvalue/${foundVariationId}`
      );
      setAvailabaleValues(response.data.SubCategoryVariantValue);
    } catch (e) {
      firetoast("Something went wrong!", "default-error");
    }
  };
  var handleUpdateVarantValueImage = async (file, index) => {
    var array = [...VariationValues];
    if (file) {
      // console.log(await VariantImageResizer(file,1,1))

      await Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          array[index].Small = uri;
        },
        "file",
        1,
        1
      );
      await Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          array[index].Medium = uri;
        },
        "file",
        10,
        10
      );
      await Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          array[index].Large = uri;
        },
        "file",
        100,
        100
      );
      setVariationValues(array);
    }
  };
  var AddNewOption = async () => {
    var array = [...VariationValues];
    if (optionid != null) {
      array.push({
        ProductID: "",
        StoreName: "",
        OptionID: "",
        OptionValue: "",
        MainImage: "N",
        SKU: "",
        Price: "",
        AvailableInventory: "",
        Inventory: "",
        UnitPrice: "",
        TotalPrice: "",
        Status: "",
        Small: "",
        Medium: "",
        Large: "",
        isNew: true,
      });
      setVariationValues(array.reverse());
    }
  };
  var removeVariantValue = async (id) => {
    try {
      const response = await BanglaBazarApi.delete(
        `${Endpoint}/api/product/delete-productVariantValue/${id}`
      );
      if (response.data.status) {
        firetoast(
          "Variant Value removed successfully",
          "success",
          3000,
          "top-right"
        );
        getOptionValues(optionid);
      }
    } catch (e) {
      firetoast(
        "Something went wrong while removing variant value",
        "default-error"
      );
    }
  };
  var CreateNewValue = async () => {
    let VariantValue = document.getElementById("valueName").value;
    let SKU = document.getElementById("variantSKU").value;
    let Price = document.getElementById("variantPrice").value;
    let Inventory = document.getElementById("variantInventory").value;
    let AvailableInventory = document.getElementById(
      "variantAvailableInventory"
    ).value;
    let TotalPrice = document.getElementById("variantTotalPrice").value;
    let UnitPrice = document.getElementById("variantUnitPrice").value;
    let file = document.getElementById("variantImage").files[0];

    if (CheckEmpty(VariantValue)) {
      return firetoast("Option Value Name is required", "default-error");
    }

    if (CheckEmpty(SKU)) {
      return firetoast("SKU is required", "default-error");
    }
    if (CheckEmpty(Price)) {
      return firetoast("Price is required", "default-error");
    }
    if (CheckEmpty(AvailableInventory)) {
      return firetoast("Available Inventory is required", "default-error");
    }
    if (CheckEmpty(Inventory)) {
      return firetoast("Inventory is required", "default-error");
    }
    if (CheckEmpty(UnitPrice)) {
      return firetoast("Unit Price is required", "default-error");
    }
    if (CheckEmpty(TotalPrice)) {
      return firetoast("Total Price is required", "default-error");
    }
    if (!file) {
      return firetoast("Image is required", "defaulr-error");
    }
    if (file) {
      // console.log(await VariantImageResizer(file,1,1))

      await Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setModalSmall(uri);
        },
        "file",
        1,
        1
      );
      await Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setModalMedium(uri);
        },
        "file",
        10,
        10
      );
      await Resizer.imageFileResizer(
        file,
        300,
        300,
        "JPEG",
        100,
        0,
        (uri) => {
          setModalLarge(uri);
        },
        "file",
        100,
        100
      );
    }
    // if (MainImage === "Y") {
    //   var found = 0;

    //   for (var i = 0; i < VariationValues.length; i++) {
    //     if (
    //       VariationValues[i].VariantValue !== VariantValue &&
    //       VariationValues[i].MainImage === "Y"
    //     ) {
    //       found += 1;
    //     }
    //   }
    //   if (VariationValues[0].MainImage === "Y") {
    //     return firetoast(
    //       "Only one Main Image can be set from the available variant values",
    //       "error",
    //       3000,
    //       "top-right"
    //     );
    //   }
    // }
    for (let i = 0; i < VariationValues.length; i++) {
      if (VariationValues[i].VariantValue === VariantValue) {
        setModalButton(true);
        return firetoast("Value already exist with this name", "default-error");
      }
    }
    try {
      var form = new FormData();
      form.append("ProductID", productID);
      form.append("StoreName", StoreName);
      form.append("OptionID", optionid);
      form.append("OptionValue", VariantValue);
      form.append("MainImage", "N");
      form.append("SKU", SKU);
      form.append("Price", Price);
      form.append("AvailableInventory", AvailableInventory);
      form.append("Inventory", Inventory);
      form.append("UnitPrice", UnitPrice);
      form.append("TotalPrice", TotalPrice);
      form.append("Status", "Y");
      form.append("Small", ModalSmall);
      form.append("Medium", ModalMedium);
      form.append("Large", ModalLarge);

      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/addProduct-Form2`,
        form
      );
      console.log(response);
      if (response.data.status) {
        firetoast(
          "Option Value Details Added Successfully",
          "success",
          3000,
          "top-right"
        );
        getAllVariantAndValues();
        setshowModal(false);
        clearDetails();
      } else {
        var { message, error } = response.data;
        return firetoast(message || error, "default-error");
      }
    } catch (e) {
      console.log(e);
      return firetoast(
        "Something went wrong while adding option value deatils",
        "default-error"
      );
    }
  };
  return (
    <>
      <div>
        <b style={{ fontWeight: "600", fontSize: "15px" }}>
          Select the availabe variants from the list{" "}
        </b>
      </div>
      <div className="row">
        <div className="col-6">
          <select
            className="form-control"
            onChange={(e) => {
              getOptionValues(e.target.value);
              setOptionid(e.target.value);
              // getOptionsValues(e.target.value);
            }}
          >
            <option value={"null"}>Select Options</option>
            {Variations.map((item, index) => (
              <option
                value={item.value}
                key={index}
                selected={OptionId === item.value}
              >
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {optionid !== null && optionid !== "null" && (
          <div className="col-6">
            <div style={{ float: "left" }}>
              <button
                className="btn btn-success"
                // onClick={() => AddNewOption()}
                onClick={() => {
                  setshowModal(!showModal);
                  setVariationList();
                }}
              >
                Add New Variant Value
              </button>
            </div>
          </div>
        )}
      </div>
      {VariationValues.reverse().map((item, index) => (
        <div
          className="row p-3 m-3"
          style={{ border: "1px solid rgba(128, 128, 128, 0.58) " }}
          key={index}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="ftw-400 text-default">
              {item.VariantName} - {item.VariantValue}
            </h5>
            {!item.isNew && VariationValues.length > 1 && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => removeVariantValue(item.OptionValueID)}
              >
                <i className="fas fa-times text-danger"></i>
              </div>
            )}
          </div>

          <div className="col-6">
            <label>Value</label>
            <input
              className="form-control"
              type="text"
              name="VariantValue"
              onChange={(e) => handleVariationValueChange(e, index)}
              value={item.VariantValue}
            />
          </div>
          <div className="col-6">
            <label>SKU</label>
            <input
              className="form-control"
              type="text"
              value={item.SKU}
              name="SKU"
              onChange={(e) => handleVariationValueChange(e, index)}
            />
          </div>
          <div className="col-6">
            <label>Price</label>
            <input
              className="form-control"
              type="text"
              value={item.Price}
              onChange={(e) => handleVariationValueChange(e, index)}
              name="Price"
            />
            <Alert color="success" className="p-1 m-1">
              Total Price ={" "}
              {`${Currency}  ${
                parseFloat(Price ? Price : 0) +
                parseFloat(item.Price ? item.Price : 0)
              } ,this amount is sum of base price of this product and current variation value price`}{" "}
            </Alert>
          </div>
          <div className="col-6">
            <label>Inventory</label>
            <input
              className="form-control"
              type="number"
              value={item.Inventory}
              onChange={(e) => handleVariationValueChange(e, index)}
              name="Inventory"
            />
          </div>
          <div className="col-6">
            <label>Available Inventory</label>
            <input
              className="form-control"
              type="number"
              onChange={(e) => handleVariationValueChange(e, index)}
              name="AvailableInventory"
              value={item.AvailableInventory}
            />
          </div>
          <div className="col-6">
            <label>Total Price</label>
            <input
              className="form-control"
              type="number"
              onChange={(e) => handleVariationValueChange(e, index)}
              name="TotalPrice"
              value={item.TotalPrice}
            />
          </div>
          <div className="col-6">
            <label>Unit Price</label>
            <input
              className="form-control"
              type="number"
              onChange={(e) => handleVariationValueChange(e, index)}
              name="UnitPrice"
              value={item.UnitPrice}
            />
          </div>

          <div className="col-6">
            <div className="row ">
              <div className="col-6">
                <label>Image </label>
                <input
                  className="form-control"
                  type="file"
                  onChange={(e) =>
                    handleUpdateVarantValueImage(e.target.files[0], index)
                  }
                />

                <div className="col-6">
                  {!item.isNew && (
                    <>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input default-check-color"
                          type="checkbox"
                          id="inlineCheckbox3"
                          defaultChecked={item.MainImage === "Y"}
                          onChange={() =>
                            handleVariationValueMainImageChange(
                              item.MainImage === "Y" ? "N" : "Y",
                              index
                            )
                          }
                        />
                        <label
                          className="form-check-label"
                          for="inlineCheckbox3"
                        >
                          Main Image
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
              <div className="col-6 mt-3">
                <img src={`${Endpoint}/${item.Medium}`} className="img-fluid" />
              </div>
            </div>
          </div>

          <div className="w-100">
            {item.isNew ? (
              <div style={{ float: "right" }}>
                <button
                  className="btn btn-success"
                  onClick={() => AddNewOptionValue(item)}
                >
                  Add Value{" "}
                </button>
              </div>
            ) : (
              <div style={{ float: "right" }} className="mt-3">
                <button
                  className="btn btn-success"
                  onClick={(e) =>
                    submitOptionValueDetail(item.OptionValueID, item)
                  }
                >
                  Save{" "}
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
      <Modal
        toggle={() => setshowModal(!showModal)}
        isOpen={showModal}
        size="lg"
      >
        <ModalHeader toggle={() => setshowModal(!showModal)}>
          Custom Value
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-6">
              <label>Value</label>
              {isAddCustom ? (
                <input
                  className="form-control"
                  type="text"
                  name="VariantValue"
                  id="valueName"
                  onChange={() => setModalButton(false)}
                />
              ) : (
                <select
                  className="form-control"
                  type="text"
                  name="VariantValue"
                  id="valueName"
                  onChange={() => setModalButton(false)}
                >
                  <option value={""}>Select Available Option</option>
                  {AvailabaleValues.map((item, index) => (
                    <option value={item.VariantValue}>
                      {item.VariantValue}
                    </option>
                  ))}
                </select>
              )}
              {isAddCustom ? (
                <Link
                  to="#"
                  className="td-none text-danger"
                  onClick={() => {
                    setIsAddCustom(false);
                    document.getElementById("valueName").value = "";
                  }}
                >
                  Cancel
                </Link>
              ) : (
                <Link
                  to="#"
                  className="td-none text-default"
                  onClick={() => {
                    setIsAddCustom(true);
                    document.getElementById("valueName").value = "";
                  }}
                >
                  Add Custom
                </Link>
              )}
            </div>
            <div className="col-6">
              <label>SKU</label>
              <input className="form-control" type="text" id="variantSKU" />
            </div>
            <div className="col-6">
              <label>Price</label>
              <input
                className="form-control"
                type="text"
                id="variantPrice"
                onChange={(e) => setModalPrice(e.target.value)}
              />
              <Alert color="success" className="p-1 m-1">
                Total Price ={" "}
                {`${Currency}  ${
                  parseFloat(Price ? Price : 0) +
                  parseInt(ModalPrice ? ModalPrice : 0)
                } ,this amount is sum of base price of this product and current variation value price`}{" "}
              </Alert>
            </div>
            <div className="col-6">
              <label>Inventory</label>
              <input
                className="form-control"
                type="number"
                id="variantInventory"
              />
            </div>
            <div className="col-6">
              <label>Available Inventory</label>
              <input
                className="form-control"
                type="number"
                id="variantAvailableInventory"
              />
            </div>
            <div className="col-6">
              <label>Total Price</label>
              <input
                className="form-control"
                type="number"
                id="variantTotalPrice"
              />
            </div>
            <div className="col-6">
              <label>Unit Price</label>
              <input
                className="form-control"
                type="number"
                id="variantUnitPrice"
              />
            </div>

            <div className="col-6">
              <label>Image </label>
              <input className="form-control" type="file" id="variantImage" />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="success"
            onClick={() => CreateNewValue()}
            disabled={ModalButton}
          >
            Add Value
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </>
  );
}
export default EditProductVariants;
