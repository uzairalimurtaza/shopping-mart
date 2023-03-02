import {
  Card,
  CardBody,
  Col,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useState, useEffect } from "react";


import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import Loading from "./../../../Utils/Loading";
import Endpoint from "./../../../Utils/Endpoint";
import { WebsiteHeader } from "./Layout/Header";
import MODAL_CONTEXT from "../../Contexts/ModalContext";
import { useContext } from "react";
import CheckEmpty from "./../../../Utils/CheckEmpty";
import { CountryCodes } from "../../../Helpers/CountryCodes";
import BanglaBazarApi from './../../Api/BanglaBazarApi';

function UserProfile(props) {
  const {
    phoneVerify,
    setPhoneVerify,
    emailVerify,
    setEmailVerify,
    PhoneNumberToBeVerified,
    setPhoneNumberToBeVerified,
  } = useContext(MODAL_CONTEXT);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  const [UserName, setUserName] = useState("");
  const [EmailAddress, setEmailAddress] = useState("");
  const [BirthDay, setBirthday] = useState("");
  const [Gender, setGender] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [ProfilePic, setProfilePic] = useState(null);
  const [imageUpload, setImageUpload] = useState(false);
  const [status, setStatus] = useState(null);
  const [emailFieldChange, setEmailFieldChange] = useState(false);
  const [phoneFieldChange, setPhoneFieldChange] = useState(false);
  const [CurrentUser, setCurrentUser] = useState({});
  const [CountryCode, setCountryCode] = useState([]);
  const [disable, setDisable] = useState(false);
  useEffect(async () => {
    setImageUpload(true);
    getUserInfo();
    setImageUpload(false);
    setCountryCode(await CountryCodes());
  }, []);
  var getUserInfo = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get/${props.match.params.id}`
      );
      let data = response.data.profile;
      // setFirstName(data.FirstName);
      // setLastName(data.LastName);
      setCurrentUser(response.data.profile);
      localStorage.setItem("user", JSON.stringify(response.data.profile));
      setUserName(data.UserName);
      setEmailAddress(data.EmailAddress);
      setBirthday(moment(data.BirthDay).format("YYYY-MM-DD"));
      setGender(data.Gender);
      setPhoneNumber(data.PhoneNumber);
      setProfilePic(data.ProfilePic);
      setStatus(data.Active);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  var UpdateUser = async () => {
    setIsLoading(true);
    if (emailFieldChange && EmailAddress !== CurrentUser.EmailAddress) {
      try {
        var form = new URLSearchParams();
        form.append("EmailAddress", EmailAddress);
        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/admin/check-email`,
          form
        );
        if (!response.data.status) {
          setIsLoading(false);
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
        setIsLoading(false);
        return toast.error("Something went wrong!", {
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
    if (phoneFieldChange && PhoneNumber !== CurrentUser.PhoneNumber) {
      try {
        var form = new URLSearchParams();
        form.append("PhoneNumber", PhoneNumber);
        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/admin/check-number`,
          form
        );
        if (!response.data.status) {
          setIsLoading(false);
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
        setIsLoading(false);
        return toast.error("Something went wrong!", {
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
    var data = {
      UserName,
      EmailAddress,
      Birthday: BirthDay,
      Gender,
      PhoneNumber,
      EmailVerified: emailFieldChange ? "N" : CurrentUser.EmailVerified,
      PhoneVerified: phoneFieldChange ? "N" : CurrentUser.PhoneVerified,
    };
    try {
      var form = new URLSearchParams();
      for (var key in data) {
        form.append(key, data[key]);
      }
      var response = await BanglaBazarApi.put(`${Endpoint}/api/user/update/${id}`, form);
      if (response.data.status) {
        toast.success("Record Updated", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getUserInfo();
        setEmailFieldChange(false);
        setPhoneFieldChange(false);
        setIsLoading(false);
        setTimeout(() => window.location.reload(), 1000);
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
      console.log(e);
    }
  };
  var handleImageUpload = async (e) => {
    setImageUpload(true);
    var file = e.target.files[0];
    if (file && file !== undefined && file != null) {
      try {
        var form = new FormData();
        form.append("myimg", file);
        form.append("UserID", id);
        var response = await BanglaBazarApi.put(`${Endpoint}/api/user/uploadForm`, form);
        if (response.data.status) {
          toast.success("Profile Image Uploaded!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          getUserInfo();
          setImageUpload(false);
          window.location.reload();
        } else {
          setImageUpload(false);
          toast.error(response.data.message || response.data.error, {
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
        setImageUpload(false);
        console.log(e);
        toast.error("Something went wrong!", {
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
  };
  return (
    <>
      <WebsiteHeader />
      <div className="mt-5">
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="row m-0">
              <div className="col-lg-10 col-md-12 col-sm-12 m-auto">
                <Card>
                  <CardBody>
                    <Row>
                      <Col
                        md={4}
                        lg={3}
                        style={{ marginLeft: "auto", marginRight: "auto" }}
                      >
                        <div className="mt-4 text-center">
                          {imageUpload ? (
                            <Loading text={"Loading.."} />
                          ) : (
                            <div className="profile-image-block">
                              <img
                                src={
                                  !ProfilePic || ProfilePic.length < 1
                                    ? "http://cdn.onlinewebfonts.com/svg/img_383212.png"
                                    : `${Endpoint}/${ProfilePic}`
                                }
                                className="img-fluid update-img"
                                alt="profile"
                              />
                              <input
                                className="d-none"
                                id="image-upload"
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={(e) => {
                                  handleImageUpload(e);
                                }}
                              />
                              <div className="profile-img-overlay">
                                <div
                                  className="text text-default"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    document
                                      .getElementById("image-upload")
                                      .click();
                                  }}
                                >
                                  <i className="fas fa-camera"></i> Upload
                                </div>
                              </div>
                            </div>
                          )}

                          <h4 className="ftw-400 mt-2 pb-0 mb-0">
                            {" "}
                            {UserName}
                          </h4>
                          <p>{EmailAddress}</p>
                          {status === "Y" ? (
                            <Button className="status-update-button" disabled>
                              Active
                            </Button>
                          ) : (
                            <Button
                              className="status-update-button text-danger"
                              disabled
                            >
                              Inactive
                            </Button>
                          )}
                        </div>
                      </Col>
                      <Col md={12} lg={9}>
                        <div className="mt-3 mb-5">
                          <h4 className="text-default ftw-400 ">
                            Personal Information
                          </h4>
                          <hr />
                          <div>
                            <Form>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label
                                      className="update-user-label"
                                      for="firstName"
                                    >
                                      Full Name
                                    </Label>
                                    <Input
                                      type="text"
                                      placeholder="Enter Full Name"
                                      defaultValue={UserName}
                                      onChange={(e) =>
                                        setUserName(e.target.value)
                                      }
                                      className="userupdate-control"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label
                                      className="update-user-label"
                                      for="emailAddress"
                                    >
                                      Email Address{" "}
                                      {CurrentUser.EmailVerified === "Y" && (
                                        <img
                                          src="https://img.icons8.com/color/16/000000/verified-account.png"
                                          alt="email-verified"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Email Verified"
                                        />
                                      )}
                                    </Label>
                                    <Input
                                      type="email"
                                      defaultValue={EmailAddress}
                                      onChange={(e) => {
                                        setEmailAddress(e.target.value);
                                        setEmailFieldChange(true);
                                      }}
                                      placeholder="user@gmail.com"
                                      className="userupdate-control"
                                    />
                                    {CurrentUser.EmailVerified !== "Y" && (
                                      <span>
                                        <small>
                                          {" "}
                                          Email not verfied!{" "}
                                          <Link
                                            to="#"
                                            className="td-none text-default"
                                            onClick={() =>
                                              setEmailVerify(!emailVerify)
                                            }
                                          >
                                            Verify Now
                                          </Link>
                                        </small>
                                      </span>
                                    )}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row className="mt-4">
                                <Col md={6}>
                                  <FormGroup>
                                    <Label
                                      className="update-user-label"
                                      for="dob"
                                    >
                                      Date of birth
                                    </Label>
                                    <Input
                                      type="date"
                                      onChange={(e) =>
                                        setBirthday(e.target.value)
                                      }
                                      defaultValue={BirthDay}
                                      className="userupdate-control"
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label
                                      className="update-user-label"
                                      for="email"
                                    >
                                      Phone{" "}
                                      {CurrentUser.PhoneVerified === "Y" && (
                                        <img
                                          src="https://img.icons8.com/color/16/000000/verified-account.png"
                                          alt="phone-verified"
                                          data-toggle="tooltip"
                                          data-placement="top"
                                          title="Phone Verified"
                                        />
                                      )}
                                    </Label>
                                    <PhoneInput
                                      value={PhoneNumber}
                                      defaultValue={PhoneNumber}
                                      inputClass="adduser-phone"
                                      isValid={(value, country) => {
                                        if (
                                          value.startsWith(country.countryCode)
                                        ) {
                                          setDisable(false);
                                          return true;
                                        } else {
                                          setDisable(true);
                                          return false;
                                        }
                                      }}
                                      country={"bd"}
                                      onlyCountries={CountryCode}
                                      onChange={(phone) => {
                                        setPhoneNumber("+" + phone);
                                        setPhoneNumberToBeVerified("+" + phone);
                                        setPhoneFieldChange(true);
                                      }}
                                    />
                                    {CheckEmpty(CurrentUser.PhoneNumber) && (
                                      <span>
                                        <small className="text-danger">
                                          {" "}
                                          Please update your phone number and
                                          verify!{" "}
                                        </small>
                                      </span>
                                    )}
                                    {!disable &&
                                      !CheckEmpty(CurrentUser.PhoneNumber) &&
                                      CurrentUser.PhoneVerified !== "Y" && (
                                        <span>
                                          <small>
                                            {" "}
                                            Your Phone Number is not verfied!{" "}
                                            <Link
                                              to="#"
                                              className="td-none text-default"
                                              onClick={() => {
                                                setPhoneVerify(!phoneVerify);
                                              }}
                                            >
                                              Verify Now
                                            </Link>
                                          </small>
                                        </span>
                                      )}
                                  </FormGroup>
                                </Col>
                              </Row>
                              <Row className="mt-4">
                                <Col md={6}>
                                  <FormGroup>
                                    <Label
                                      className="update-user-label"
                                      for="examplePassword"
                                    >
                                      Gender
                                    </Label>
                                    <Input
                                      type="select"
                                      className="userupdate-control"
                                      onChange={(e) =>
                                        setGender(e.target.value)
                                      }
                                    >
                                      <option>Select Gender</option>
                                      <option
                                        selected={Gender === "male"}
                                        value="male"
                                      >
                                        Male
                                      </option>
                                      <option
                                        selected={Gender === "female"}
                                        value="female"
                                      >
                                        Female
                                      </option>
                                      <option
                                        selected={Gender === "others"}
                                        value="others"
                                      >
                                        Others
                                      </option>
                                    </Input>
                                  </FormGroup>
                                </Col>
                              </Row>
                              {/* <Row className="mt-4">
                            <Col md={6}>
                              <FormGroup>
                                <Label
                                  className="update-user-label"
                                  for="exampleEmail"
                                >
                                  Status
                                </Label>
                                <Input
                                  type="select"
                                  className="userupdate-control"
                                >
                                  <option>Select Status</option>
                                  <option>Active</option>
                                  <option>Inactive</option>
                                </Input>
                              </FormGroup>
                            </Col>
                          </Row> */}
                            </Form>
                          </div>
                        </div>
                        {/* <div className="mt-5 mb-5">
                      <h4 className="text-default ftw-400 ">Password</h4>
                      <hr />
                      <div>
                        <Form>
                          <Row className="mt-4 mb-5">
                            <Col md={6}>
                              <FormGroup>
                                <Label
                                  className="update-user-label"
                                  for="exampleEmail"
                                >
                                  Password
                                </Label>
  
                                <Input
                                  type="password"
                                  className="userupdate-control"
                                  placeholder="************"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </div>
                    */}
                        <div className="mt-5">
                          <div style={{ float: "right" }} className="mt-5 mb-4">
                            <Button
                              className="btn-default"
                              onClick={() => UpdateUser()}
                              disabled={disable}
                            >
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default UserProfile;
