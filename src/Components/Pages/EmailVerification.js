import { useEffect, useState } from "react";
import verifiedEmail from "../../assets/images/email-verified.svg";
import unverifiedEmail from "../../assets/images/email-failed.svg";
import logo from "../../assets/images/logo.png";
import Loading from "../../Utils/Loading";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import Endpoint from "./../../Utils/Endpoint";
export function EmailVerify() {
  const { email } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isverified, setIsVerified] = useState("");
  var verifyemail = async () => {
    setIsLoading(true);
    try {
      var form = new URLSearchParams();
      form.append("EmailAddress", email);
      form.append("EmailVerified", "Y");
      var response = await axios.put(Endpoint + "/api/user/update-email", form);
      if (response.data.status) {
        setIsVerified(true);
        setIsLoading(false);
      } else {
        setIsVerified(false);
        setIsLoading(false);
      }
    } catch (e) {
      setIsVerified(false);
      setIsLoading(false);
      toast.info("Something went wrong!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  useEffect(() => {
    verifyemail();
    // window.close();
  }, []);
  return (
    <div className="container">
      <ToastContainer />
      <div className="row my-auto" style={{ height: "100vh" }}>
        <div className="col-md-6 col-sm-10 m-auto">
          <div className="text-center">
            <img src={logo} className="logo" />
          </div>
          {isLoading ? (
            <div className="mt-5">
              <Loading text="Please Wait..." />
            </div>
          ) : (
            <>
              {isverified && (
                <div className="text-center mt-5">
                  <div>
                    <img
                      src={verifiedEmail}
                      className="img-fluid"
                      style={{ height: "250px" }}
                    />
                  </div>
                  <div className="mt-2">
                    <h6 className="ftw-400">Email is verified successfully!</h6>
                  </div>
                </div>
              )}
              {!isverified && (
                <div className="text-center mt-5">
                  <div>
                    <img
                      src={unverifiedEmail}
                      className="img-fluid"
                      style={{ height: "250px" }}
                    />
                  </div>
                  <div className="mt-2">
                    <h6 className="ftw-400">
                      Sorry there was some problem verifying your email, please
                      contact administator!
                    </h6>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
