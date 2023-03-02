import { Alert } from "reactstrap";
import { IsPhoneVerified } from "./../../../../Helpers/CheckPhoneVerification";
import { Link } from "react-router-dom";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { useState, useEffect } from "react";
import logo from "../../../../assets/images/logo.png";
import Image from "../../../../assets/images/otp-img.png";
import OtpInput from "react-otp-input";
import firebase from "./../../../../Helpers/Firebase";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import { toast } from "react-toastify";

export function BusinessPhoneVerificationModal(props) {
  const { phoneVerify, setPhoneVerify, phoneToBeVerified, setPhoneStatus } =
    props;

  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => {
    setPhoneVerify(!phoneVerify);
  };
  const [countDownTime, setCountDownTime] = useState("");
  const [showResend, setShowResend] = useState(false);
  async function timer(remaining) {
    var m = Math.floor(remaining / 60);
    var s = remaining % 60;

    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;

    setCountDownTime(m + ":" + s);
    remaining -= 1;

    if (remaining >= 0) {
      setTimeout(function () {
        timer(remaining);
      }, 1000);
      return;
    }
    if (remaining < 1) {
      setShowResend(true);
    }
  }
  // console.log(firebase);
  useEffect(() => {
    if (phoneVerify) {
      const container = document.getElementById("main");
      const element = document.createElement("div");
      element.setAttribute("id", "sign-in-button");
      container.appendChild(element);
      configureCaptcha();
    }

    if (!phoneVerify) {
      const elmnt = document.getElementById("sign-in-button");
      if (elmnt) {
        elmnt.remove();
      }
    }
  }, [phoneVerify]);
  var configureCaptcha = async () => {
    const auth = await getAuth();
    console.log(auth);
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "sign-in-button",
        {
          size: "invisible",
          callback: (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            console.log(response);
          },
          defaultCountry: "PK",
        },
        auth
      );
      toast.info("OTP is sent to your registered mobile number!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      onSignInSubmit();
    } catch (e) {
      setPhoneVerify(!phoneVerify);
      console.log(e);
    }
  };
  var onSignInSubmit = () => {
    // console.log("SMS Method");

    const auth = getAuth();
    const phoneNumber = props.phoneToBeVerified.includes("+")
      ? props.phoneToBeVerified
      : "+" + props.phoneToBeVerified;

    const appVerifier = window.recaptchaVerifier;

    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        console.log("confirmation");
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        // ...
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  let verifyOtp = async () => {
    var code = otp;
    window.confirmationResult
      .confirm(code)
      .then(async (result) => {
        toast.info("OTP Successfully verified", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        setPhoneVerify(!phoneVerify);
        props.setPhoneStatus(true);
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something went wrong!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };
  return (
    <div className="container mt-3" id="main">
      {/* <div id="sign-in-button"></div> */}
      <Modal
        isOpen={phoneVerify}
        toggle={() => {
          toggle();
        }}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={toggle} className="landing-signin"></ModalHeader>
        <ModalBody>
          {" "}
          <div className="row m-auto mb-2">
            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xs-12 m-auto">
              <div className="text-center mt-5">
                <img src={logo} className="logo" />
              </div>
              <div className="text-center mt-5">
                <img
                  src={Image}
                  className="img-otp"
                  style={{ height: "140px" }}
                />
                <h2 className="ftw-400 mt-4">
                  Please Verify Your Phone Number
                </h2>

                <div className="otp-input text-center row m-0">
                  <div className="col-xl-8 col-lg-8 col-md-12 col-sm-12 col-xs-12 m-auto">
                    <p className="default-p">
                      Enter the six digit code we sent to your phone number to
                      verify your new BanglaBazar account.
                    </p>
                    <OtpInput
                      value={otp}
                      onChange={(e) => setOtp(e)}
                      numInputs={6}
                      separator={<span className="text-white">{""}</span>}
                    />
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-xl-7 col-lg-7 col-md-7 col-sm-8 col-xs-12 m-auto">
                    <button
                      className="btn btn-block btn-default w-100 border-radius-25"
                      style={{ fontSize: "20px" }}
                      onClick={() => verifyOtp()}
                    >
                      Verify
                    </button>
                  </div>
                </div>
                <div className="mt-5 mb-5">
                  <div className="col-9 m-auto">
                    <p className="default-p">
                      {" "}
                      {showResend ? (
                        <>
                          Haven't received any code ?
                          <Link className="text-default td-none" to="#">
                            Resend a new code
                          </Link>
                        </>
                      ) : (
                        <>
                          {" "}
                          It may take a minute to receive your code. If not
                          recieved{" "}
                          <Link
                            to="#"
                            className="text-default"
                            onClick={() => onSignInSubmit()}
                          >
                            Resend Code
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
