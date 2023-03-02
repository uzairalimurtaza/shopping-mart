import { WebsiteHeader } from "./Layout/Header";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { BreadcrumbItem, Breadcrumb } from "reactstrap";
import CartStep1 from "../../../assets/images/cart-step1.svg";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Loading from "../../../Utils/Loading";
import firetoast from "./../../../Helpers/FireToast";
import CartTableItem from "./Layout/My Cart Items/CartTableItem";
import { useDispatch } from "react-redux";
import { GetCartItems, RemoveCartItems } from "./../../../Actions/CartAction";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import Endpoint from "./../../../Utils/Endpoint";
function UserCart() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [CartItems, setCartItems] = useState([]);
  const [ProductCombinationItems, setProductCombinationItems] = useState([]);
  const [TotalPrice, setTotalPrice] = useState(0);
  const state = useSelector((state) => state);
  const [selectedItemIds, setSelectedItemsIds] = useState([]);
  const [selectedItemsPrice, setSelectedItemsPrice] = useState(0);
  const { getCartItem, removeCartItem } = state;

  useEffect(() => {
    setCartItems([]);
    setTotalPrice("");
    setProductCombinationItems([]);
    setSelectedItemsIds([]);
    if (!getCartItem.loading) {
      if (getCartItem.error) {
        firetoast(
          "Something went wrong while fetching cart items",
          "default-error"
        );
      } else {
        setCartItems(getCartItem.data.productCartList);
        setProductCombinationItems(
          getCartItem.data.productCombinationPriceDetail
        );
        var totalCount = 0;
        let tempCombination = getCartItem.data.productCombinationPriceDetail;
        console.log("temp Combination",tempCombination)
        let indexes = getCartItem.data.productCartList;
        for (let i = 0; i < indexes.length; i++) {
          let totalForCurrentItem = 0
          let currentProduct = getCartItem.data.productCartList[i];
          let currentCombination = tempCombination[i];
          totalForCurrentItem += parseFloat(currentProduct.Price);
          for (let j = 0; j < currentCombination.length; j++) {
            totalForCurrentItem += parseFloat(
              currentCombination[j].ProductCombinationPrice
            );
          }
          console.log("total count here: ",totalForCurrentItem)
          totalForCurrentItem = totalForCurrentItem * parseInt(currentProduct.Total_Quantity);
          console.log("total count here: ", totalForCurrentItem)
          totalCount += totalForCurrentItem
        }
        console.log("actuall total amount: ", totalCount)
        setTotalPrice(totalCount);
      }
    }
  }, [getCartItem, getCartItem, dispatch]);
  useEffect(() => {
    dispatch(GetCartItems());
  }, [removeCartItem]);
  var deleteCartItem = async (ProductID, index) => {
    var productVariations = ProductCombinationItems[index];
    console.log(ProductCombinationItems);
    var ProductVariantCombinationDetail = [];
    for (let i = 0; i < productVariations.length; i++) {
      var obj = {};
      obj.ProductVariantCombinationID =
        productVariations[i].ProductVariantCombinationID;
      ProductVariantCombinationDetail.push(obj);
    }
    // console.log(ProductID, { ProductVariantCombinationDetail });
    await dispatch(
      RemoveCartItems(ProductID, { ProductVariantCombinationDetail })
    );
    await dispatch(GetCartItems());
  };
  var VerifyToProceed = async () => {
    //Check for same countries
    var selectedIds = selectedItemIds;
    var SelectedProductsArray = [];
    var GlobalShippingStatus = [];
    var ShippingAvailableStatus = [];
    var ShippingCities = [];
    var SelectedCartItems = [];
    var SelectedCartCombinations = [];
    for (let i = 0; i < selectedIds.length; i++) {
      let currentId = selectedIds[i];
      for (let x in CartItems) {
        if (parseInt(currentId) === parseInt(x)) {
          SelectedProductsArray.push(CartItems[x].ProductCountry);
          GlobalShippingStatus.push(CartItems[x].ShippingGlobal);
          ShippingAvailableStatus.push(CartItems[x].ShippingAvailable);
          ShippingCities.push(CartItems[x].City);
          SelectedCartItems.push(CartItems[x]);
          SelectedCartCombinations.push(ProductCombinationItems[x]);
        }
      }
    }
    console.log(SelectedProductsArray);
    var resp = await checkIfAvailableInInventory(
      SelectedCartItems,
      SelectedCartCombinations
    );
    if (!resp.value) {
      if (resp.data.length === 0) {
        return firetoast("Something went wrong", "default-error");
      } else {
        let array = resp.data[0]["ProductDetail"];

        for (let i = 0; i < array.length; i++) {
          firetoast(
            `Sorry can't proceed with checkout the variant ${array[i]["OptionValue"]} for the product ${array[i]["Title"]} is out of stock`,
            "error",
            5000,
            "top-center"
          );
        }
        return;
      }
    }
    // console.log(SelectedProductsArray);

    const allEqual = (arr) => arr.every((v) => v === arr[0]);
    var CheckEqualCountries = allEqual(SelectedProductsArray);
    var CheckAllGlobalShipping = allEqual(GlobalShippingStatus);
    var CheckAllShippingAvailable = allEqual(ShippingAvailableStatus);
    var CheckAllShippingCities = allEqual(ShippingCities);

    if (CheckEqualCountries) {
      if (CheckAllGlobalShipping) {
        //Global Shipping  = y
        if (CheckAllShippingAvailable) {
          //Global Shipping  =y  && Shipping to other cities = y
          //1-case
          history.push(
            `/my-cart/delivery-details?product=${selectedItemIds.join(
              ","
            )}&GlobalShipping=Y&ShippingAvailable=Y&City=All`
          );
        } else {
          //2-case
          //Global Shipping  =y  && Shipping to other cities = N
          if (CheckAllShippingCities) {
            //Global Shipping  =y  && Shipping to other cities = y && product same cities = y
            //3-case
            history.push(
              `/my-cart/delivery-details?product=${selectedItemIds.join(
                ","
              )}&GlobalShipping=Y&ShippingAvailable=N&City=${
                CartItems[0]["City"]
              }`
            );
          } else {
            //Global Shipping  =y  && Shipping to other cities = N && product same cities = N
            //4-case
            // history.push(
            //   `/my-cart/delivery-details?product=${selectedItemIds.join(
            //     ","
            //   )}&GlobalShipping=Y&ShippingHandling=N&City=All`
            // );
            return firetoast(
              "Can't proceed with cart as the products are not available for different cities delivery",
              "info",
              6000,
              "top-right"
            );
          }
        }
      } else {
        if (CheckAllShippingAvailable) {
          //5-case
          history.push(
            `/my-cart/delivery-details?product=${selectedItemIds.join(
              ","
            )}&GlobalShipping=N&ShippingAvailable=Y&City=All`
          );
        } else {
          // 6-case
          if (CheckAllShippingCities) {
            //7-case
            history.push(
              `/my-cart/delivery-details?product=${selectedItemIds.join(
                ","
              )}&GlobalShipping=N&ShippingAvailable=N&City=${
                CartItems[0]["City"]
              }`
            );
          } else {
            //8-case
            return firetoast(
              "Can't proceed with cart as the products are not available for different cities delivery",
              "info",
              6000,
              "top-right"
            );
          }
        }
      }
    } else {
      return firetoast(
        "This product’s payment cannot be process at the same time with previously add product in your shopping cart. Please pay your previously added product from your shopping cart then make a separate purchase for this product or remove previously added product from your shopping cart then add this product to your cart.",
        "error",
        6000,
        "top-right"
      );
    }
  };
  var CheckIfSelectedCitiesSame = () => {
    var selectedIds = selectedItemIds;
    var SelectedProductsArray = [];
    for (let i = 0; i < selectedIds.length; i++) {
      let currentId = selectedIds[i];
      for (let x in CartItems) {
        if (parseInt(currentId) === parseInt(CartItems[x].ProductID)) {
          SelectedProductsArray.push(CartItems[x].ProductCountry);
        }
      }
    }

    const allEqual = (arr) => arr.every((v) => v === arr[0]);
    var CheckEqualCountries = allEqual(SelectedProductsArray);

    if (CheckEqualCountries) {
      // history.push(
      //   `/my-cart/delivery-details?product=${selectedItemIds.join(",")}`
      // );
    } else {
      return firetoast(
        "Product countries for selected products are not same ,please proceed with individual item",
        "info",
        6000,
        "top-right"
      );
    }
  };
  var checkIfAvailableInInventory = async (Cart, Combination) => {
    ///api/wish-list/get-inventory
    var productCartList = [];
    for (let i = 0; i < Cart.length; i++) {
      var currentProduct = Cart[i];
      currentProduct["ProductCombinations"] = Combination[i];
      productCartList.push(currentProduct);
    }
    try {
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/wish-list/get-inventory`,
        { productCartList }
      );
      if (response.data.status) {
        var p_list = response.data.outOfStockProducts;

        if (p_list.length === 0) {
          return {
            value: true,
            data: [],
          };
        } else {
          return {
            value: false,
            data: p_list,
          };
        }
      }
      return {
        value: false,
        data: [],
      };
    } catch (e) {
      return {
        value: false,
        data: [],
      };
    }
  };

  var updateTotalPrice = (addedValue, operator, checked) => {
    console.log("Total price before update: ", TotalPrice )
    if(checked && operator == "+"){
        setTotalPrice(parseFloat(TotalPrice) + parseInt(addedValue))
        setSelectedItemsPrice(parseFloat(selectedItemsPrice) + parseInt(addedValue))
    } else if(checked && operator == "-"){
        setTotalPrice(parseFloat(TotalPrice) - parseInt(addedValue))
        setSelectedItemsPrice(parseFloat(selectedItemsPrice) - parseInt(addedValue))
    } else if(!checked && operator == "+"){
      setTotalPrice(parseFloat(TotalPrice) + parseInt(addedValue))
      // setSelectedItemsPrice(parseFloat(selectedItemsPrice) + parseInt(addedValue))
    } else if(!checked && operator == "-"){
      setTotalPrice(parseFloat(TotalPrice) - parseInt(addedValue))
      // setSelectedItemsPrice(parseFloat(selectedItemsPrice) - parseInt(addedValue))
    }
    console.log("Total price after update: ", TotalPrice )
  }

  var updateSelectedItemsArray = (price, action) => {
    if(action){
      setSelectedItemsPrice(selectedItemsPrice+price)
    } else {
      setSelectedItemsPrice(selectedItemsPrice-price)
    }
  }

  return (
    <>
      <WebsiteHeader />

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
                Shopping Cart
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="row">
            <div className="col-8">
              {" "}
              <div className="mt-3">
                <img
                  src={CartStep1}
                  className="img-fluid"
                  style={{ height: "60px" }}
                />
              </div>
              {getCartItem.loading ? (
                <Loading text="Getting Data" />
              ) : CartItems.length > 0 ? (
                <div className="mt-5 table-responsive">
                  <table className="table table-borderless">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #C7C7C7" }}>
                        <th></th>
                        <th className="ftw-400">Product</th>
                        <th></th>
                        <th className="ftw-400">Price</th>
                        <th className="ftw-400">Quantity</th>
                        <th className="ftw-400">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CartItems.map((item, index) => (
                        <CartTableItem
                          product={item}
                          index={index}
                          variants={ProductCombinationItems[index]}
                          removeCartItem={deleteCartItem}
                          allVariants={ProductCombinationItems[index]}
                          selectedItemIds={selectedItemIds}
                          setSelectedItemsIds={setSelectedItemsIds}
                          updateSelectedItemsArray={updateSelectedItemsArray}
                          updateTotalPrice = {updateTotalPrice}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center mt-5">
                  <h5>No Data To Display</h5>
                </div>
              )}
              <div style={{ textAlign: "right" }}>
                <button
                  className="btn btn-success"
                  data-toggle="tooltip"
                  data-placement="top"
                  title={
                    selectedItemIds.length === 0
                      ? "Select items to proceed checkout"
                      : null
                  }
                  onClick={() => VerifyToProceed()}
                  disabled={selectedItemIds.length < 1}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
            <div className="col-4">
              <div className="order-summary-box">
                <h5 className="p-3 mb-0">Order Summary</h5>
                <div className="section-1">
                  <div className="d-flex justify-content-between summary-detail">
                    <div className="summary-attrib">Total</div>
                    <div className="summary-attrib-val">
                      {console.log(TotalPrice,"----======-----======------")}
                      {CartItems.length > 0 && CartItems[0].Currency}{" "}
                      {TotalPrice && TotalPrice !== "" && TotalPrice.toFixed(2)}
                    </div>
                  </div>
                  <div className="d-flex justify-content-between summary-detail">
                    <div className="summary-attrib">My Cart Total</div>
                    {/* <div className="summary-attrib-val">
                      {CartItems.length > 0 && CartItems[0].Currency}{" "}
                      {TotalPrice && TotalPrice !== "" && TotalPrice.toFixed(2)}
                    </div> */}
                     <div className="summary-attrib-val">
                      {CartItems.length > 0 && CartItems[0].Currency}{" "}
                      {selectedItemsPrice.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <button
                    disabled={selectedItemIds.length < 1}
                    className="btn btn-lg btn-block btn-success w-100"
                    onClick={() => VerifyToProceed()}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
              <div className="order-summary-box mt-3">
                <h5 className="p-2 mb-0 mt-1">
                  {" "}
                  <i className="fas fa-info-circle text-orange"></i> Note
                </h5>
                <div className="section-1 p-2">
                  <span className="text-orange">
                    Store pick up will only be available if all selected
                    products are from same country and selected delivery city.{" "}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default UserCart;
