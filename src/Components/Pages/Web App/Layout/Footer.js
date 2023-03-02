import logo from "../../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import Signup from "./../Modals/Signup";
import { CurrentUser } from "./../../../../Helpers/Auth";
import Signin from "./../Modals/Signin";
import { useHistory } from "react-router-dom";
export function Footer() {
  const history = useHistory();
  const [signup, setSignup] = useState(false);
  const [signin, setSignin] = useState(false);
  const [otpmodal, setOtpModal] = useState(false);
  var reload = () => {
    window.location.reload();
  };
  return (
    <footer>
      <div className="row justify-content-around mb-0 pt-5 pb-0 m-0">
        <div className="col-12">
          <div
            className="row justify-content-center"
            style={{ padding: "40px 0px" }}
          >
            <div className="col-md-3 col-12 font-italic align-items-center mt-md-3 mt-4 ">
              <h5>
                <span>
                  {" "}
                  <img src={logo} className="img-fluid mb-1 logo" />
                </span>
              </h5>
              {/* <div>
                <b>E-TIN : </b> 713387224269/Circle-326
              </div>
              <p
                className="social mt-md-3 mt-2"
                style={{ lineHeight: "1rem", fontSize: "16px" }}
              >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore.
              </p>{" "} */}
              <div>
                <span style={{ marginRight: "10px" }}>
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fab fa-facebook"></i>
                  </button>
                </span>
                <span style={{ marginRight: "10px" }}>
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fab fa-instagram"></i>
                  </button>
                </span>
                <span style={{ marginRight: "10px" }}>
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fab fa-twitter"></i>
                  </button>
                </span>
                <span style={{ marginRight: "10px" }}>
                  <button className="rounded-circle image-text-button">
                    {" "}
                    <i className="fab fa-youtube"></i>
                  </button>
                </span>
              </div>
            </div>
            {/* <div className="col-md- col-12 font-italic align-items-center mt-md-3 mt-4 "></div> */}
            <div className="col-md-2 col-12 my-sm-0 mt-5 ">
              <ul className="list-unstyled">
                <li className="mt-md-3 mt-4 footer-Links-heading">
                  Quick Links
                </li>
                {/* <li className="footer-Links-heading-child">
                  {" "}
                  <Link to="/" className="td-none" style={{ color: "#ababab" }}>
                    Home
                  </Link>
                </li>
                <li className="footer-Links-heading-child">Categories</li> */}
                <li className="footer-Links-heading-child">
                  {" "}
                  <Link
                    to="/privacy-policy"
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="footer-Links-heading-child">
                  <Link
                    to="/terms-conditions"
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li className="footer-Links-heading-child">
                  <Link
                    to="/about-us"
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    About Us
                  </Link>
                </li>
                <li className="footer-Links-heading-child">
                  <Link
                    to="/refund-and-return"
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-md-2 col-12 my-sm-0 mt-5  ">
              <ul className="list-unstyled">
                <li className="mt-md-3 mt-4 footer-Links-heading">
                  My Account
                </li>
                <li className="footer-Links-heading-child">
                  {" "}
                  <Link
                    to="/my-cart"
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    View Cart
                  </Link>
                </li>
                <li className="footer-Links-heading-child">
                  {" "}
                  <Link
                    to="/my-wishlist"
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    My Wishlist
                  </Link>
                </li>
                {!CurrentUser && (
                  <li className="footer-Links-heading-child">
                    {" "}
                    <Link
                      to="#"
                      className="td-none"
                      style={{ color: "#ababab" }}
                      onClick={() => setSignup(true)}
                    >
                      Sign up
                    </Link>
                  </li>
                )}
                {/* <li className="footer-Links-heading-child">Help</li> */}
              </ul>
            </div>
            <div className="col-xl-auto col-md-2 col-12 my-sm-0 mt-5 ">
              <ul className="list-unstyled">
                <li className="mt-md-3 mt-4 footer-Links-heading">
                  Customer Service
                </li>
                <li className="footer-Links-heading-child">
                  <Link
                    to="#"
                    onClick={() => {
                      if (CurrentUser) {
                        history.push("/sell");
                      } else {
                        setSignin(!signin);
                      }
                    }}
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    Become a Vendor
                  </Link>
                </li>
                <li className="footer-Links-heading-child">
                  <Link
                    to="/contact-us"
                    className="td-none"
                    style={{ color: "#ababab" }}
                  >
                    Contact Us
                  </Link>
                </li>
                {/* <li className="footer-Links-heading-child">Payment Methods</li>
                <li className="footer-Links-heading-child">
                  Money-Back Guarantee
                </li>
                <li className="footer-Links-heading-child">Product Features</li>
                <li className="footer-Links-heading-child">Products Returns</li>
                <li className="footer-Links-heading-child">Support Center</li>
                <li className="footer-Links-heading-child">Shipping</li> */}
              </ul>
            </div>
          </div>
          <div
            className="text-center"
            style={{
              borderTop: "1px solid #EEEEEE",
              padding: "10px 0px",
              fontSize: "18px",
              color: "#ABABAB",
            }}
          >
            <small className="copy-rights cursor-pointer">
              Copyright &#169; 2021 BanglaBazar.
            </small>
            <small>All Rights Reserved. </small>
          </div>
        </div>
      </div>
      <Signin
        signin={signin}
        setSignIn={setSignin}
        signup={signup}
        setSignUp={setSignup}
        reload={reload}
      />
      <Signup
        signin={signin}
        setSignIn={setSignin}
        signup={signup}
        setSignUp={setSignup}
        otpmodal={otpmodal}
        setOtpModal={setOtpModal}
      />
    </footer>
  );
}
