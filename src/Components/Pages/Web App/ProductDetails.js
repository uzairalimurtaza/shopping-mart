import { WebsiteHeader } from "./Layout/Header";
import prod1 from "../../../assets/images/prod1.png";
import prod2 from "../../../assets/images/prod2.png";
import prod3 from "../../../assets/images/prod3.png";
import prod4 from "../../../assets/images/prod4.png";
import prod5 from "../../../assets/images/prod5.png";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Collapse,
  List,
  Form,
} from "reactstrap";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Endpoint from "./../../../Utils/Endpoint";
import axios from "axios";
import firetoast from "./../../../Helpers/FireToast";
import Loading from "../../../Utils/Loading";
import { Trending } from "./Layout/Trending";
import TopRatedProducts from "./Layout/TopRatedProducts";
import { useDispatch, useSelector } from "react-redux";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Product_Details_VendorDetails from "./Product Detail Components/PD_VendorDetails";
import Product_Detail_ProductImages from "./Product Detail Components/PD_ProductImages";
import ProductDetailRatingAndReviews from "./Product Detail Components/PD_RatingAndReviews";
import { getProductsDetailsById } from "./../../../Actions/ProductsAction";
import { CurrentUser } from "../../../Helpers/Auth";
import RemoveItemFromWishList from "./../../Api/RemoveItemFromWishList";
import ProductDetail_VariantValues from "./Product Detail Components/PD_VariantValueList";
import { AddCartItems, GetCartItems } from "./../../../Actions/CartAction";
import MaintainUnAuthCart from "./../../../Helpers/MaintainUnAuthCart";

