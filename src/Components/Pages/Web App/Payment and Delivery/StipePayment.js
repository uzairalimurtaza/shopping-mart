import React from "react";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import SplitForm from "./SplitForm";
import ElementDemos from "./ElementDemos";
import "./stripe.css";
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
const demos = [
  {
    path: "/split-card-elements",
    label: "Split Card Elements",
    component: SplitForm,
  },
];
const StripePayment = () => {
  return (
    <Elements stripe={stripePromise}>
      <ElementDemos demos={demos} />
    </Elements>
  );
};

export default StripePayment;
