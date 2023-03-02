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
import logo from "../../../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Endpoint from "./../../../../Utils/Endpoint";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
function Signin(props) {
  var history = useHistory();
  const toggle = () => props.setSignIn(!props.signin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [Ip, setIp] = useState("");

  const format =
    /(^(?!.*__.*)[a-z0-9]{2,253}(_?)[a-z0-9]+(?:\.[a-z0-9!#$%&*+\/=?^`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?$)/gs;

  useEffect(() => {
    props.setSignIn(props.signin);
    setIsLoading(false);
    getIp();
  }, [props.signin]);
  var getIp = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    // console.log(res.data);
    setIp(res.data.IPv4);
  };
  const Login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (CheckEmpty(email)) {
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
    } else if (CheckEmpty(password)) {
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
    } else {
      var data = {
        EmailAddress: email,
        Password: password,
        deviceID: null,
      };
      try {
        var form = new URLSearchParams();
        for (var key in data) {
          form.append(key, data[key]);
        }
        var response = await axios.post(`${Endpoint}/api/user/login`, form);
        if (response.data.status) {
          toast.success("Proceeding...", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          localStorage.setItem("user", JSON.stringify(response.data.user));
          if (CheckEmpty(response.data.user.IPAddress)) {
            var form = new URLSearchParams();
            form.append("IPAddress", Ip);
            form.append("UserID", response.data.user.UserID);
            await axios.put(Endpoint + "/api/admin/update-ip", form);
          }
          setIsLoading(false);
          localStorage.setItem("accessToken", response.data.token);
          setTimeout(() => {
            props.setSignIn(false);
            window.location.href = "/";
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
        isOpen={props.signin}
        toggle={props.signin}
        size="lg"
        backdrop="static"
      >
        <ModalHeader toggle={toggle} className="landing-signin"></ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-xl-9 col-lg-9 col-md-12 m-auto">
              <div className="text-center">
                <img src={logo} className="logo" />
                <h5 className="ftw-400 mt-4">Sign in</h5>
                <p className="default-p ">
                  Sign in to your bangla bazar account
                </p>
                <Row>
                  <Col xl={10} lg={10} md={12} className="m-auto">
                    <Form className="mb-4" onSubmit={Login}>
                      <FormGroup>
                        <Input
                          type="email"
                          name="email"
                          className="user-inputs"
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </FormGroup>
                      <FormGroup className="mt-4">
                        <Input
                          type="password"
                          name="password"
                          className="user-inputs"
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                        />
                      </FormGroup>
                      <div className="d-flex justify-content-between mt-2 ">
                        <FormGroup check>
                          <Label check className="forget-content">
                            <Input type="checkbox" /> Remember me
                          </Label>
                        </FormGroup>
                        <div
                          className="forget-content text-default"
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            window.location.href = "/forgot-password";
                          }}
                        >
                          Forgot password?
                        </div>
                      </div>
                      <Button className="btn-default btn-block w-100 border-radius-25 mt-4">
                        {isLoading ? <Spinner color="success" /> : "Sign In"}
                      </Button>
                    </Form>
                    <div style={{ fontSize: "13px" }} className="mb-3">
                      Don't have an account ?{" "}
                      <Link
                        className="text-default"
                        to="#"
                        style={{ textDecoration: "none" }}
                        onClick={() => {
                          props.setSignIn(!props.signin);
                          props.setSignUp(!props.signup);
                        }}
                      >
                        Sign up
                      </Link>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {/* <ForgotPassword isOpen={fpass} setISOpen={setfpass} /> */}
    </div>
  );
}
export default Signin;