function ProductDetails() {
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state);
  // console.log(state);
  const [tab, setTab] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [Business, setBusiness] = useState(null);
  const [Store, setStore] = useState(null);
  const { productID } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [businessDetails, setbusinessDetails] = useState(null);
  const [VariantDetails, setVariantDetails] = useState([]);
  const [MainImage, setMainImage] = useState(null);
  const [AverageRatingAndReviews, setAverageRatingAndReviews] = useState(null);
  const [RatingCounts, setRatingCounts] = useState(null);
  const [UserReviewsAndRating, setUserReviewsAndRating] = useState([]);
  const { productsDetailById, currentIPv4 } = state;
  const [counter, setCounter] = useState(1);
  const [CurrentlyActive, setCurrentlyActive] = useState(null);
  const [UserID, setUserId] = useState(-1);
  const [inWishList, setinWishList] = useState(false);
  const [SelectedValues, setSelectedValues] = useState({});
  const [activeVariantValue, setActiveVariantValue] = useState("");
  const [AllCountries, setAllCountries] = useState([]);
  // const [CartItemStatus, setCartItemStatus] = useState(false);
  // AddCartItems

  let getTotalPrice = () => {
    let array = SelectedValues;
    let indexes = Object.keys(SelectedValues);

    let sum = parseFloat(productDetail.Price) + 0.0;
    for (let i = 0; i < indexes.length; i++) {
      sum += parseFloat(array[indexes[i]].VariantPrice);
    }
    return sum;
  };
  let setInventoryMinCount = () => {
    let array = SelectedValues;
    let indexes = Object.keys(SelectedValues);

    let inventories = [];
    for (let i = 0; i < indexes.length; i++) {
      inventories.push(array[indexes[i]].Inventory);
    }
    let count = Math.min(...inventories);
    return count;
  };
  var getCountries = async () => {
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + "/api/location/get-vendorAllowedCountries"
      );
      var list = response.data.Countries;
      var temp = [];

      for (let i = 0; i < list.length; i++) {
        temp.push(list[i]["Country"]);
      }
      setAllCountries(temp);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    let id = localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")).UserID
      : -1;
    id !== -1 ? setUserId(id) : setUserId(-1);
    window.scrollTo({ top: 0, behavior: "smooth" });

    dispatch(getProductsDetailsById(productID, id));
    if (productsDetailById.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setProductDetail(productsDetailById.data.ProductDetail);
      setbusinessDetails(productsDetailById.data.BuisnessDetail);
      setVariantDetails(productsDetailById.data.VariantDetails);

      setMainImage(productsDetailById.data.MainImage);
      setAverageRatingAndReviews(
        productsDetailById.data.ProductAverageRatingAndReviews
      );
      setRatingCounts(productsDetailById.data.ProductRatingCount);
      setUserReviewsAndRating(
        productsDetailById.data.UsersProductReviewAndRating
      );
      setinWishList(productsDetailById.data.inWishList);
      getActiveVariantValue();
    }
    if (productsDetailById.error) {
      return firetoast(
        "Something went wrong while fething product details",
        "default-errors"
      );
    }
    getCountries();
  }, [dispatch, productID, CurrentUser]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (productsDetailById.loading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
      setProductDetail(productsDetailById.data.ProductDetail);
      setbusinessDetails(productsDetailById.data.BuisnessDetail);
      setVariantDetails(productsDetailById.data.VariantDetails);
      setMainImage(productsDetailById.data.MainImage);
      setAverageRatingAndReviews(
        productsDetailById.data.ProductAverageRatingAndReviews
      );
      setRatingCounts(productsDetailById.data.ProductRatingCount);
      setUserReviewsAndRating(
        productsDetailById.data.UsersProductReviewAndRating
      );
      getActiveVariantValue();
    }
    if (productsDetailById.error) {
      return firetoast(
        "Something went wrong while fething product details",
        "default-errors"
      );
    }
  }, [dispatch, productsDetailById, productID]);
  // useEffect(async () => {
  //   await getActiveVariantValue();
  // }, [VariantDetails]);
  useEffect(() => {
    dispatch(GetCartItems());
  }, [dispatch, productID, state.removeCartItem]);

  useEffect(() => {
    setCounter(1);
    setinWishList(false);
    setCurrentlyActive(null);
    setVariantDetails([]);
    setSelectedValues({});
  }, [productID]);
  var getActiveVariantValue = async () => {
    var data = VariantDetails;
    if (data) {
      for (let i = 0; i < data.length; i++) {
        let data_values = data[i].Values ? data[i].Values : [];
        for (let j = 0; j < data_values.length; j++) {
          var temp = data_values[j].MainImage;
          if (temp === "Y") {
            setCurrentlyActive(data_values[j]);
            setActiveVariantValue(`VVI${data_values[j].OptionValueID}`);
          }
        }
      }
    }
  };
  var getProductDetails = async () => {
    dispatch(getProductsDetailsById(productID, UserID));
  };
  var updateCounter = async (val) => {
    if (Object.keys(SelectedValues).length !== VariantDetails.length) {
      return firetoast(
        "Please select available options in all available variations to update the count",
        "info",
        4000,
        "top-center"
      );
    }
    let MinCount = parseInt(setInventoryMinCount());
    if (MinCount) {
      if (MinCount > 0) {
        if (val === "-") {
          if (counter > 1) {
            setCounter(counter - 1);
          }
        } else {
          if (counter < MinCount) {
            var temp_count = counter + 1;
            setCounter(temp_count);
          }
        }
      }
    }
  };
  var addToWishList = async () => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/wish-list/addUserWishList`,
        {
          ProductID: productID,
          ProductVariantCombinationID:
            CurrentlyActive.ProductVariantCombinationID,
        }
      );
      if (response.data.status) {
        setinWishList(true);
        // firetoast("Added to Wishlist", "success", 3000, "top-right");
      } else {
        var { message, error } = response.data;
        setinWishList(false);
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      setinWishList(false);
      firetoast("Something went wrong!", "default-error");
    }
  };
  var removeFromWishlist = async (id) => {
    if (RemoveItemFromWishList(id)) {
      setinWishList(false);
    } else {
      firetoast("Something went wrong", "default-error");
      setinWishList(true);
    }
  };
  var BuyNow = async () => {
    if (!Object.keys(SelectedValues).length > 0) {
      return firetoast(
        "Please select available options in order to proceed",
        "info",
        4000,
        "top-center"
      );
    } else if (Object.keys(SelectedValues).length !== VariantDetails.length) {
      return firetoast(
        "Please select available options in all available variations",
        "info",
        4000,
        "top-center"
      );
    } else {
      let dataObject = {
        SessionID: localStorage.getItem("accessToken"),
      };

      let ProductObj = {
        ProductID: productID,
        Quantity: counter,
      };
      let ProductObjCopy = {
        ProductID: productID,
        Quantity: 1,
      };
      let ProductDetail = [];
      let indexes = Object.keys(SelectedValues);
      let SelectedObj = SelectedValues;
      let ProductVariantCombinationDetail = [];
      for (let i = 0; i < indexes.length; i++) {
        ProductVariantCombinationDetail.push({
          ProductVariantCombinationID:
            SelectedObj[indexes[i]].ProductVariantCombinationID,
        });
      }

      if (CurrentUser) {
        ProductObj.ProductVariantCombinationDetail =
          ProductVariantCombinationDetail;
        ProductDetail.push(ProductObj);
        dataObject.ProductDetail = ProductDetail;
        console.group();
        dispatch(AddCartItems(dataObject));
        setTimeout(() => {
          history.push(`/my-cart`);
        }, 1000);
      } else {
        // ProductObjCopy.ProductVariantCombinationDetail =
        //   ProductVariantCombinationDetail;
        // ProductDetail.push(ProductObjCopy);
        // dataObject.ProductDetail = ProductDetail;
        ProductObjCopy.ProductVariantCombinationDetail =
          ProductVariantCombinationDetail;
        ProductDetail.push(ProductObjCopy);
        dataObject.ProductDetail = ProductDetail;
        ProductObjCopy["ProductDetail"] = productDetail;
        ProductObjCopy["ProductCombinations"] = SelectedValues;
        MaintainUnAuthCart(dataObject);
      }
    }
    dispatch(GetCartItems());
  };
  var AddItemToCart = async () => {
    // console.log(cartItems);
    const { getCartItem } = state;
    const cartItems = getCartItem["data"]["productCartList"];
    if (!Object.keys(SelectedValues).length > 0) {
      return firetoast(
        "Please select available options in order to proceed",
        "info",
        4000,
        "top-center"
      );
    } else if (Object.keys(SelectedValues).length !== VariantDetails.length) {
      return firetoast(
        "Please select available options in all available variations",
        "info",
        4000,
        "top-center"
      );
    } else {
      let dataObject = {
        SessionID: localStorage.getItem("accessToken"),
      };

      let ProductObj = {
        ProductID: productID,
        Quantity: counter,
      };
      let ProductObjCopy = {
        ProductID: productID,
        Quantity: 1,
      };
      let ProductDetail = [];
      let indexes = Object.keys(SelectedValues);
      let SelectedObj = SelectedValues;
      let ProductVariantCombinationDetail = [];
      for (let i = 0; i < indexes.length; i++) {
        ProductVariantCombinationDetail.push({
          ProductVariantCombinationID:
            SelectedObj[indexes[i]].ProductVariantCombinationID,
        });
      }

      if (CurrentUser) {
        var temp_cart = [...cartItems];
        console.log(temp_cart);

        temp_cart.push(productDetail);
        ProductObj.ProductVariantCombinationDetail =
          ProductVariantCombinationDetail;
        ProductDetail.push(ProductObj);
        dataObject.ProductDetail = ProductDetail;
        console.log(temp_cart);
        //check before proceed
        var SelectedProductsArray = [];
        var GlobalShippingStatus = [];
        var ShippingAvailableStatus = [];
        var ShippingCities = [];
        for (let x in temp_cart) {
          if (
            temp_cart[x].ProductCountry === 16 ||
            temp_cart[x].ProductCountry === "16"
          ) {
            temp_cart[x].ProductCountry = "Bangladesh";
          }
          if (
            temp_cart[x].ProductCountry === 226 ||
            temp_cart[x].ProductCountry === "226"
          ) {
            temp_cart[x].ProductCountry = "United States";
          }
          SelectedProductsArray.push(temp_cart[x].ProductCountry);
          GlobalShippingStatus.push(temp_cart[x].ShippingGlobal);
          ShippingAvailableStatus.push(temp_cart[x].ShippingAvailable);
          ShippingCities.push(temp_cart[x].City);
        }
        const allEqual = (arr) => arr.every((v) => v === arr[0]);
        var CheckEqualCountries = allEqual(SelectedProductsArray);
        var CheckAllGlobalShipping = allEqual(GlobalShippingStatus);
        var CheckAllShippingAvailable = allEqual(ShippingAvailableStatus);
        var CheckAllShippingCities = allEqual(ShippingCities);

        console.log("CheckEqualCountries", CheckEqualCountries);
        console.log("CheckAllGlobalShipping", CheckAllGlobalShipping);
        console.log("CheckAllShippingAvailable", CheckAllShippingAvailable);
        console.log("CheckAllShippingCities", CheckAllShippingCities);

        var err_status = false;
        var err_message = "";
        if (CheckEqualCountries) {
          if (CheckAllGlobalShipping) {
            //Global Shipping  = y
            if (CheckAllShippingAvailable) {
              //Global Shipping  =y  && Shipping to other cities = y
              //1-case
              console.log(
                "/Global Shipping  =y  && Shipping to other cities = y"
              );
            } else {
              //2-case
              //Global Shipping  =y  && Shipping to other cities = N
              if (CheckAllShippingCities) {
                //Global Shipping  =y  && Shipping to other cities = y && product same cities = y
                //3-case
                console.log(
                  "Global Shipping  =y  && Shipping to other cities = y && product same cities = y"
                );
              } else {
                //Global Shipping  =y  && Shipping to other cities = N && product same cities = N
                //4-case
                console.log("4");
                err_status = true;
                err_message =
                  "This product is not available to the same place of the product you have previously added in your shopping cart. If product availability location is not your desire delivery location then please remove the product from your shopping cart";

                return firetoast(err_message, "error", 5000, "top-center");
              }
            }
          } else {
            if (CheckAllShippingAvailable) {
              //5-case
              console.log("//5-case");
            } else {
              // 6-case
              if (CheckAllShippingCities) {
                //7-case
                console.log("//7-case");
              } else {
                //8-case
                console.log("8");

                err_status = true;
                err_message =
                  "This product is not available to the same place of the product you have previously added in your shopping cart. If product availability location is not your desire delivery location then please remove the product from your shopping cart";
                cartItems.pop();
                return firetoast(err_message, "error", 5000, "top-center");
              }
            }
          }
        } else {
          return firetoast(
            "This product’s payment cannot be process at the same time with previously add product in your shopping cart. Please pay your previously added product from your shopping cart then make a separate purchase for this product or remove previously added product from your shopping cart then add this product to your cart. ",
            "error",
            6000,
            "top-right"
          );
        }
        cartItems.pop();
        dispatch(AddCartItems(dataObject));
      } else {
        // ProductObjCopy.ProductVariantCombinationDetail =
        //   ProductVariantCombinationDetail;
        // ProductDetail.push(ProductObjCopy);
        // dataObject.ProductDetail = ProductDetail;
        ProductObjCopy.ProductVariantCombinationDetail =
          ProductVariantCombinationDetail;
        ProductDetail.push(ProductObjCopy);
        dataObject.ProductDetail = ProductDetail;
        ProductObjCopy["ProductDetail"] = productDetail;
        ProductObjCopy["ProductCombinations"] = SelectedValues;
        MaintainUnAuthCart(dataObject);
      }
    }
    firetoast("Item added to cart", "success", 2000, "top-center");
    dispatch(GetCartItems());
  };
  var getCartButton = () => {
    // {localStorage.getItem("region") ===
    //                       productDetail.ProductCountry ?  (

    //
    var local_region = localStorage.getItem("region");

    if (productDetail["ShippingGlobal"] === "Y") {
      return (
        <div className="row mt-4">
          <div className="col-6">
            <button
              className="btn btn-light text-default w-100"
              onClick={() => AddItemToCart()}
            >
              Add To Cart
            </button>
          </div>
          <div className="col-6">
            <button
              className="btn btn-success w-100"
              onClick={() => {
                BuyNow();
              }}
            >
              Buy Now
            </button>
          </div>
        </div>
      );
    } else {
      if (local_region === productDetail.ProductCountry) {
        return (
          <div className="row mt-4">
            <div className="col-6">
              <button
                className="btn btn-light text-default w-100"
                onClick={() => AddItemToCart()}
              >
                Add To Cart
              </button>
            </div>
            <div className="col-6">
              <button
                className="btn btn-success w-100"
                onClick={() => {
                  BuyNow();
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div className="text-orange mt-2">{`This product is only available for shipping in ${productDetail.ProductCountry}`}</div>
        );
      }
    }
  };

  return (
    <>
      <WebsiteHeader />

      {productsDetailById.loading ? (
        <Loading text="Composing Data..." />
      ) : (
        <div className="container">
          <>
            <div className="pt-2 pb-0">
              <Breadcrumb listTag="div">
                <BreadcrumbItem
                  href="/"
                  tag="a"
                  className="td-none"
                  style={{ color: "#B1B1B1" }}
                >
                  Home
                </BreadcrumbItem>
                <BreadcrumbItem
                  href="#"
                  tag="a"
                  className="td-none"
                  style={{ color: "#787878" }}
                >
                  Category
                </BreadcrumbItem>
                <BreadcrumbItem
                  href="#"
                  tag="a"
                  className="td-none"
                  style={{ color: "#787878" }}
                >
                  Product
                </BreadcrumbItem>
              </Breadcrumb>
            </div>

            {productDetail && (
              <>
                <div className="row mt-5">
                  <div className="col-xl-8 col-md-12 col-sm-12 mt-3 m-auto">
                    <div className="row mt-2">
                      <div className="col-lg-6 col-md-7 col-sm-12">
                        <Product_Detail_ProductImages
                          MainImage={CurrentlyActive && CurrentlyActive.Large}
                        />
                      </div>
                      <div className="col-lg-6 col-md-5 col-sm-12">
                        <div className="d-flex justify-content-between align-items-baseline">
                          <h2 className="ftw-400 mt-4">
                            {productDetail.Title}
                            {CurrentlyActive &&
                              ` - ${CurrentlyActive.VariantValue}`}
                          </h2>
                          <div>
                            <span>
                              <i
                                className="fas fa-share-alt text-light-grey"
                                style={{ fontSize: "18px" }}
                              ></i>
                            </span>
                            {inWishList ? (
                              <span
                                onClick={() => removeFromWishlist(productID)}
                              >
                                <i
                                  className="fas fa-heart text-default"
                                  style={{
                                    fontSize: "18px",
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                ></i>
                              </span>
                            ) : (
                              <span
                                onClick={() => {
                                  if (CurrentUser) {
                                    addToWishList();
                                  } else {
                                    firetoast(
                                      "Login first to add this item in your wish list",
                                      "info",
                                      5000,
                                      "top-center"
                                    );
                                  }
                                }}
                              >
                                <i
                                  className="far fa-heart text-light-grey "
                                  style={{
                                    fontSize: "18px",
                                    marginLeft: "10px",
                                    cursor: "pointer",
                                  }}
                                ></i>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="d-flex product-categories mt-4">
                          <div style={{ paddingLeft: "0px" }}>
                            <Link className="td-none" to="#">
                              {productDetail.Category}
                            </Link>
                          </div>
                          <div className="side-divider">
                            <Link className="td-none" to="#">
                              {productDetail.SubCategory}
                            </Link>
                          </div>
                        </div>
                        <div className="d-flex justify-content-between product-ratings mt-4">
                          <div>
                            <span className="badge badge-warning">
                              {AverageRatingAndReviews &&
                                parseFloat(
                                  AverageRatingAndReviews.ProductAverageRating
                                ).toFixed(1) === "NaN"
                                ? 0
                                : parseFloat(
                                  AverageRatingAndReviews.ProductAverageRating
                                ).toFixed(1)}{" "}
                              <span>
                                <i className="fas fa-star text-white"></i>
                              </span>
                            </span>
                            <span className="product-rating-stat">
                              {AverageRatingAndReviews &&
                                AverageRatingAndReviews.TotalRating}{" "}
                              Ratings &{" "}
                              {AverageRatingAndReviews &&
                                AverageRatingAndReviews.Total_Reviews}{" "}
                              Reviews
                            </span>
                          </div>
                          <div>
                            <h6 className="ftw-400 text-danger">
                              {CurrentlyActive &&
                                CurrentlyActive.AvailableInventory === 0 ? (
                                <span
                                  style={{ textDecoration: "line-through" }}
                                >
                                  In Stock
                                </span>
                              ) : (
                                "In Stock"
                              )}
                            </h6>
                          </div>
                        </div>
                        <hr style={{ marginBottom: "8px" }} />
                        <div className="mt-2">
                          <span className="product-price">
                            <span> {productDetail.Currency} </span>
                            {Object.keys(SelectedValues).length > 0
                              ? parseFloat(getTotalPrice().toFixed(2)) * counter
                              : CurrentlyActive &&
                              `${parseFloat(
                                parseInt(
                                  parseFloat(
                                    parseFloat(productDetail.Price) +
                                    parseFloat(
                                      CurrentlyActive.VariantPrice
                                    )
                                  ).toFixed(2)
                                )
                              ) * counter
                              }`}
                          </span>
                          {/* <span className="product-price-tag">& Free Returns</span> */}
                        </div>
                        <div className="mt-4">
                          <ul className="list-style-none product-desc-ul p-0">
                            {CurrentlyActive && (
                              <li>
                                <i className="fas fa-check text-default"></i>
                                {" SKU : "}
                                {CurrentlyActive.SKU}
                              </li>
                            )}
                            {/* <li>
                              <i className="fas fa-check text-default"></i> Nunc nec
                              porttitor turpis. In eu risus enim. In vitae
                              mollis elit.
                            </li>
                            <li>
                              <i className="fas fa-check text-default"></i> Nunc nec
                              porttitor turpis. In eu risus enim. In vitae
                              mollis elit.
                            </li> */}
                          </ul>
                        </div>
                        {CurrentUser && (
                          <div className="mt-4">
                            {/* {Object.keys(SelectedValues).length > 0 && ( */}
                            <div className="d-flex product-quantity">
                              <div>Quantity: </div>
                              <div>
                                <button
                                  className="counter-btn minus-btn"
                                  onClick={() => updateCounter("-")}
                                >
                                  -
                                </button>
                              </div>
                              <div className="product-quantity">{counter}</div>
                              <div>
                                <button
                                  className="counter-btn plus-btn"
                                  onClick={() => updateCounter("+")}
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            {/* // )} */}
                          </div>
                        )}
                        <div className="mt-4">
                          <h5 className="text-default">Variations </h5>
                          {VariantDetails.length > 0 &&
                            VariantDetails.map((item, index) => (
                              <div key={index}>
                                <div className=" product-variant">
                                  <div>
                                    <span style={{ fontSize: "16px" }}>
                                      {item.Name}:{" "}
                                    </span>
                                  </div>
                                  <ProductDetail_VariantValues
                                    variantIndex={index}
                                    item={item}
                                    SelectedValues={SelectedValues}
                                    setSelectedValues={setSelectedValues}
                                    setCounter={setCounter}
                                    setCurrentlyActive={setCurrentlyActive}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>
                        {getCartButton()}

                        {/* {currentIPv4.IP.country_name === "Pakistan" && (
                          <div className="row mt-4">
                            <div className="col-6">
                              <button
                                className="btn btn-light text-default w-100"
                                onClick={() => AddItemToCart()}
                              >
                                Add To Cart
                              </button>
                            </div>
                            <div className="col-6">
                              <button
                                className="btn btn-success w-100"
                                onClick={() => {
                                  BuyNow();
                                }}
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        )} */}
                      </div>
                    </div>
                    <div className="mt-5">
                      <Nav tabs>
                        <NavItem className="store-tabItem">
                          <NavLink
                            className={tab === 1 ? "active" : ""}
                            onClick={() => setTab(1)}
                          >
                            Description
                          </NavLink>
                        </NavItem>
                        <NavItem className="store-tabItem">
                          <NavLink
                            className={tab === 2 ? "active" : ""}
                            onClick={() => setTab(2)}
                          >
                            Vendor Info
                          </NavLink>
                        </NavItem>
                        <NavItem className="store-tabItem">
                          <NavLink
                            className={tab === 3 ? "active" : ""}
                            onClick={() => setTab(3)}
                          >
                            Customer Reviews
                          </NavLink>
                        </NavItem>
                        {/* <NavItem className="store-tabItem">
                  <NavLink
                    className={tab === 4 ? "active" : ""}
                    onClick={() => setTab(4)}
                  >
                    Reviews
                  </NavLink>
                </NavItem> */}
                      </Nav>
                      <TabContent activeTab={tab} className="mt-4">
                        <TabPane tabId={1}>
                          <div className="row">
                            <div className="col-12">
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: productDetail.Description,
                                }}
                              ></div>
                            </div>
                          </div>
                        </TabPane>
                        <TabPane tabId={2}>
                          <Product_Details_VendorDetails
                            BusinessDetails={businessDetails}
                            AverageRatingAndReviews={AverageRatingAndReviews}
                          />
                        </TabPane>
                        <TabPane tabId={3}>
                          <ProductDetailRatingAndReviews
                            AverageRatingAndReviews={AverageRatingAndReviews}
                            RatingCounts={RatingCounts}
                            UserReviewsAndRating={UserReviewsAndRating}
                            getProductDetails={getProductDetails}
                          />
                        </TabPane>
                      </TabContent>
                    </div>
                  </div>
                  <div className="col-xl-3 col-md-6 col-sm-12 mt-3">
                    <div>
                      <div className="d-flex justify-content-between mb-2">
                        <h6>Delivery Options</h6>
                        <div>
                          <i className="fas fa-info-circle text-secondary"></i>
                        </div>
                      </div>
                      <div className="product-side-box">
                        <div className="row align-items-center">
                          <div className="col-2 text-center">
                            <i
                              className="fas fa-map-marker-alt text-light-grey"
                              style={{ fontSize: "18px" }}
                            ></i>
                          </div>
                          <div className="col-10">
                            <div style={{ fontSize: "13px" }}>
                              Shipping Available
                            </div>
                            <div className="text-secondary">
                              {productDetail &&
                                productDetail["ShippingGlobal"] === "N"
                                ? productDetail.ProductCountry
                                : AllCountries.toString().replace(",", ", ")}
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-2 text-center">
                            <i
                              className="fal fa-city text-light-grey"
                              style={{ fontSize: "18px" }}
                            ></i>
                          </div>
                          <div className="col-10">
                            <div style={{ fontSize: "13px" }}>
                              Product Based City
                            </div>
                            <div className="text-secondary">
                              {productDetail["ProductCity"] &&
                                productDetail["ProductCity"]}
                              ,{" "}
                              {productDetail["ProductCountry"] &&
                                productDetail["ProductCountry"]}
                            </div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-2 text-center">
                            <i
                              className="fas fa-home text-light-grey"
                              style={{ fontSize: "18px" }}
                            ></i>
                          </div>
                          <div className="col-10">
                            <div style={{ fontSize: "13px" }}>
                              Domestic Delivery
                            </div>
                            <div className="text-secondary">5-7 working days</div>
                          </div>
                        </div>
                        <div className="row align-items-center">
                          <div className="col-2 text-center">
                            <i
                              className="fas fa-globe text-light-grey"
                              style={{ fontSize: "18px" }}
                            ></i>
                          </div>
                          <div className="col-10">
                            <div style={{ fontSize: "13px" }}>
                              Global Shipping
                            </div>
                            <div className="text-secondary">15-30 days</div>
                          </div>
                        </div>
                        {/* {productDetail &&
                          productDetail["ShippingAvailable"] === "N" && (
                            <div className="row align-items-center">
                              <div className="col-2 text-center">
                                <i
                                  className="fas fa-truck text-light-grey"
                                  style={{ fontSize: "18px" }}
                                ></i>
                              </div>

                              <div className="col-10">
                                <div style={{ fontSize: "13px" }}>
                                  Product City
                                </div>
                                <div className="text-secondary">
                                  {productDetail.ProductCity}
                                </div>
                              </div>
                            </div>
                          )} */}
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="d-flex justify-content-between mb-2">
                        <h6>Return & Warranty</h6>
                        <div>
                          <i className="fas fa-info-circle text-secondary"></i>
                        </div>
                      </div>
                      <div className="product-side-box">
                        <div className="row">
                          <div className="col-3 text-center">
                            <i
                              className="fas fa-truck text-default"
                              style={{
                                fontSize: "20px",
                                verticalAlign: "-webkit-baseline-middle",
                              }}
                            ></i>
                          </div>
                          <div className="col-9">
                            <div style={{ fontSize: "13px" }}>
                              Shipping & Returns
                            </div>
                            <div className="text-secondary">
                              For all orders from anywhere
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-3 text-center">
                            <i
                              className="fas fa-cash-register text-default"
                              style={{
                                fontSize: "20px",
                                verticalAlign: "-webkit-baseline-middle",
                              }}
                            ></i>
                          </div>
                          <div className="col-9">
                            <div style={{ fontSize: "13px" }}>
                              Secure Payment
                            </div>
                            <div className="text-secondary">
                              We ensure secure payment
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-3 text-center">
                            <i
                              className="fas fa-dollar-sign text-default"
                              style={{
                                fontSize: "20px",
                                verticalAlign: "-webkit-baseline-middle",
                              }}
                            ></i>
                          </div>
                          <div className="col-9">
                            <div style={{ fontSize: "13px" }}>
                              Money Back Guarantee
                            </div>
                            <div className="text-secondary">
                              Any back within 30 days
                            </div>
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-3 text-center">
                            <i
                              className="fas fa-headset text-default"
                              style={{
                                fontSize: "20px",
                                verticalAlign: "-webkit-baseline-middle",
                              }}
                            ></i>
                          </div>
                          <div className="col-9">
                            <div style={{ fontSize: "13px" }}>
                              Customer Support
                            </div>
                            <div className="text-secondary">
                              Call or email us 24/7
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5">
                      <div className="d-flex justify-content-between mb-2">
                        <h6>
                          Seller :{" "}
                          {businessDetails && businessDetails.CompanyName}
                        </h6>
                        {/* <div>
                  <i className="fas fa-info-circle text-secondary"></i>
                </div> */}
                      </div>
                      <div className="product-side-box">
                        <div className="d-flex justify-content-between p-2">
                          <div className="text-secondary">Seller Rating</div>
                          <div>
                            {" "}
                            {businessDetails &&
                              parseFloat(businessDetails.VendorRating).toFixed(
                                2
                              )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between  p-2">
                          <div className="text-secondary">Ship on time</div>
                          <div> 95%</div>
                        </div>
                        <div className="d-flex justify-content-between  p-2">
                          <div className="text-secondary">
                            Chat Response Rate
                          </div>
                          <div> 97%</div>
                        </div>
                      </div>
                    </div>
                    <button
                      className="btn btn-light text-default btn-block w-100 mt-2"
                      onClick={() => history.push("/store/Nishat")}
                    >
                      Go to store
                    </button>
                  </div>
                </div>
              </>
            )}
            <div className="mt-5">
              <TopRatedProducts />
            </div>
            <div className="mt-5">
              <Trending loc="product" />
            </div>
          </>
        </div>
      )}
      <NewsLetter />
      <Footer />
    </>
  );
}
export default ProductDetails;
