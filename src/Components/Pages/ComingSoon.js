import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Navbar,
  NavbarBrand,
} from "reactstrap";
import logo from "../../assets/images/logo.png";
import waitingImage from "../../assets/images/cs-1.png";
import { useEffect, useState } from "react";
import Endpoint from "./../../Utils/Endpoint";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
function ComingSoon() {
  const [show, setShow] = useState(false);
  const [days, setDays] = useState("00");
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");
  const [email, setEmail] = useState("");
  useEffect(() => {
    setInterval(function () {
      var date_future = new Date(new Date("2021-12-16"));
      var date_now = new Date();

      var seconds = Math.floor((date_future - date_now) / 1000);
      var minutes = Math.floor(seconds / 60);
      var hours = Math.floor(minutes / 60);
      var days = Math.floor(hours / 24);

      hours = hours - days * 24;
      minutes = minutes - days * 24 * 60 - hours * 60;
      seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

      days = days < 10 ? "0" + days : days;
      hours = hours < 10 ? "0" + hours : hours;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      setDays(days);
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);
    setShow(true);
  }, []);
  const notify = async () => {
    if (email.length < 1) {
      return toast.error("Please Provide your email!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
    try {
      var form = new URLSearchParams();
      form.append("email_address", email);
      var response = await axios.post(`${Endpoint}/api/news-letter/add`, form);
      if (response.data.status) {
        toast.success("Your response has been saved, Thank You!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setEmail("");
        document.getElementById("email").value = "";
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    show && (
      <div className="main-container-landing row m-0">
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
        <div className="col-xl-11 col-lg-11 col-md-12 col-sm-12 m-auto">
          <Navbar
            style={{
              boxShadow: "none",
              backgroundColor: "none",
              background: "none",
            }}
          >
            <NavbarBrand href="/" className="mr-auto">
              <img src={logo} alt="logo" className="logo img-fluid" />
            </NavbarBrand>
          </Navbar>
          <div className="landing-container row m-0 mb-3">
            <div className="col-xl-10 col-lg-10 col-md-12 col-sm-12 m-auto">
              <img
                src={waitingImage}
                className="img-fluid centered"
                style={{ height: "242px", marginBottom: "30px" }}
                alt="waiting"
              />
              <div className="row mb-3 ml-0 mr-0">
                <div className="col-lg-7 col-xl-7 col-md-12 col-sm-12 m-auto">
                  <div className="text-center">
                    {/* <div className="text-default counter-text-1">{days}</div>
                    <div className="text-default counter-text-1">:</div>
                    <div className="text-default counter-text-1">{hours}</div>
                    <div className="text-default counter-text-1">:</div>
                    <div className="text-default counter-text-1">{minutes}</div>
                    <div className="text-default counter-text-1">:</div>
                    <div className="text-default counter-text-1">{seconds}</div> */}
                    <h1 className="text-default">Coming Soon, Stay Tuned!</h1>
                  </div>
                  {/* <div className="d-flex justify-content-between">
                    <div
                      className="text-secondary counter-text-2"
                      style={{ marginLeft: "15px" }}
                    >
                      DAYS
                    </div>
                    <div
                      className="text-secondary counter-text-2"
                      style={{ marginLeft: "25px" }}
                    >
                      HOURS
                    </div>
                    <div className="text-secondary counter-text-2">MINUTES</div>
                    <div className="text-secondary counter-text-2">SECONDS</div>
                  </div> */}
                </div>
              </div>

              <div className="row">
                {/* <div className="col-lg-12 col-xl-12 col-md-12 m-auto">
                  <div>
                    <p className="launching-text">
                      We are launching on December 16, 2021 !
                    </p>
                  </div>
                </div> */}
                <div className="col-lg-10 col-xl-10 col-md-10 col-sm-12 m-auto">
                  <p className="launching-text-next">
                    Watch This space, or get notified by providing us your email
                    address.
                  </p>
                </div>
                <div className="row">
                  <div className="col-lg-6 col-xl-6 col-md-8 col-sm-12 m-auto ">
                    <InputGroup className="email-notify">
                      <Input
                        className="notify-inp"
                        placeholder="Enter email address"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <InputGroupAddon addonType="append">
                        <Button
                          className="btn-default btn-notify-curved"
                          onClick={() => notify()}
                        >
                          Notify Me
                        </Button>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
export default ComingSoon;
