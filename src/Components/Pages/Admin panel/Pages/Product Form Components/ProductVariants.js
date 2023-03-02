import { useContext, useState, useEffect } from "react";
import { PRODUCT_FORM_CONTEXT } from "./../../../../Contexts/ProductFormContext";
import { useHistory } from "react-router-dom";
import firetoast from "./../../../../../Helpers/FireToast";
import Resizer from "react-image-file-resizer";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../../Utils/Endpoint";
import CheckEmpty from "./../../../../../Utils/CheckEmpty";
import moment from "moment";
import { Alert } from "reactstrap";
function ProductVariants() {
  var history = useHistory();
  var [VariationValues, setVariationValues] = useState([]);
  var [selectedVal, setSelectedVal] = useState(null);
  var [AvaialabelOptions, setAvaialabelOptions] = useState(false);
  var [currentVariationCreated, setCurrentVariationCreated] = useState(false);
  const {
    Options,
    setOptions,
    SubCategoryVariants,
    SKU,
    setSKU,
    Price,
    Status,
    Currency,
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
    VariantPrice,
    setVariantPrice,
  } = useContext(PRODUCT_FORM_CONTEXT);
  var UpdateVarantValueImage = async (file) => {
    if (file) {
      // console.log(await VariantImageResizer(file,1,1))

      await Resizer.imageFileResizer(
        file,
        100,
        100,
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
        225,
        225,
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
  var submitOptionValueDetail = async () => {
    if (CheckEmpty(OptionValue)) {
      return firetoast("Option Value Name is required", "default-error");
    }
    if (CheckEmpty(SKU)) {
      return firetoast("SKU is required", "default-error");
    }
    if (CheckEmpty(VariantPrice)) {
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
    var detail = {
      ProductID: ProductID,
      StoreName: StoreName,
      OptionID: OptionId,
    };
    try {
      var form = new FormData();
      form.append("ProductID", ProductID);
      form.append("StoreName", StoreName);
      form.append("OptionID", OptionId);
      form.append("OptionValue", OptionValue);
      form.append("MainImage", currentVariationCreated ? "N" : "Y");
      form.append("SKU", SKU);
      form.append("Price", VariantPrice);
      form.append("AvailableInventory", AvailableInventory);
      form.append("Inventory", Inventory);
      form.append("UnitPrice", UnitPrice);
      form.append("TotalPrice", TotalPrice);
      form.append("Status", Status);
      form.append("Small", Small);
      form.append("Medium", Medium);
      form.append("Large", Large);
      form.append("LastUpdate", moment("YYYY-MM-DD"));

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
        clearDetails();
        setCurrentVariationCreated(true);
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
    setSelectedVal("null");
    // setOptionId("null");
    document.getElementById("valueName").value = "";
    setVariantPrice("");
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
      // http://192.168.2.119:3001/api/category/get-subcategoryvariantvalue/16
      const response = await BanglaBazarApi.get(
        `${Endpoint}/api/category/get-subcategoryvariantvalue/${id}`
      );
      var data = response.data.SubCategoryVariantValue;
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
  let setVariantValue = async (e) => {
    document.getElementById("valueName").value = "";
    setSelectedVal(null);

    setSKU("");
    setVariantPrice("");
    setInventory(0);
    setTotalPrice(0);
    setUnitPrice(0);
    setAvailableInventory(0);

    document.getElementById("valueName").value = e === "null" ? "" : e;
    setOptionValue(document.getElementById("valueName").value);
    setSelectedVal(e);
  };
  let setBeforeOptionId = async (e) => {
    console.log(e);
    let foundVariationLabel = "";
    for (let i = 0; i < Variations.length; i++) {
      if (parseInt(e) === parseInt(Variations[i].id)) {
        foundVariationLabel = Variations[i].value;
      }
    }
    console.log(foundVariationLabel);
    for (let i = 0; i < Options.length; i++) {
      if (Options[i].OptionName === foundVariationLabel) {
        setOptionId(Options[i].OptionID);
      }
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-6">
          <div>
            <b style={{ fontWeight: "600", fontSize: "15px" }}>
              Select the availabe variants from the list{" "}
            </b>
          </div>
          <div className="row">
            <div className="col-12">
              <select
                // value={OptionId}
                className="form-control"
                onChange={(e) => {
                  setBeforeOptionId(e.target.value);
                  getOptionValues(e.target.value);
                  setSelectedVal("null");

                  document.getElementById("valueName") &&
                    (document.getElementById("valueName").value = "");
                }}
              >
                <option value={"null"}>Select Options</option>
                {Variations.map((item, index) => (
                  <option
                    value={item.id}
                    key={index}
                    selected={OptionId === item.id}
                  >
                    {item.value}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="col-6">
          <div>
            <b style={{ fontWeight: "600", fontSize: "15px" }}>
              Select the availabe variants values from the list{" "}
            </b>
          </div>
          <div className="row">
            <div className="col-12">
              <select
                className="form-control"
                onChange={(e) => {
                  setVariantValue(e.target.value);
                }}
              // onChange={(e) => {
              //   setOptionId(e.target.value);
              //   getOptionValues(e.target.value);
              // }}
              >
                <option value={"null"}>Select Options</option>
                {VariationValues.map((item, index) => (
                  <option value={item.VariantValue} key={index}>
                    {item.VariantValue}
                  </option>
                ))}
                {VariationValues.length > 0 && (
                  <option value={"null"}>Add Custom</option>
                )}
              </select>
            </div>
          </div>
        </div>
      </div>

      {VariationValues.length > 0 && (
        <div
          className="row p-3 m-3"
          style={{ border: "1px solid rgba(128, 128, 128, 0.58) " }}
        >
          <h5 className="ftw-400 text-default">Variant Value Detail</h5>

          <div className="col-6">
            <label>Value</label>
            <input
              className="form-control"
              type="text"
              id="valueName"
              // value={OptionValue}
              disabled={!selectedVal || selectedVal === "null" ? false : true}
              onChange={(e) => setOptionValue(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>SKU</label>
            <input
              className="form-control"
              type="text"
              value={SKU}
              onChange={(e) => setSKU(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Price</label>
            <input
              className="form-control"
              type="number"
              value={VariantPrice}
              onChange={(e) => setVariantPrice(e.target.value)}
            />
            <Alert color="success" className="p-1 m-1">
              Total Price of this variant value is :{"  "}
              {`${Currency} ${parseInt(Price ? Price : 0) +
                parseInt(VariantPrice ? VariantPrice : 0)
                } ,this amount is sum of base price of this product and current variation value price`}
            </Alert>
          </div>
          <div className="col-6">
            <label>Inventory</label>
            <input
              className="form-control"
              type="number"
              value={Inventory}
              onChange={(e) => setInventory(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Total Price</label>
            <input
              className="form-control"
              type="number"
              value={TotalPrice}
              onChange={(e) => setTotalPrice(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Unit Price</label>
            <input
              className="form-control"
              type="number"
              value={UnitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Available Inventory</label>
            <input
              className="form-control"
              type="number"
              value={AvailableInventory}
              onChange={(e) => setAvailableInventory(e.target.value)}
            />
          </div>
          <div className="col-6">
            <label>Image </label>
            <input
              className="form-control"
              type="file"
              onChange={(e) => UpdateVarantValueImage(e.target.files[0])}
            />
          </div>

          <div className="mt-2">
            <div style={{ float: "right" }}>
              <button
                className="btn btn-success"
                onClick={(e) => submitOptionValueDetail()}
              >
                Save{" "}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-2" style={{ textAlign: "right" }}>
        <button
          className="btn btn-success"
          onClick={() => history.push("/panel/product-management")}
        >
          Done
        </button>
      </div>
    </>
  );
}
export default ProductVariants;
