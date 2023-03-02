import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetCartItems } from "../../../../Actions/CartAction";
import CartListItem from "./My Cart Items/CartListItem";
import { RemoveCartItems } from "./../../../../Actions/CartAction";
import Loading from "../../../../Utils/Loading";
import { CurrentUser } from "./../../../../Helpers/Auth";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../Utils/Endpoint";
import { useHistory } from 'react-router-dom';
import GlobalLoginModal from "../../../../Helpers/GlobalLoginModal";
function MyCart() {
  const state = useSelector((state) => state);
  const history = useHistory()
  const { addCartItem, getCartItem, removeCartItem } = state;
  const dispatch = useDispatch();
  const [TotalPrice, setTotalPrice] = useState(null);
  const [IsLoading, setIsLoading] = useState(false);
  const [CartItems, setCartItems] = useState([]);
  const [ProductCombinationItems, setProductCombinationItems] = useState([]);
  const [signin, setSignIn] = useState(false)
  useEffect(() => {

    dispatch(GetCartItems());
    SetAndFetchData();
  }, [
    dispatch,
    addCartItem,
    getCartItem.loading,
    // CartItems,
    // ProductCombinationItems,
  ]);

  useEffect(() => {
    setIsLoading(true);
    // dispatch(GetCartItems());
    setIsLoading(false);
    SetAndFetchData();
  }, [removeCartItem, dispatch]);

  var SetAndFetchData = async () => {
    setIsLoading(true);
    var localCart = localStorage.getItem("uLC");
    if (CurrentUser) {
      if (!getCartItem.loading) {
        if (getCartItem.error) {
          setCartItems([]);
        } else {
          var response = await BanglaBazarApi.get(
            `${Endpoint}/api/wish-list/viewCart`
          );

          var tempCart = response.data.productCartList;
          setCartItems(tempCart);
          var tempCombinations = response.data.productCombinationPriceDetail;
          var totalCount = 0;
          let tempCombination = response.data.productCombinationPriceDetail;
          let indexes = response.data.productCartList;

          for (let i = 0; i < indexes.length; i++) {
            let currentProduct = response.data.productCartList[i];
            let currentCombination = tempCombination[i];
            totalCount += parseFloat(currentProduct.Price);
            for (let j = 0; j < currentCombination.length; j++) {
              totalCount += parseFloat(
                currentCombination[j].ProductCombinationPrice
              );
            }
            totalCount = totalCount * parseInt(currentProduct.Total_Quantity);
          }
          setTotalPrice(totalCount);
          setProductCombinationItems(tempCombinations);
        }
      }
    } else if (localCart) {
      var productCartList = [];
      var productCombinationPriceDetail = [];
      var tempCart = JSON.parse(localCart);
      for (let i = 0; i < tempCart.length; i++) {
        var currentParsedItem = JSON.parse(tempCart[i]).ProductDetail[0];
        var product = currentParsedItem.ProductDetail;
        product["Total_Quantity"] = currentParsedItem.Quantity;
        productCartList.push(product);
        productCombinationPriceDetail.push(
          currentParsedItem.ProductCombinations
        );
      }
      /////////////
      var tempCart = productCartList;
      setCartItems(tempCart);
      var tempCombinations = productCombinationPriceDetail;
      var totalCount = 0;
      let tempCombination = productCombinationPriceDetail;
      let indexes = productCartList;
      for (let i = 0; i < indexes.length; i++) {
        let currentProduct = productCartList[i];
        let currentCombination = tempCombination[i];
        totalCount += parseFloat(currentProduct.Price);
        for (let j = 0; j < currentCombination.length; j++) {
          totalCount += parseFloat(currentCombination[j].TotalPrice);
        }
        totalCount = totalCount * parseInt(currentProduct.Total_Quantity);
      }
      setTotalPrice(totalCount);
      setProductCombinationItems(tempCombinations);
    }

    setIsLoading(false);
  };
  var removeUnAuthCartItem = async (index) => {
    var tempCartItems = [];
    var tempProductCombinationItems = [];
    for (let i = 0; i < CartItems.length; i++) {
      if (i !== index) {
        tempCartItems.push(CartItems[i]);
        tempProductCombinationItems.push(ProductCombinationItems[i]);
      }
    }
    setCartItems(tempCartItems);
    setProductCombinationItems(tempProductCombinationItems);
    var localCart = JSON.parse(localStorage.getItem("uLC"));
    var tempCart = [];
    for (let i = 0; i < localCart.length; i++) {
      if (i !== index) {
        tempCart.push(localCart[i]);
      }
    }
    localStorage.setItem("uLC", JSON.stringify(tempCart));
    // console.log(
    //   tempProducts.splice(index, 1),
    //   tempCombinations.splice(index, 1)
    // );
  };
  var deleteCartItem = async (ProductID, index) => {
    console.log(index);
    var productVariations = ProductCombinationItems[index];
    console.log(ProductCombinationItems);
    var ProductVariantCombinationDetail = [];
    for (let i = 0; i < productVariations.length; i++) {
      var obj = {};
      obj.ProductVariantCombinationID =
        productVariations[i].ProductVariantCombinationID;
      ProductVariantCombinationDetail.push(obj);
    }
    let array1 = [];
    let array2 = [];
    for (let i = 0; i < CartItems.length; i++) {
      if (i !== index) {
        array1.push(CartItems[i]);
        array2.push(ProductCombinationItems[i]);
      }
    }
    if (array2.length === 0) setTotalPrice("");
    dispatch(RemoveCartItems(ProductID, { ProductVariantCombinationDetail }));
    setCartItems(array1);
    setProductCombinationItems(array2);
  };

  return (
    <>
      {IsLoading && CurrentUser && getCartItem.loading ? (
        <Loading text={"Getting Cart Item"} />
      ) : (
        <div className="d-flex" style={{ alignItems: "center" }}>
          <div>
            {CartItems.length > 0 ? (
              <span
                className="fa-stack has-badge"
                data-count={`${CartItems.length}`}
              >
                <i
                  className="fas fa-shopping-cart text-secondary"
                  style={{ fontSize: "20px" }}
                ></i>
              </span>
            ) : (
              <span className="fa-stack has-badge" data-count="0">
                <i
                  className="fas fa-shopping-cart text-secondary"
                  style={{ fontSize: "20px" }}
                ></i>
              </span>
            )}
          </div>
          <div>
            <div className="mycart-text">My Cart</div>
            <div className="ln-price text-default d-flex">
              <div style={{ fontSize: "10px" }}>
                {" "}
                {CartItems &&
                  CartItems.length > 0 &&
                  CartItems[0].Currency}{" "}
                {TotalPrice && TotalPrice.toFixed(2)}
              </div>
              <div style={{ paddinLeft: "5px" }}>
                <UncontrolledDropdown direction="left">
                  <DropdownToggle className="cart-caret">
                    <i className="fas fa-chevron-down price-chevron"></i>
                  </DropdownToggle>
                  <DropdownMenu
                    className="cart-list"
                    style={{
                      maxheight: "50vh",
                      overflowY: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    {CartItems.length > 0 ? (
                      CartItems.map((item, index) => (
                        <div key={index}>
                          <CartListItem
                            index={index}
                            product={item}
                            variants={ProductCombinationItems[index]}
                            removeCartItem={deleteCartItem}
                            removeUnAuthCartItem={removeUnAuthCartItem}
                          />

                        </div>
                      ))
                    ) : (
                      <div className="text-center">
                        <h5>Your cart is empty :(</h5>
                      </div>
                    )}
                    <DropdownItem divider />
                    {
                      CartItems.length > 0 && <div style={{ paddingLeft: "10px", marginRight: "10px" }}>

                        <button
                          className="btn btn-default-outline w-100 btn-block"
                          onClick={() => {
                            if (CurrentUser) {
                              history.push("/my-cart")
                            }
                            else {
                              setSignIn(true)
                            }
                          }}
                        >
                          Checkout
                        </button>
                      </div>
                    }
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            </div>
          </div>
          <GlobalLoginModal signin={signin} setSignIn={setSignIn} redirection={"/my-cart"} />

        </div>
      )}
    </>
  );
}
export default MyCart;
