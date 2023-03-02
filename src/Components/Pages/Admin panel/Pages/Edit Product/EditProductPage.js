import { Card, CardBody, Col, Row } from "reactstrap";
import { useHistory, useParams } from "react-router-dom";
import firetoast from "./../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../Utils/Endpoint";
import { useEffect, useState, useContext } from "react";
import { PRODUCT_FORM_CONTEXT } from "./../../../../Contexts/ProductFormContext";
import { CurrentUser } from "./../../../../../Helpers/Auth";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import CheckEmpty from "./../../../../../Utils/CheckEmpty";
import EditProductFormFields from "./EditProductFormFields";
import EditProductVariants from "./EditProductFormVariants";
import moment from "moment";
function EditProductPage() {
  const history = useHistory();
  const { productID, vendorID } = useParams();
  useContext(PRODUCT_FORM_CONTEXT);
  const [show, setShow] = useState(1);
  const [step1Submission, setStep1Submission] = useState(false);
  const [subcategories, setSubCategories] = useState([]);
  const [Title, setTitle] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [Currency, setCurrency] = useState("");
  const [CostPrice, setCostPrice] = useState(0);
  const [Price, setPrice] = useState(0);
  const [PromotionPrice, setPromotionPrice] = useState(0);
  const [PromotionRate, setPromotionRate] = useState(0);
  const [PromotionStartDate, setPromotionStartDate] = useState("");
  const [PromotionEndDate, setPromotionEndDate] = useState("");
  const [Weight, setWeight] = useState(0);
  const [Height, setHeight] = useState(0);
  const [Length, setLength] = useState(0);
  const [Width, setWidth] = useState(0);
  const [Description, setDescription] = useState("");
  const [SpecialInstruction, setSpecialInstruction] = useState("");
  const [ReturnPolicy, setReturnPolicy] = useState("");
  const [AllowStorePickup, setAllowStorePickup] = useState("Y");
  const [ShippingAvailable, setShippingAvailable] = useState("Y");
  const [ShippingGlobal, setShippingGlobal] = useState("Y");
  const [ShippingByAdmin, setShippingByAdmin] = useState("Y");
  const [ShippingByVendor, setShippingByVendor] = useState("Y");
  const [ShippingCostAdmin, setShippingCostAdmin] = useState("Y");
  const [ShippingCostVendor, setShippingCostVendor] = useState("Y");
  const [ReviewedByAdmin, setReviewedByAdmin] = useState("N");
  const [TaxVATApply, setTaxVATApply] = useState("Y");
  const [Active, setActive] = useState("N");
  const [LockEdit, setLockEdit] = useState("Y");
  const [SubCategoryVariants, setSubCategoriesVariants] = useState([]);
  const [AvailableInventory, setAvailableInventory] = useState(0);
  const [UnitPrice, setUnitPrice] = useState(0);
  const [TotalPrice, setTotalPrice] = useState(0);
  const [MainImage, setMainImage] = useState("Y");
  const [SKU, setSKU] = useState("");
  const [Inventory, setInventory] = useState(0);
  const [Status, setStatus] = useState("N");
  const [Small, setSmall] = useState("");
  const [Medium, setMedium] = useState("");
  const [Large, setLarge] = useState("");
  const [VendorStores, setVendorStores] = useState([]);
  const [StoreName, setStoreName] = useState("");
  const [Options, setOptions] = useState([]);
  const [StoreID, setStoreID] = useState("");
  const [Quantity1, setQuantity1] = useState(0);
  const [PriceQuantity1, setPriceQuantity1] = useState(0);
  const [Quantity2, setQuantity2] = useState(0);
  const [PriceQuantity2, setPriceQuantity2] = useState(0);
  const [Quantity3, setQuantity3] = useState(0);
  const [PriceQuantity3, setPriceQuantity3] = useState(0);
  const [Variations, setVariations] = useState([]);
  const [ProductID, setProductID] = useState("");
  const [OptionId, setOptionId] = useState("null");
  const [OptionValue, setOptionValue] = useState("");
  const [VendorID, setVendorID] = useState("");
  const [AdminNote, setAdminNote] = useState("");
  const [ProductApproval, setProductApproval] = useState("Y");
  const [isNew, setIsNew] = useState(false);
  const [AvailableVariations, setAvailableVariations] = useState([]);
  const [Business, setBusiness] = useState(null);
  const [ShippingCostVendorCountry, setShippingCostVendorCountry] = useState(0);
  const [ShippingCostKiloVendorCountry, setShippingCostKiloVendorCountry] =
    useState(0);
  const [CityShippingCost, setCityShippingCost] = useState([{}]);
  const [CodStatus, setCodStatus] = useState("N");
  const [FreeProductReturn, setFreeProductReturn] = useState("N");

  useEffect(async () => {
    await getProductDetails();
    await getSubCategories();
    await getVendorStores(vendorID);
    await getOptions(productID);
    getVendorBusiness();
  }, []);
  var getVendorBusiness = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/store-management/buisness-details/${CurrentUser.UserID}`
      );
      setBusiness(response.data.business);
    } catch (e) {
      console.log(e);
    }
  };
  var getVendorStores = async (VendorID) => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/store-management/store-details/${VendorID}`
      );
      setVendorStores(response.data.Store);
    } catch (e) {
      firetoast(
        "Someting went wrong while fetching stores",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var getSubCategories = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/category/get-allSubCategory`
      );
      setSubCategories(response.data.SubCategory);
    } catch (e) {
      firetoast(
        "Error while getting subcategories",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var getOptions = async (id) => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/product/get-productVariantOption/${id}`
      );
      //   setOptions(response.data.ProductVariantOptionName);
      var data = response.data.ProductVariantOptionName;
      var array = [];
      for (var i = 0; i < data.length; i++) {
        var obj = {
          label: data[i].OptionName,
          value: data[i].OptionID,
          isNew: false,
        };
        array.push(obj);
      }
      setOptions(array);
      setVariations(array);
    } catch (e) {
      return firetoast(
        "Something went wrong while fetching options",
        "default-error"
      );
    }
  };
  var getSubCategoryVariants = async (id) => {
    // http://192.168.2.119:3001/api/category/get-subcategoryvariant/63
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/category/get-subcategoryvariant/${id}`
      );

      var array2 = [];
      if (response.data.status) {
        var data = response.data.SubCategoryVariant;
        for (let i = 0; i < data.length; i++) {
          var obj2 = {
            label: data[i].Variant,
            value: data[i].Variant,
            id: data[i].SubCategoryVariantID,
          };

          array2.push(obj2);
        }
        // console.log(array);
        setAvailableVariations(array2);
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
  var scrollToView = (name) => {
    var element = document.getElementById(name);
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  };
  var submitProduct = async () => {
    if (CheckEmpty(SubCategoryID)) {
      scrollToView("subcategory");
      return firetoast(
        "Please select any subcategory for your product",
        "default-error"
      );
    }
    if (CheckEmpty(Title)) {
      scrollToView("title");
      return firetoast("Title for your product is required", "default-error");
    }
    if (CheckEmpty(Description)) {
      scrollToView("description");
      return firetoast(
        "Description of the product can't be empty",
        "default-error"
      );
    }
    if (CheckEmpty(ReturnPolicy)) {
      scrollToView("returnpolicy");
      return firetoast(
        "Please enter the return policy for the product",
        "default-error"
      );
    }
    console.log(Currency, "Currency--------------------")
    if (CheckEmpty(Currency)) {
      scrollToView("currency");
      return firetoast("Curreny is required", "default-error");
    }
    if (CheckEmpty(Price)) {
      scrollToView("price");
      return firetoast("Price for the product is required", "default-error");
    }
    if (CheckEmpty(Weight)) {
      scrollToView("weight");
      return firetoast("Please provide the product weight", "default-error");
    }
    if (CheckEmpty(Height)) {
      scrollToView("height");
      return firetoast("Please provide the product height", "default-error");
    }
    if (CheckEmpty(Length)) {
      scrollToView("length");
      return firetoast("Please provide the product Length", "default-error");
    }
    if (CheckEmpty(Width)) {
      scrollToView("width");
      return firetoast("Please provide the product Width", "default-error");
    }
    if (CheckEmpty(StoreName)) {
      scrollToView("storename");
      return firetoast(
        "Please provide the product store name",
        "default-error"
      );
    }
    if (Variations.length < 1) {
      scrollToView("variations");
      return firetoast("Atleast one variation is required", "default-error");
    }

    try {
      var form = new URLSearchParams();
      form.append("VendorID", vendorID);
      form.append("Title", Title);
      form.append("SubCategoryID", SubCategoryID);
      form.append("Description", Description);
      form.append("SpecialInstruction", SpecialInstruction);
      form.append("ReturnPolicy", ReturnPolicy);
      form.append("Currency", Currency);
      form.append("CostPrice", CostPrice);
      form.append("Price", Price);
      form.append("PromotionPrice", PromotionPrice);
      form.append("PromotionRate", PromotionRate);
      form.append(
        "PromotionStartDate",
        PromotionStartDate
          ? moment(PromotionStartDate).format("YYYY-MM-DD")
          : ""
      );
      form.append(
        "PromotionEndDate",
        PromotionEndDate ? moment(PromotionEndDate).format("YYYY-MM-DD") : ""
      );
      form.append("Weight", Weight);
      form.append("Height", Height);
      form.append("Length", Length);
      form.append("Width", Width);
      form.append("AllowStorePickup", AllowStorePickup);
      form.append("ShippingAvailable", ShippingAvailable);
      form.append("ShippingGlobal", ShippingGlobal);
      form.append("ShippingByAdmin", ShippingByAdmin);
      form.append("ShippingByVendor", ShippingByVendor);
      form.append("ShippingCostAdmin", ShippingCostAdmin);
      form.append("ShippingCostVendor", ShippingCostVendor);
      form.append("ReviewedByAdmin", ReviewedByAdmin);
      form.append("TaxVATApply", TaxVATApply);
      form.append("LockEdit", LockEdit);
      form.append("Active", Active);
      form.append("StoreName", StoreName);
      form.append("AdminNote", AdminNote);
      // form.append("SKU", SKU);

      // form.append("AvailableInventory", AvailableInventory);
      // form.append("Inventory", Inventory);
      // form.append("UnitPrice", UnitPrice);
      // form.append("TotalPrice", TotalPrice);
      // form.append("Status", Status);
      // form.append("Small", Small);
      // form.append("Medium", Medium);
      // form.append("Large", Large);
      form.append("ProductApproval", ProductApproval);
      form.append("Quantity1", Quantity1);
      form.append("Quantity2", Quantity2);
      form.append("Quantity3", Quantity3);
      form.append("PriceQuantity1", PriceQuantity1);
      form.append("PriceQuantity2", PriceQuantity2);
      form.append("PriceQuantity3", PriceQuantity3);
      form.append("isNew", isNew);
      form.append("Status", CodStatus);
      form.append("FreeProductReturn", FreeProductReturn);

      for (let i = 0; i < Variations.length; i++) {
        form.append(`Variations[${i}]`, Variations[i].label);
        form.append(`OptionID[${i}]`, Variations[i].value);
      }

      var response = await BanglaBazarApi.put(
        `${Endpoint}/api/product/updateProduct-Form1/${productID}`,
        form
      );
      if (response.data.status) {
        await setProductID(productID);
        await getOptions(productID);
        // setShow(2);
        // setStep1Submission(true);
        firetoast("Product updated successfully", "success", 3000, "top-right");
      } else {
        var { messsage, error } = response.data;
        firetoast(messsage || error, "error", 3000, "top-right");
      }
    } catch (e) {
      console.log(e);
      firetoast(
        "Something went wrong while updating product information",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var getProductDetails = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/product/get-productDetails/${productID}`
      );
      var {
        VendorID,
        SubCategoryID,
        Title,
        Description,
        SpecialInstruction,
        ReturnPolicy,
        Currency,
        CostPrice,
        Price,
        Quantity1,
        PriceQuantity1,
        Quantity2,
        PriceQuantity2,
        Quantity3,
        PriceQuantity3,
        PromotionPrice,
        PromotionRate,
        PromotionStartDate,
        PromotionEndDate,
        Weight,
        Height,
        Length,
        Width,
        AllowStorePickup,
        ShippingAvailable,
        ShippingGlobal,
        ShippingByAdmin,
        ShippingByVendor,
        ShippingCostAdmin,
        ShippingCostVendor,
        ReviewedByAdmin,
        TaxVATApply,
        LockEdit,
        Active,
        LastUpdate,
        AdminNote,
        StoreName,
        ProductApproval,
        FreeProductReturn,
      } = response.data.Product;
      setVendorID(VendorID);
      setSubCategoryID(SubCategoryID);
      setTitle(Title);
      setDescription(Description);
      setSpecialInstruction(SpecialInstruction);
      setReturnPolicy(ReturnPolicy);
      setCurrency(Currency);
      setCostPrice(CostPrice);
      setPrice(Price);
      setQuantity1(Quantity1);
      setPriceQuantity1(PriceQuantity1);
      setQuantity2(Quantity2);
      setQuantity3(Quantity3);
      setPriceQuantity2(PriceQuantity2);
      setPriceQuantity3(PriceQuantity3);
      setPromotionPrice(PromotionPrice);
      setPromotionRate(PromotionRate);
      setPromotionStartDate(PromotionStartDate);
      setPromotionEndDate(PromotionEndDate);
      setWeight(Weight);
      setHeight(Height);
      setLength(Length);
      setWidth(Width);
      setAllowStorePickup(AllowStorePickup);
      setProductApproval(ProductApproval ? ProductApproval : "N");
      setShippingAvailable(ShippingAvailable);
      setShippingGlobal(ShippingGlobal);
      setShippingByAdmin(ShippingByAdmin);
      setShippingByVendor(ShippingByVendor);
      setShippingCostAdmin(ShippingCostAdmin);
      setShippingCostVendor(ShippingCostVendor);
      setReviewedByAdmin(ReviewedByAdmin);
      setTaxVATApply(TaxVATApply);
      setLockEdit(LockEdit);
      setActive(Active);
      setAdminNote(AdminNote);
      setStoreName(StoreName);
      getSubCategoryVariants(SubCategoryID);
      setFreeProductReturn(FreeProductReturn);
    } catch (e) {
      console.log(e);
      firetoast("Something went wrong", "default-error");
    }
  };

  return (
    <div className="mt-5">
      <>
        <h4 className="mb-4">
          <span
            onClick={() => history.push("/panel/product-management")}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-chevron-left"></i>
          </span>{" "}
          Edit Product
        </h4>
        <PRODUCT_FORM_CONTEXT.Provider
          value={{
            CityShippingCost,
            setCityShippingCost,
            ShippingCostKiloVendorCountry,
            setShippingCostKiloVendorCountry,
            ShippingCostVendorCountry,
            setShippingCostVendorCountry,
            Business,
            getOptions,
            isNew,
            setIsNew,
            VendorID,
            setVendorID,
            ProductID,
            setProductID,
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
            SubCategoryVariants,
            setSubCategoriesVariants,
            AvailableInventory,
            setAvailableInventory,
            UnitPrice,
            setUnitPrice,
            TotalPrice,
            setTotalPrice,
            MainImage,
            setMainImage,
            SKU,
            setSKU,
            Inventory,
            setInventory,
            Status,
            setStatus,
            Small,
            setSmall,
            Medium,
            setMedium,
            Large,
            setLarge,
            StoreName,
            setStoreName,
            VendorStores,
            Options,
            setOptions,
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
            submitProduct,
            Variations,
            setVariations,
            StoreID,
            setStoreID,
            step1Submission,
            OptionId,
            setOptionId,
            OptionValue,
            setOptionValue,
            getOptions,
            ProductApproval,
            setProductApproval,
            AvailableVariations,
            CodStatus,
            setCodStatus,
            FreeProductReturn,
            setFreeProductReturn,
          }}
        >
          <Card>
            <CardBody>
              <Row>
                <Col md={3}>
                  <ul style={{ listStyle: "none" }} className="setting-ul mt-5">
                    <li
                      className={show === 1 ? "active" : ""}
                      onClick={() => setShow(1)}
                      style={{ fontSize: "16px", padding: "15px 5px" }}
                    >
                      Product Information
                    </li>

                    <li
                      className={show === 2 ? "active" : ""}
                      onClick={() => setShow(2)}
                      style={{ fontSize: "16px", padding: "15px 5px" }}
                    >
                      Product Variant Detail
                    </li>
                  </ul>
                </Col>
                <Col
                  md={9}
                  style={{
                    display: show === 1 ? "block" : "none",
                    borderLeft: "1px solid #80808094",
                  }}
                >
                  <h3 className="ftw-400 text-default">Product Information</h3>
                  <EditProductFormFields />
                </Col>
                <Col
                  md={9}
                  style={{
                    display: show === 2 ? "block" : "none",
                    borderLeft: "1px solid #80808094",
                  }}
                >
                  {/* <h3 className="ftw-400 text-default">Product Images</h3> */}
                  {/* <ProductFormImages /> */}

                  <div className="mt-5">
                    <h3 className="ftw-400 text-default">Product Variants</h3>
                    <EditProductVariants />
                  </div>
                </Col>
              </Row>
            </CardBody>``
          </Card>
        </PRODUCT_FORM_CONTEXT.Provider>
      </>
    </div>
  );
}
export default EditProductPage;
