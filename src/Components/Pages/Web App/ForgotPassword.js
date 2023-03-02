import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  Row,
  Form,
  Label,
  FormGroup,
  Input,
  Button,
  Spinner,
} from "reactstrap";
import OtpInput from "react-otp-input";
import Image from "../../../assets/images/otp-img.png";
import Forgot from "../../../assets/images/forgot-img.png";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Endpoint from "../../../Utils/Endpoint";
import CheckEmpty from "../../../Utils/CheckEmpty";
import logo from "../../../assets/images/logo.png";
import TopBar from "./Layout/TopBar";
import { useHistory } from "react-router-dom";
function ForgotPassword(props) {
  const toggle = () => props.setISOpen(!props.isOpen);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(1);
  const history = useHistory();
  var verifyOtp = async () => {
    setIsLoading(true);
    if (otp.length < 0) {
      setIsLoading(false);
      return toast.error("Please provide otp!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      try {
        var form = new URLSearchParams();
        form.append("email_address", email);
        form.append("OTP", otp);
        var response = await axios.post(
          `${Endpoint}/api/user/verify-otp`,
          form
        );
        if (response.data.status) {
          toast.success("Verified", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            setIsLoading(false);
            setShow(3);
          }, 3000);
        } else {
          setIsLoading(false);
          toast.error(response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (e) {
        console.log(e);
        setIsLoading(false);
        return toast.error(
          "Something went wrong please contact administrator!",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }
        );
      }
    }
  };

  var EmailCheck = async () => {
    if (CheckEmpty(email)) {
      return toast.error("Please provide an email!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    try {
      var form = new URLSearchParams();
      form.append("email_address", email);
      const response = await axios.post(Endpoint + "/api/user/forgot", form);
      console.log(response);
      if (response.data.status) {
        toast.success("OTP is sent to your email!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          setShow(2);
        }, 2000);
      } else {
        toast.info(response.data.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (e) {
      toast.error("Something went wrong please contact administrator!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(e);
    }
  };
  var updatePassword = async () => {
    try {
      if (CheckEmpty(password)) {
        return toast.error("Please provide a password", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (CheckEmpty(confirmpassword)) {
        return toast.error("Please provide a password for confirmation", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (password !== confirmpassword) {
        return toast.error("Password Mismatched!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        var form = new URLSearchParams();
        form.append("password", password);
        form.append("email_address", email);
        var response = await axios.post(
          Endpoint + "/api/user/update-password",
          form
        );
        if (response.data.status) {
          toast.success("Password Updated Successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setTimeout(() => {
            history.replace("/home/toggle");
          }, 2000);
        } else {
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } catch (e) {
      toast.error("Something went wrong please contact administrator!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(e);
    }
  };
  return (
    <div>
      <TopBar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="row m-auto mb-5">
        <div className="col-lg-9 col-md-10 col-sm-12 m-auto">
          {show === 1 && (
            <>
              <div className="mt-5">
                <div className="text-center">
                  <img src={logo} className="logo" />
                  <div className="mt-5">
                    <h2 className="ftw-400">
                      Forgot your password? We can help.
                    </h2>
                    <div className="row m-0">
                      <div className="col-xl-5 col-lg-6 col-md-8 col-sm-8 col-xs-12 m-auto">
                        <p>
                          Enter the email address for your BanglaBazar account.
                          We'll send a verification code for you to enter before
                          signing in
                        </p>
                      </div>
                    </div>
                    <div className="row m-0">
                      <div className="col-xl-5 col-lg-6 col-md-8 col-sm-8 col-xs-12 m-auto">
                        <input
                          className="form-control"
                          placeholder="Enter your email"
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                          className="btn btn-default btn-block mt-5 w-100"
                          onClick={() => EmailCheck()}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          {show === 2 && (
            <div className="row m-auto mb-5">
              <div className="col-xl-8 col-lg-8 col-md-10 col-sm-10 col-xs-12 m-auto">
                <div className="text-center mt-5">
                  <img src={logo} className="logo" />
                </div>
                <div className="text-center mt-5">
                  <img
                    src={Image}
                    className="img-otp"
                    style={{ height: "140px" }}
                  />
                  <h2 className="ftw-400 mt-4">Please Verify Account</h2>

                  <div className="otp-input text-center">
                    <div className="col-xl-8 col-lg-8 col-md-8 col-sm-11 col-xs-12 m-auto">
                      <p className="default-p">
                        Enter the five digits code we sent to your email address
                        to verify your new BanglaBazar account.
                      </p>
                      <OtpInput
                        value={otp}
                        onChange={(e) => setOtp(e)}
                        numInputs={5}
                        separator={<span className="text-white">{""}</span>}
                      />
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-xl-7 col-lg-7 col-md-7 col-sm-8 col-xs-12 m-auto">
                      <button
                        className="btn btn-block btn-default w-100 border-radius-25"
                        style={{ fontSize: "20px" }}
                        onClick={() => verifyOtp()}
                      >
                        {isLoading ? (
                          <Spinner color="success" />
                        ) : (
                          " Verify & Continue"
                        )}
                      </button>
                    </div>
                  </div>
                  {/* <div className="mt-5 mb-5">
                    <div className="col-9 m-auto">
                      <p className="default-p">
                        It may take a minute to receive your code. Haven't
                        received any code ?{" "}
                        <Link
                          className="text-default td-none"
                          to="#"
                          onClick={() => resendOtp()}
                        >
                          Resend a new code
                        </Link>
                        .
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}
          {show === 3 && (
            <div className="row m-auto mb-5">
              <div className="col-xl-8 col-lg-8 col-md-10 col-sm-10 col-xs-12 m-auto">
                <div className="text-center mt-5">
                  <img src={logo} className="logo" />
                </div>
                <div className="text-center mt-5">
                  <img
                    src={Forgot}
                    className="img-otp"
                    style={{ height: "140px" }}
                  />
                  <h2 className="ftw-400 mt-4">Create new password</h2>

                  <div className="row">
                    <p className="default-p">
                      Your new password must be different from the previous used
                      passwords.
                    </p>
                    <div className="col-xl-8 col-lg-10 col-md-10 col-sm-10 col-xs-12 m-auto">
                      <div>
                        <input
                          className="form-control"
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="New Password"
                          type="password"
                        />
                      </div>
                      <div className="mt-2">
                        <input
                          className="form-control"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                          type="password"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row mt-5">
                    <div className="col-xl-8 col-lg-10 col-md-10 col-sm-10 col-xs-12 m-auto">
                      <button
                        className="btn btn-block btn-default w-100 border-radius-25"
                        style={{ fontSize: "18px" }}
                        onClick={() => updatePassword()}
                      >
                        Update
                      </button>
                    </div>
                  </div>
                  {/* <div className="mt-5 mb-5">
                    <div className="col-9 m-auto">
                      <p className="default-p">
                        It may take a minute to receive your code. Haven't
                        received any code ?{" "}
                        <Link
                          className="text-default td-none"
                          to="#"
                          onClick={() => resendOtp()}
                        >
                          Resend a new code
                        </Link>
                        .
                      </p>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ForgotPassword;
