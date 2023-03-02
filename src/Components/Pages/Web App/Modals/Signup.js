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
import ReCAPTCHA from "react-google-recaptcha";
import logo from "../../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import { ToastContainer, toast } from "react-toastify";
import "react-phone-input-2/lib/bootstrap.css";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import Endpoint from "./../../../../Utils/Endpoint";
import axios from "axios";
import { GetNotificationType } from "./../../../../Helpers/GetNotificationTypes";
import {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
  validatePhoneNumberLength,
} from "libphonenumber-js";
import { reCAPTCHA_SITE_KEY } from "../../../../Utils/Captcha";

function Signup(props) {
  const toggle = () => props.setSignUp(!props.signup);
  useEffect(() => {
    getIp();
    props.setSignUp(props.signup);
  }, [props.signup]);
  const [IPAddress, setIp] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Birthday, setBirthday] = useState("");
  const [Gender, setGender] = useState("male");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [captcha, setCaptcha] = useState(null);
  var validatePhoneNumber = (phone) => {
    var first = isPossiblePhoneNumber(phone) === true;
    if (!first) {
      return [false, "Invalid Phone Number!"];
    }
    var second = isValidPhoneNumber(phone) === true;
    if (!second) {
      return [false, "Invalid Phone Number!"];
    }

    var third = validatePhoneNumberLength(phone) === "TOO_SHORT" ? false : true;
    if (!third) {
      return [false, "Invalid Phone Number Length!"];
    }
    var fourth = validatePhoneNumberLength(phone) === undefined;
    if (!fourth) {
      return [false, "Invalid Phone Number Length"];
    }
    var fifth =
      validatePhoneNumberLength(phone) === "INVALID_COUNTRY" ? false : true;
    if (!fifth) {
      return [false, "Invalid Country"];
    }
    var sixth = validatePhoneNumberLength(phone) === "TOO_LONG" ? false : true;
    if (!sixth) {
      return [false, "Invalid Phone Number Length"];
    }
    return [true, "Valid Phone Number"];
  };

  const register = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (CheckEmpty(username)) {
      setIsLoading(false);
      return toast.error("Please provide your name!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (CheckEmpty(email)) {
      setIsLoading(false);
      return toast.error("Please provide your email!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (!email.match(format)) {
      setIsLoading(false);
      return toast.error(`Invalid Email Format`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    // else if (CheckEmpty(Birthday)) {
    //   setIsLoading(false);
    //   return toast.error("Please provide your date of birth!", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // } else if (CheckEmpty(Gender)) {
    //   return toast.error("Please provide your gender!", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // } else if (CheckEmpty(phone_number)) {
    //   setIsLoading(false);

    //   return toast.error("Please provide phone number!", {
    //     position: "top-right",
    //     autoClose: 3000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //   });
    // }
    else if (CheckEmpty(password)) {
      setIsLoading(false);
      return toast.error("Please set a password!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    else if (password.length < 8) {
      setIsLoading(false);
      return toast.error("Password should be atleast 8 characters!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }

    else if (CheckEmpty(confirmpassword)) {
      setIsLoading(false);
      return toast.error("Confirm your password first!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else if (password !== confirmpassword) {
      setIsLoading(false);
      return toast.error("Password mismatched!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      // var [status, message] = validatePhoneNumber("+" + phone_number);
      // if (!status) {
      //   setIsLoading(false);
      //   return toast.error(message, {
      //     position: "top-center",
      //     autoClose: 5000,
      //     hideProgressBar: true,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //   });
      // }

      var data = {
        UserName: username,
        EmailAddress: email,
        // Birthday,
        // Gender,
        Password: password,
        IPAddress,
        // phone_number,
      };
      try {
        var form = new URLSearchParams();
        for (var key in data) {
          form.append(key, data[key]);
        }
        var response = await axios.post(`${Endpoint}/api/user/register`, form);
        if (response.data.status) {
          toast.success("Account is created successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setIsLoading(false);
          localStorage.setItem("verifyEmail", email);
          try {
            generateNotification(response.data.profile.insertId);
          } catch (e) {
            console.log(e);
          }
          setTimeout(() => {
            props.setSignUp(!props.signup);
            props.setOtpModal(!props.otpmodal);
          }, 3000);
        } else {
          setIsLoading(false);
          toast.success(response.data.message, {
            position: "top-right",
            autoClose: 7000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      } catch (e) {
        setIsLoading(false);
        if (e.response) {
          return toast.error(e.response.data.message, {
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
    }
  };
  var generateNotification = async (userId) => {
    try {
      let form = new URLSearchParams();
      form.append("TypeID", await GetNotificationType("registration"));
      form.append("UserID", userId);
      var response = await axios.post(`${Endpoint}/api/user/add`, form);
    } catch (e) {
      console.log(e);
      toast.error("Something went wrong", {
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
  var handleCaptchaChange = (value) => {
    setCaptcha(value);
  };
  var getIp = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    // console.log(res.data);
    setIp(res.data.IPv4);
  };
  const format =
    /(^(?!.*__.*)[a-z0-9]{2,253}(_?)[a-z0-9]+(?:\.[a-z0-9!#$%&*+\/=?^`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?$)/gs;

  return (
    <div>
      {/* <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      /> */}
      <Modal
        isOpen={props.signup}
        toggle={props.signup}
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={toggle} className="landing-signin"></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xl-11 col-lg-11 col-md-12 col-sm-12 m-auto">
              <div className="text-center">
                <img src={logo} className="logo" />
                <h5 className="ftw-400 mt-4">Sign up</h5>
                <p className="default-p">Create your account</p>
                <Row>
                  <Col lg={10} className="m-auto">
                    <Form className="mb-2">
                      <FormGroup>
                        <Input
                          type="text"
                          name="text"
                          className="user-inputs"
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Full Name"
                        />
                      </FormGroup>
                      <FormGroup className="mt-2">
                        <Input
                          type="email"
                          name="email"
                          onChange={(e) => setEmail(e.target.value)}
                          className="user-inputs"
                          placeholder="Enter your email"
                        />
                      </FormGroup>
                      {/* <FormGroup className="mt-2">
                        <Input
                          type="date"
                          className="user-inputs"
                          onChange={(e) => setBirthday(e.target.value)}
                        />
                      </FormGroup> */}
                      {/* <FormGroup className="mt-2">
                        <Input
                          type="select"
                          className="user-inputs"
                          onChange={(e) => setGender(e.target.value)}
                          placeholder="Select"
                        >
                          <option value="male" className="text-default">
                            Male
                          </option>
                          <option value="female" className="text-default">
                            Female
                          </option>
                          <option value="others" className="text-default">
                            Others
                          </option>
                        </Input>
                      </FormGroup> */}
                      {/* <FormGroup className="mt-2">
                        <PhoneInput
                          value={phone_number}
                          inputClass="user-inputs"
                          country={"bd"}
                          onChange={(phone) => setPhoneNumber(phone)}
                        />
                      </FormGroup> */}
                      <FormGroup className="mt-2">
                        <Input
                          type="password"
                          name="password"
                          onChange={(e) => setPassword(e.target.value)}
                          className="user-inputs"
                          placeholder="Enter password"
                        />
                      </FormGroup>
                      <FormGroup className="mt-2">
                        <Input
                          type="password"
                          name="password"
                          className="user-inputs"
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm Password"
                        />
                      </FormGroup>
                      <div className="mt-3">
                        <ReCAPTCHA
                          sitekey={reCAPTCHA_SITE_KEY}
                          onChange={handleCaptchaChange}
                        />
                      </div>

                      <div className="mt-2">
                        <div style={{ fontSize: "16px", textAlign: "left" }}>
                          By creating an account, you agree to BanglaBazar's
                          <Link to="#" className="td-none">
                            {" "}
                            Conditions of Use
                          </Link>{" "}
                          and{" "}
                          <Link className="td-none" to="#">
                            Privacy Notice.
                          </Link>{" "}
                        </div>
                      </div>
                      <Button
                        className="btn-default btn-block w-100 border-radius-25 mt-4"
                        onClick={(e) => register(e)}
                        disabled={isLoading || captcha == null}
                      >
                        {isLoading ? <Spinner color="success" /> : "Sign Up"}
                      </Button>
                    </Form>
                    <div style={{ fontSize: "13px" }} className="mb-3">
                      Already have an account ?{" "}
                      <Link
                        to="#"
                        className="text-default"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          props.setSignIn(!props.signin);
                          props.setSignUp(!props.signup);
                        }}
                      >
                        Sign in
                      </Link>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default Signup;
