import { Card, CardBody, Col, Row } from "reactstrap";
import { useHistory } from "react-router-dom";
import ProductFormFields from "./Product Form Components/ProductFormFields";
import ProductFormImages from "./Product Form Components/ProductFormImages";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import { useEffect, useState, useContext } from "react";
import { PRODUCT_FORM_CONTEXT } from "./../../../Contexts/ProductFormContext";
import { CurrentUser } from "./../../../../Helpers/Auth";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import ProductVariants from "./Product Form Components/ProductVariants";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
function ProductForm() {
  const history = useHistory();
  useContext(PRODUCT_FORM_CONTEXT);
  const [show, setShow] = useState(1);
  const [step1Submission, setStep1Submission] = useState(false);
  const [subcategories, setSubCategories] = useState([]);
  const [Title, setTitle] = useState("");
  const [SubCategoryID, setSubCategoryID] = useState("");
  const [Currency, setCurrency] = useState("");
  const [CostPrice, setCostPrice] = useState(0);
  const [Price, setPrice] = useState(0);
  const [VariantPrice, setVariantPrice] = useState(0);
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
  const [AllowStorePickup, setAllowStorePickup] = useState("N");
  const [ShippingAvailable, setShippingAvailable] = useState("Y");
  const [ShippingGlobal, setShippingGlobal] = useState("Y");
  const [ShippingByAdmin, setShippingByAdmin] = useState("Y");
  const [ShippingByVendor, setShippingByVendor] = useState("N");
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
  const [ProductApproval, setProductApproval] = useState("Y");
  const [VariationActual, setVariationActual] = useState([]);
  const [ShippingCostVendorCountry, setShippingCostVendorCountry] = useState(0);
  const [ShowContent , setShowContent] = useState(true);
  const [ShippingCostKiloVendorCountry, setShippingCostKiloVendorCountry] =
    useState(0);
  const [CityShippingCost, setCityShippingCost] = useState([{}]);
  const [Business, setBusiness] = useState(null);
  const [CodStatus, setCodStatus] = useState("N");
  const [FreeProductReturn, setFreeProductReturn] = useState("N");
  useEffect(() => {
    getSubCategories();
    getVendorStores();
    getVendorBusiness();
    // getOptions()
  }, []);
  var getVendorStores = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/store-management/store-details/${CurrentUser.UserID}`
      );
      setVendorStores(response.data.Store);
      if(response.data.Store.length>0){
        setShowContent(false)
         }    }
      catch (e) {
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
      // var response = await BanglaBazarApi.get(
      //   `${Endpoint}/api/category/get-allSubCategory`
      // );
       var response = await BanglaBazarApi.get(
        `${Endpoint}/api/store-management/get-vendorSubCategory/${CurrentUser.UserID}`
      );
      setSubCategories(response.data.VendorSubCategory);
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
      setOptions(response.data.ProductVariantOptionName);
    } catch (e) {
      return firetoast(
        "Something went wrong while fetching options",
        "default-error"
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
      var data = {
        VendorID: CurrentUser.UserID,
        Title: Title,
        SubCategoryID: SubCategoryID,
        Description: Description,
        SpecialInstruction: SpecialInstruction,
        ReturnPolicy: ReturnPolicy,
        Currency: Currency,
        CostPrice: CostPrice,
        Price: Price,
        PromotionPrice: PromotionPrice,
        PromotionRate:
          PromotionRate > 1
            ? (parseFloat(PromotionRate) / 100).toFixed(2)
            : PromotionRate,
        PromotionStartDate: PromotionStartDate,
        PromotionEndDate: PromotionEndDate,
        Weight: Weight,
        Height: Height,
        Length: Length,
        Width: Width,
        AllowStorePickup: AllowStorePickup,
        ShippingAvailable: ShippingAvailable,
        ShippingGlobal: ShippingGlobal,
        ShippingByAdmin: ShippingByAdmin,
        ShippingByVendor: ShippingByVendor,
        ShippingCostAdmin: ShippingCostAdmin,
        ShippingCostVendor: ShippingCostVendor,
        ReviewedByAdmin: ReviewedByAdmin,
        TaxVATApply: TaxVATApply,
        LockEdit: LockEdit,
        Active: Active,
        StoreName: StoreName,
        Quantity1: Quantity1,
        Quantity2: Quantity2,
        Quantity3: Quantity3,
        PriceQuantity1: PriceQuantity1,
        PriceQuantity2: PriceQuantity2,
        PriceQuantity3: PriceQuantity3,
        ProductApproval: ProductApproval,
        ShippingCostVendorCountry: ShippingCostVendorCountry,
        ShippingCostKiloVendorCountry: ShippingCostKiloVendorCountry,
      };
      if (ShippingByVendor === "Y") {
        if (CityShippingCost.length > 0) {
          for (let i = 0; i < CityShippingCost.length; i++) {
            if (
              !CityShippingCost[i].CityID ||
              CityShippingCost[i].CityID === ""
            ) {
              return firetoast(
                `Please select City in row ${i} in city rate list`
              );
            }
            if (
              !CityShippingCost[i].ShippingCostVendorCity ||
              CityShippingCost[i].ShippingCostVendorCity === ""
            ) {
              return firetoast(
                `Please add shipping cost in row ${i} in city rate list`
              );
            }
            if (
              !CityShippingCost[i].ShippingCostKiloVendorCity ||
              CityShippingCost[i].ShippingCostKiloVendorCity === ""
            ) {
              return firetoast(
                `Please add shipping cost per kilo in row ${i} in city rate list`
              );
            }
          }
        }
      }
      data["CityShippingCost"] = CityShippingCost;
      data["Status"] = CodStatus;
      data["FreeProductReturn"] = FreeProductReturn;
      var _variants = [];

      for (let i = 0; i < Variations.length; i++) {
        _variants.push(Variations[i].value);
      }
      data["Variations"] = _variants;
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/addProduct-Form1`,
        data
      );
      if (response.data.status) {
        await setProductID(response.data.ProductID);
        await getOptions(response.data.ProductID);
        setShow(2);
        setStep1Submission(true);
        firetoast("Product added successfully", "success", 3000, "top-right");
      } else {
        var { messsage, error } = response.data;
        firetoast(messsage || error, "error", 3000, "top-right");
      }
    } catch (e) {
      console.log(e);
      firetoast(
        "Something went wrong while saving product information",
        "error",
        3000,
        "top-right"
      );
    }
  };
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
  return (
    <div className="mt-5">
      <>
        <h4 className="mb-4">
        {
                      ShowContent ?
                         <><h2 className=" text-danger float-right ">You cannot add Product as store is not approved yet</h2></>
                      :  <></>
                       }
          <span
            onClick={() => history.push("/panel/product-management")}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-chevron-left"></i>
          </span>{" "}
          Add Product
        </h4>
        <PRODUCT_FORM_CONTEXT.Provider
          value={{
            Business,
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
            ProductApproval,
            setProductApproval,
            VariationActual,
            setVariationActual,
            VariantPrice,
            setVariantPrice,
            ShippingCostVendorCountry,
            setShippingCostVendorCountry,
            ShippingCostKiloVendorCountry,
            setShippingCostKiloVendorCountry,
            CityShippingCost,
            setCityShippingCost,
            VendorStores,
            setCodStatus,
            CodStatus,
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
                    {step1Submission && (
                      <li
                        className={show === 2 ? "active" : ""}
                        onClick={() => setShow(2)}
                        style={{ fontSize: "16px", padding: "15px 5px" }}
                      >
                        Product Variant Detail
                      </li>
                    )}
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
                  <ProductFormFields />
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
                    <ProductVariants />
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </PRODUCT_FORM_CONTEXT.Provider>
      </>
    </div>
  );
}
export default ProductForm;
