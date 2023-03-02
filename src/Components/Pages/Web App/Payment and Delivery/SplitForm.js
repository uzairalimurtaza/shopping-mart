import React, { useMemo, useEffect } from "react";
import Logo from "../../../../assets/images/logo.png"
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { useParams } from "react-router-dom"
import useResponsiveFontSize from "./useResponseveFontSize";
import firetoast from './../../../../Helpers/FireToast';
import BanglaBazarApi from './../../../Api/BanglaBazarApi';
import Endpoint from './../../../../Utils/Endpoint';
import { useHistory } from "react-router-dom"
const useOptions = () => {
  const fontSize = useResponsiveFontSize();
  const options = useMemo(
    () => ({
      style: {
        base: {
          fontSize,
          color: "#424770",
          letterSpacing: "0.025em",
          fontFamily: "Source Code Pro, monospace",
          "::placeholder": {
            color: "#aab7c4",
          },
        },
        invalid: {
          color: "#9e2146",
        },
      },
    }),
    [fontSize]
  );

  return options;
};

const SplitForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const history = useHistory()
  const { orderNumber, currency, price, cus_id } = useParams()


  const handleSubmit = async (event) => {

    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    const { token, error } = await stripe.createToken(elements.getElement(CardNumberElement));
    console.log(token, error)
    if (!token) {
      window.alert(error.message)
    }
    processPayment(token.id)


    // const payload = await stripe.createPaymentMethod({
    //   type: "card",
    //   card: elements.getElement(CardNumberElement),
    // });
    // console.log("[PaymentMethod]", payload);
  };
  var processPayment = async (id) => {
    try {
      var response = await BanglaBazarApi.post(`${Endpoint}/api/stripe/validate`, {
        stripeToken: id,
        OrderTotal: Math.round(parseFloat(parseFloat(price).toFixed(2)) * 100),
        Currency: currency,
        OrderNumber: orderNumber,
        CustomerID: cus_id
      })

      if (response.data.status) {
        window.location.href = `/payment-checkout?status=success&paymentType=card`
      }
      else {
        return window.alert(response.data.message || response.data.error)
      }
    }
    catch (e) {
      console.log(e)
    }
  }
  var cancelPayment = async () => {
    try {
      var response = await BanglaBazarApi.get(`${Endpoint}/api/stripe/cancel/${orderNumber}`)
      if (response.data.status) {
        window.location.href = '/payment-checkout?status=cancel&paymentType=card'
      }
      else {
        return firetoast(response.data.message || response.data.error, "3000")
      }
    }
    catch (e) {
      console.log(e)
    }
  }

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="row w-100">
        <div className="col-lg-5 col-md-8 col-sm-12 m-auto">
          <div className="card" style={{ borderRadius: "10%" }}>
            <div className="card-body">
              <div style={{ textAlign: "right", marginRight: "25px", marginTop: "5px" }}>
                <i class="fas fa-times fa-2x text-dark" style={{ cursor: "pointer" }} onClick={() => cancelPayment()}></i>
              </div>
              <div className="text-center m-3">
                <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png"} className="w-25" />
              </div>
              <form onSubmit={handleSubmit} className="my-auto">
                < div className="row align-items-center">
                  <div className="col-4" style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "16px" }} > Card number</span>

                  </div>
                  <div className="col-8">
                    <label className="w-100 m-3">
                      <CardNumberElement
                        options={options}
                        onReady={(e) => {
                          console.log(e);
                        }}
                        onChange={(event) => {
                          console.log("CardNumberElement [change]", event);
                        }}
                        onBlur={() => {
                          console.log("CardNumberElement [blur]");
                        }}
                        onFocus={() => {
                          console.log("CardNumberElement [focus]");
                        }}
                      />
                    </label>
                  </div>
                </div>

                < div className="row align-items-center">
                  <div className="col-4" style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "16px" }}>Expiration date</span>

                  </div>
                  <div className="col-8">
                    <label className="w-100 m-3">
                      <CardExpiryElement
                        options={options}
                        onReady={() => {
                          console.log("CardNumberElement [ready]");
                        }}
                        onChange={(event) => {
                          console.log("CardNumberElement [change]", event);
                        }}
                        onBlur={() => {
                          console.log("CardNumberElement [blur]");
                        }}
                        onFocus={() => {
                          console.log("CardNumberElement [focus]");
                        }}
                      />
                    </label>
                  </div>
                </div>
                < div className="row align-items-center">
                  <div className="col-4" style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "16px" }}>CVC </span>

                  </div>
                  <div className="col-8">
                    <label className="w-100 m-3">
                      <CardCvcElement
                        options={options}

                        onReady={() => {
                          console.log("CardNumberElement [ready]");
                        }}
                        onChange={(event) => {
                          console.log("CardNumberElement [change]", event);
                        }}
                        onBlur={() => {
                          console.log("CardNumberElement [blur]");
                        }}
                        onFocus={() => {
                          console.log("CardNumberElement [focus]");
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div className="text-center mt-3">
                  <button
                    type="submit"
                    className="btn btn-default m-3 btn-lg col-4"
                    disabled={!stripe}
                  >
                    Pay ${parseFloat(price).toFixed(2)}
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitForm;
