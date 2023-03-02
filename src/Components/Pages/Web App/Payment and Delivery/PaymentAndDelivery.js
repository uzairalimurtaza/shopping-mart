import { BreadcrumbItem, Breadcrumb } from "reactstrap";
import CartStep2 from "../../../../assets/images/cart-step2.svg";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import { Footer } from "./../Layout/Footer";
import { WebsiteHeader } from "./../Layout/Header";
import { NewsLetter } from "./../Layout/NewsLetter";
import CartDetailCartItem from "./../Layout/My Cart Items/CartDetailCartItem";
import BangladeshDelivery from "./BangladeshDelivery";
import UsaDelivery from "./UsaDelivery";
import GlobalDeliveryDHL from "./GlobalDeliveryDHL";
import GlobalDeliveryXPS from "./GlobalDeliveryXPS";

function PaymentAndDelivery() {
  const search = useLocation().search;
  const product_ids = new URLSearchParams(search).get("product");
  const productGlobalShipping = new URLSearchParams(search).get(
    "GlobalShipping"
  );
  const productShippingAvailable = new URLSearchParams(search).get(
    "ShippingAvailable"
  );
  const productCity = new URLSearchParams(search).get("City");
  // console.log(product_ids,productGlobalShipping,productShippingAvailable,productCity)

  const [CartItems, setCartItems] = useState([]);
  const [ProductCombinationItems, setProductCombinationItems] = useState([]);
  const [TotalPrice, setTotalPrice] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const state = useSelector((state) => state);
  const { getCartItem, paymentStatus } = state;
  const [BanglaBazarPickUp, setBanglaBazarPickUp] = useState(null);
  const [PickUpByUser, setPickUpByUser] = useState(null);
  const [AllowStorePickup, setAllowStorePickup] = useState("N");
  const [PaymentStates, setPaymentStates] = useState([]);
  const [PaymentCities, setPaymentCities] = useState([]);
  const [OverallCity, setOverallCity] = useState("");
  const [PaymentType, setPaymentType] = useState("card");
  const [ContinueButton, setContinueButton] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const productIds = queryParams.get("product");
  const [ShippingPrice, setShippingPrice] = useState(0);
  const [ShowPrevPayment, setShowPrevPayment] = useState(true);
  const [BillingCountryList, setBillingCountryList] = useState([]);
  const [DeliveryCountry, setDeliveryCountry] = useState(null);
  const [DeliveryForm, setDeliveryForm] = useState(null);
  const [DeliveryBy, setDeliveryBy] = useState(null);
  const [TaxValue, setTaxValue] = useState(0);
  const [AllCod, setAllCod] = useState(true);

  useEffect(() => {
    getCountries();
    var totalTax = 0;

    if (!getCartItem.loading) {
      if (getCartItem.error) {
        firetoast(
          "Something went wrong while fetching cart items",
          "default-error"
        );
      } else {
        if (!productIds) {
          var tempIds = [];
          var productCities = [];
          setCartItems(getCartItem.data.productCartList);
          setProductCombinationItems(
            getCartItem.data.productCombinationPriceDetail
          );
          var totalCount = 0;
          let tempCombination = getCartItem.data.productCombinationPriceDetail;
          let indexes = getCartItem.data.productCartList;
          for (let i = 0; i < indexes.length; i++) {
            tempIds.push(indexes[i].ProductID);
            productCities.push(indexes[i].City);
            // console.log(tempIds);
            let currentProduct = getCartItem.data.productCartList[i];
            let currentCombination = tempCombination[i];
            totalCount += parseFloat(currentProduct.Price);
            for (let j = 0; j < currentCombination.length; j++) {
              totalCount += parseFloat(
                currentCombination[j].ProductCombinationPrice
              );
            }

            totalCount = totalCount * parseInt(currentProduct.Total_Quantity);
            totalTax =
              totalTax + totalCount * (parseFloat(indexes[i]["TaxRate"]) / 100);
            console.log(totalTax, "totalTax----------")
          }

          setTotalPrice(totalCount);
          getDeliveryStatus(tempIds);
          if (parseInt(DeliveryCountry) === parseInt(CartItems[0].ProductCountry)) {
            setTaxValue(totalTax);
          }
          else {
            setTaxValue(0);
          }
          if (sameValues(productCities)) {
            setOverallCity(productCities[0]);
          }
        } else {
          var productCities = [];
          var tempIds = [];
          var _indexes = productIds.split(",");
          let _actual = getCartItem.data.productCartList;
          console.log(productIds, "productIds")
          console.log(getCartItem, "getCartItem")
          console.log(_actual.length, "length")
          for (let _indexes = 0; _indexes < _actual.length; _indexes++) {
            console.log(_actual[_indexes].ProductID, "at index ", _indexes)
            tempIds.push(_actual[_indexes].ProductID);
          }
          var ActualProductCartList = getCartItem.data.productCartList;
          var ActualProductCombinationItems =
            getCartItem.data.productCombinationPriceDetail;
          var idsToMap = productIds.split(",");
          getDeliveryStatus(tempIds);
          var productCartList = [];
          var productCombinationItems = [];
          for (let i = 0; i < idsToMap.length; i++) {
            for (let j = 0; j < ActualProductCartList.length; j++) {
              if (parseInt(idsToMap[i]) === parseInt(j)) {
                productCities.push(ActualProductCartList[i].City);
                productCartList.push(ActualProductCartList[j]);
                productCombinationItems.push(ActualProductCombinationItems[j]);
              }
            }
          }
          setCartItems(productCartList);
          setProductCombinationItems(productCombinationItems);
          var totalCount = 0;
          let tempCombination = productCombinationItems;
          let indexes = productCartList;
          let CodStats = [];
          let prices = []
          let taxes = []
          for (let i = 0; i < indexes.length; i++) {
            let currentProduct = productCartList[i];
            let currentCombination = tempCombination[i];
            var amount = parseFloat(currentProduct.Price) * parseInt(currentProduct.Total_Quantity)
            var taxAmount = amount * (parseFloat(indexes[i]["TaxRate"]) / 100)
            taxAmount = taxAmount ? taxAmount : 0;
            prices.push(amount)
            taxes.push(taxAmount)
            // totalCount = totalCount + parseFloat(currentProduct.Price);
            // for (let j = 0; j < currentCombination.length; j++) {
            //   totalCount += parseFloat(
            //     currentCombination[j].ProductCombinationPrice
            //   );
            // }
            // totalCount = totalCount * parseInt(currentProduct.Total_Quantity);
            // console.log(totalCount,"totalCount")
            // totalTax =
            //   totalTax + (totalCount * (parseFloat(indexes[i]["TaxRate"]) / 100));
            CodStats.push(productCartList[i].ProductCodStatus);
          }



          let sum = prices.reduce((a, b) => a + b, 0)
          console.log(sum, "sum----=====")
          let taxesAmt = taxes.reduce((a, b) => a + b, 0)
          console.log(taxesAmt, "taxesAmt")
          setTotalPrice(sum);
          setTaxValue(taxesAmt);

          if (sameValues(productCities)) {
            setOverallCity(productCities[0]);
          }
          if (!AllowedCod(CodStats)) {
            setAllCod(false);
          }
        }
      }
    }
  }, [
    getCartItem.loading,
    getCartItem.data,
    paymentStatus.loading,
    productIds,
  ]);
  function sameValues(arr) {
    return arr.every((v, i, a) => v === a[0]);
  }
  function AllowedCod(arr) {
    return arr.every((element) => element === "Y");
  }
  let getDeliveryStatus = async (idArrays) => {
    let temp = [];

    for (let i = 0; i < idArrays.length; i++) {
      temp.push({
        ProductID: idArrays[i],
      });
    }
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/payment/shipping-status`,
        {
          ProductDetail: temp,
        }
      );
      setBanglaBazarPickUp(response.data.banglaBazarPickup);
      setPickUpByUser(response.data.pickUpByUser);
    } catch (e) {
      firetoast("Something went wrong", "default-error");
    }
  };

  let handleDeliveryCountry = ({ currentTarget: input }) => {
    //CartItems[0].ProductCountry
    setPaymentType("card");
    setDeliveryCountry(input.value);
  };
  var getCountries = async () => {
    try {
      var response = await BanglaBazarApi.get(
        Endpoint + "/api/location/get-vendorAllowedCountries"
      );
      setBillingCountryList(response.data.Countries);
    } catch (e) {
      console.log(e);
    }
  };
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
                Payment and delivery
              </BreadcrumbItem>
            </Breadcrumb>
          </div>
        </>
        <div className="mt-4">
          <div className="row">
            <div className="col-xl-8 col-md-7 col-sm-12 order-2 order-xl-1 order-md-1">
              {" "}
              {ShowPrevPayment && (
                <>
                  <div className="mt-3">
                    <img
                      src={CartStep2}
                      className="img-fluid"
                      style={{ height: "70px" }}
                    />
                  </div>
                  <div className="mt-3">
                    <>
                      <h3 className="text-default mt-5 mb-3">
                        {" "}
                        Delivery country
                      </h3>
                      <div className="row">
                        <div className="col-7 ">
                          {/* <label>
                Country <RequiredField />
              </label> */}
                          <select
                            className="form-control"
                            name="Billing Country"
                            onChange={(e) => {
                              handleDeliveryCountry(e);
                            }}
                          >
                            <option>Select...</option>
                            {BillingCountryList.map((item, index) => (
                              <option value={item.CountryID} key={index}>
                                {item.Country}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                    {DeliveryCountry && (
                      <>
                        <h3 className="text-default mt-5 mb-3">
                          {" "}
                          Payment Method
                        </h3>
                        <div className="row">
                          <div className="col-7 ">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                              <div className="form-check form-check-inline">
                                <input
                                  className="form-check-input default-check-color"
                                  type="radio"
                                  id="inlineCheckbox34"
                                  name="inlineCheckbox34"
                                  defaultChecked={PaymentType === "card"}
                                  onChange={() => setPaymentType("card")}
                                />
                                <label
                                  className="form-check-label"
                                  for="inlineCheckbox3"
                                >
                                  Credit/Debit Card
                                </label>
                              </div>
                              {AllCod && parseInt(DeliveryCountry) !== 226 ? (
                                <div className="form-check form-check-inline">
                                  <input
                                    className="form-check-input default-check-color"
                                    type="radio"
                                    id="inlineCheckbox34"
                                    name="inlineCheckbox34"
                                    defaultChecked={PaymentType === "cod"}
                                    onChange={() => setPaymentType("cod")}
                                  />
                                  <label
                                    className="form-check-label"
                                    for="inlineCheckbox3"
                                  >
                                    Cash on delivery
                                  </label>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="row mt-5">
                    <div className="col-12">
                      <div style={{ float: "right" }}>
                        <button
                          className="btn btn-default"
                          disabled={!DeliveryCountry}
                          onClick={() => {
                            setContinueButton(!ContinueButton);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            setShowPrevPayment(false);
                          }}
                        >
                          Continue
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
              {!ShowPrevPayment && (
                <>
                  {parseInt(DeliveryCountry) === 16 && parseInt(CartItems[0].ProductCountry) === 16 && (
                    <BangladeshDelivery
                      BanglaBazarPickUp={BanglaBazarPickUp}
                      PickUpByUser={PickUpByUser}
                      AllowStorePickup={AllowStorePickup}
                      setAllowStorePickup={setAllowStorePickup}
                      setPaymentStates={setPaymentStates}
                      setPaymentCities={setPaymentCities}
                      CountrySelect={DeliveryCountry}
                      PaymentType={PaymentType}
                      setPaymentType={setPaymentType}
                      ContinueButton={ContinueButton}
                      setContinueButton={setContinueButton}
                      setShowPrevPayment={setShowPrevPayment}
                      ShowPrevPayment={ShowPrevPayment}
                      CartItems={CartItems}
                      setCartItems={setCartItems}
                      DeliveryBy={DeliveryBy}
                      setDeliveryBy={setDeliveryBy}
                      TotalPrice={TotalPrice}
                      setTotalPrice={setTotalPrice}
                      ShippingPrice={ShippingPrice}
                      setShippingPrice={setShippingPrice}
                      ProductCombinationItems={ProductCombinationItems}
                      setProductCombinationItems={setProductCombinationItems}
                      product_ids={product_ids}
                      productGlobalShipping={productGlobalShipping}
                      productShippingAvailable={productShippingAvailable}
                      productCity={productCity}
                      TaxValue={TaxValue}
                      setTaxValue={setTaxValue}
                      OverallCity={OverallCity}
                    />
                  )}
                  {parseInt(DeliveryCountry) === 226 && parseInt(CartItems[0].ProductCountry) === 16 && (
                    <GlobalDeliveryDHL
                      BanglaBazarPickUp={BanglaBazarPickUp}
                      PickUpByUser={PickUpByUser}
                      AllowStorePickup={AllowStorePickup}
                      setAllowStorePickup={setAllowStorePickup}
                      setPaymentStates={setPaymentStates}
                      setPaymentCities={setPaymentCities}
                      CountrySelect={DeliveryCountry}
                      PaymentType={PaymentType}
                      setPaymentType={setPaymentType}
                      ContinueButton={ContinueButton}
                      setContinueButton={setContinueButton}
                      setShowPrevPayment={setShowPrevPayment}
                      ShowPrevPayment={ShowPrevPayment}
                      CartItems={CartItems}
                      setCartItems={setCartItems}
                      DeliveryBy={DeliveryBy}
                      setDeliveryBy={setDeliveryBy}
                      TotalPrice={TotalPrice}
                      setTotalPrice={setTotalPrice}
                      ShippingPrice={ShippingPrice}
                      setShippingPrice={setShippingPrice}
                      ProductCombinationItems={ProductCombinationItems}
                      setProductCombinationItems={setProductCombinationItems}
                      product_ids={product_ids}
                      productGlobalShipping={productGlobalShipping}
                      productShippingAvailable={productShippingAvailable}
                      productCity={productCity}
                      TaxValue={TaxValue}
                      setTaxValue={setTaxValue}
                      OverallCity={OverallCity}
                    />
                  )}
                  {parseInt(DeliveryCountry) === 226 && parseInt(CartItems[0].ProductCountry) === 226 && (
                    <UsaDelivery
                      BanglaBazarPickUp={BanglaBazarPickUp}
                      PickUpByUser={PickUpByUser}
                      AllowStorePickup={AllowStorePickup}
                      setAllowStorePickup={setAllowStorePickup}
                      setPaymentStates={setPaymentStates}
                      setPaymentCities={setPaymentCities}
                      CountrySelect={DeliveryCountry}
                      PaymentType={PaymentType}
                      setPaymentType={setPaymentType}
                      ContinueButton={ContinueButton}
                      setContinueButton={setContinueButton}
                      setShowPrevPayment={setShowPrevPayment}
                      ShowPrevPayment={ShowPrevPayment}
                      CartItems={CartItems}
                      setCartItems={setCartItems}
                      DeliveryBy={DeliveryBy}
                      setDeliveryBy={setDeliveryBy}
                      TotalPrice={TotalPrice}
                      setTotalPrice={setTotalPrice}
                      ShippingPrice={ShippingPrice}
                      setShippingPrice={setShippingPrice}
                      ProductCombinationItems={ProductCombinationItems}
                      setProductCombinationItems={setProductCombinationItems}
                      product_ids={product_ids}
                      productGlobalShipping={productGlobalShipping}
                      productShippingAvailable={productShippingAvailable}
                      productCity={productCity}
                      TaxValue={TaxValue}
                      setTaxValue={setTaxValue}
                      OverallCity={OverallCity}
                    />
                  )}
                  {parseInt(DeliveryCountry) === 16 && parseInt(CartItems[0].ProductCountry) === 226 && (
                    <GlobalDeliveryXPS
                      BanglaBazarPickUp={BanglaBazarPickUp}
                      PickUpByUser={PickUpByUser}
                      AllowStorePickup={AllowStorePickup}
                      setAllowStorePickup={setAllowStorePickup}
                      setPaymentStates={setPaymentStates}
                      setPaymentCities={setPaymentCities}
                      CountrySelect={DeliveryCountry}
                      PaymentType={PaymentType}
                      setPaymentType={setPaymentType}
                      ContinueButton={ContinueButton}
                      setContinueButton={setContinueButton}
                      setShowPrevPayment={setShowPrevPayment}
                      ShowPrevPayment={ShowPrevPayment}
                      CartItems={CartItems}
                      setCartItems={setCartItems}
                      DeliveryBy={DeliveryBy}
                      setDeliveryBy={setDeliveryBy}
                      TotalPrice={TotalPrice}
                      setTotalPrice={setTotalPrice}
                      ShippingPrice={ShippingPrice}
                      setShippingPrice={setShippingPrice}
                      ProductCombinationItems={ProductCombinationItems}
                      setProductCombinationItems={setProductCombinationItems}
                      product_ids={product_ids}
                      productGlobalShipping={productGlobalShipping}
                      productShippingAvailable={productShippingAvailable}
                      productCity={productCity}
                      TaxValue={TaxValue}
                      setTaxValue={setTaxValue}
                      OverallCity={OverallCity}
                    />
                  )}
                </>
              )}
            </div>
            <div className="col-xl-4 col-md-5 col-sm-12 order-1 order-xl-2 order-md-2">
              <div className="order-summary-box">
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
              <div className="order-summary-box  mt-3">
                <h5 className="p-3 pb-2 mb-0">Order Summary</h5>
                <h6 className="text-secondary p-3 mb-0 pb-2 ">
                  Products ({CartItems.length})
                </h6>
                <div className="secondary-border"></div>
                {CartItems.map((item, index) => (
                  <CartDetailCartItem
                    product={item}
                    combination={ProductCombinationItems[index]}
                  />
                ))}

                <div className="secondary-border"></div>
                <div className="section-1">
                  <div className="d-flex justify-content-between summary-detail">
                    <div className="summary-attrib">Subtotal</div>
                    <div className="summary-attrib-val">
                      {CartItems.length > 0 && CartItems[0].Currency}{" "}
                      {parseFloat(TotalPrice).toFixed(2)}
                    </div>
                  </div>

                  {DeliveryBy === "pathao" ||
                    DeliveryBy === "VS" ||
                    DeliveryBy === "usps_intl" ||
                    DeliveryBy === "usps" ||
                    DeliveryBy === "dd" ? (
                    <div className="d-flex justify-content-between summary-detail">
                      <div className="summary-attrib">Shipping Amount</div>
                      <div className="summary-attrib-val">
                        {CartItems.length > 0 && CartItems[0].Currency}{" "}
                        {ShippingPrice && ShippingPrice.toFixed(2)}
                      </div>
                    </div>
                  ) : null}
                  {console.log(TaxValue, "TaxValue1")}
                  {DeliveryCountry && parseInt(CartItems[0].ProductCountry) === parseInt(DeliveryCountry) && TaxValue ? (
                    <div className="d-flex justify-content-between summary-detail">
                      <div className="summary-attrib">Tax Rate</div>
                      <div className="summary-attrib-val">
                        {CartItems.length > 0 && CartItems[0].Currency}{" "}
                        {TaxValue && TaxValue.toFixed(2)}
                      </div>
                    </div>
                  ) : null}
                </div>
                {console.log(TaxValue, "TaxValue")}
                <div className="section-1">
                  <div className="d-flex justify-content-between summary-detail-total">
                    <div className="summary-attrib">Total</div>
                    <div className="summary-attrib-val">
                      {CartItems.length > 0 && CartItems[0].Currency}{" "}
                      {parseFloat(
                        ShippingPrice + TotalPrice + (TaxValue ? TaxValue : 0)
                      ).toFixed(2)}
                    </div>
                  </div>
                </div>
                {/* <div className="p-2">
                  <button className="btn btn-lg btn-block btn-success w-100">
                    Proceed To Checkout
                  </button>
                </div> */}
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
export default PaymentAndDelivery;
