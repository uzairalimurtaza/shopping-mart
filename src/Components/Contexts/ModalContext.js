import React from "react";

const MODAL_CONTEXT = React.createContext({
  signin: false,
  signup: false,
  phoneVerify: false,
  emailVerify: false,
});
export const MODAL_CONTEXT_PROVIDER = MODAL_CONTEXT.Provider;
export default MODAL_CONTEXT;
