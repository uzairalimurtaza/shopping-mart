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
import Image from "../../../../assets/images/otp-img.png";
import { toast } from "react-toastify";
import axios from "axios";
import Endpoint from "./../../../../Utils/Endpoint";

import { Link } from "react-router-dom";
function OtpVerify(props) {
  const toggle = () => props.setOtpModal(!props.otpmodal);
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const email = localStorage.getItem("verifyEmail");
  useEffect(() => {
    props.setOtpModal(props.otpmodal);
  }, [props.otpmodal]);
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
        form.append("email", email);
        form.append("otp", otp);
        var response = await axios.post(`${Endpoint}/api/user/verify`, form);
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
            props.setOtpModal(!props.otpmodal);
            props.setSignIn(!props.signin);
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
  var resendOtp = async () => {
    try {
      var form = new URLSearchParams();
      form.append("email", email);
      var response = await axios.post(`${Endpoint}/api/user/resend`,form);
      if (response.data.status) {
        return toast.info("Otp sent to your email", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        return toast.error(response.data.message, {
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
      return toast.error("Something went wrong please contact administrator!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  return (
    <div>
      <Modal
        isOpen={props.otpmodal}
        toggle={props.otpmodal}
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={toggle} className="landing-signin"></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 m-auto">
              <div className="text-center">
                <img
                  src={Image}
                  className="img-otp"
                  style={{ height: "140px" }}
                />
                <h2 className="ftw-400 mt-4">Please Verify Account</h2>

                <div className="otp-input text-center">
                  <div className="col-xl-8 col-lg-8 col-md-10 col-sm-12 m-auto">
                    <p className="default-p">
                      Enter the five digits code we sent to your email address to
                      verify your new BanglaBazar account.
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
                  <div className="col-xl-7 col-lg-7 col-md-9 col-sm-12  m-auto">
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
                <div className="mt-5 mb-5">
                  <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 m-auto">
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
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default OtpVerify;
