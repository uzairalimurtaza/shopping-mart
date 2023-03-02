import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import history from "./Utils/History";
import { Provider } from "react-redux";
import store from "./Store/Store";
import ScrollToTop from "./Utils/ScrollToTop";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history} basename={"/"}>
        <ScrollToTop />
        <App />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
