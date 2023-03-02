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
  ModalHeader,
  ModalBody,
  ModalFooter,
  Modal,
} from "reactstrap";
import { useState, useEffect } from "react";
import Loading from "../../../../Utils/Loading";
import Endpoint from "./../../../../Utils/Endpoint";
import PhoneInput from "react-phone-input-2";
import { ToastContainer, toast } from "react-toastify";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import { CurrentUser } from "./../../../../Helpers/Auth";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import BanglaBazarApi from './../../../Api/BanglaBazarApi';
function UpdateUserInfo(props) {
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [user, setUser] = useState({});
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  const [UserName, setUserName] = useState("");
  const [EmailAddress, setEmailAddress] = useState("");
  const [BirthDay, setBirthday] = useState("");
  const [Gender, setGender] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [ProfilePic, setProfilePic] = useState(null);
  const [imageUpload, setImageUpload] = useState(false);
  const [status, setStatus] = useState(null);
  const [emailVerified, setEmailVerified] = useState("");
  const [phoneVerified, setPhoneVerified] = useState("");
  const [AdminNote, setAdminNote] = useState([]);
  const [createdAt, setCreatedAt] = useState(null);
  const [lastUpdate, setUpdatedOn] = useState(null);
  const [IPAddress, setIPAddress] = useState("");
  const [noteModal, setNoteModal] = useState(false);
  const [note, setNote] = useState("");
  const [modal2, setModal2] = useState(false);
  const [admin, setAdmin] = useState("");
  const [vendor, setVendor] = useState("");
  const [deliveryPerson, setDeliveryPerson] = useState("");
  const [customer, setCustomer] = useState("");
  const [countryCodes, setCountryCodes] = useState([]);
  const [disable, setDisable] = useState(false);
  useEffect(async () => {
    setImageUpload(true);
    var temp = await CountryCodes();
    setCountryCodes(temp);
    getUserInfo();
    getAdminNote();
    setImageUpload(false);
  }, []);
  var getAdminNote = async () => {
    try {
      var response = await BanglaBazarApi.get(`${Endpoint}/api/admin/show-notes/${id}`);
      setAdminNote(response.data.Note.reverse());
    } catch (e) {
      console.log(e);
    }
  };
  var getUserInfo = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/admin/get/${props.match.params.id}`
      );
      let data = response.data.profile;
      // setFirstName(data.FirstName);
      // setLastName(data.LastName);
      setUserName(data.UserName);
      setEmailAddress(data.EmailAddress);
      setBirthday(moment(data.BirthDay).format("YYYY-MM-DD"));
      setGender(data.Gender);
      setPhoneNumber(data.PhoneNumber);
      setProfilePic(data.ProfilePic);
      setPhoneVerified(data.PhoneVerified);
      setEmailVerified(data.EmailVerified);
      setStatus(data.Active);
      setUser(data);
      setUpdatedOn(data.LastUpdate);
      setCreatedAt(data.CreatedDate);
      setIPAddress(data.IPAddress);
      setAdmin(data.Admin);
      setVendor(data.Vendor);
      setDeliveryPerson(data.DeliveryPerson);
      setCustomer(data.Customer);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  var UpdateUser = async () => {
    setIsLoading(true);
    var data = {
      UserName,
      EmailAddress,
      Birthday: BirthDay,
      Gender,
      PhoneNumber,

      LastUpdate: moment().format("YYYY-MM-DD"),
    };
    try {
      var form = new URLSearchParams();
      for (var key in data) {
        form.append(key, data[key]);
      }
      var response = await BanglaBazarApi.put(
        `${Endpoint}/api/admin/update/${id}`,
        form
      );
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
        setIsLoading(false);
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
          window.location.href = `/panel/userEdit/${id}`;
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
  var createNote = async () => {
    if (CheckEmpty(note)) {
      return toast.error("Note is empty!", {
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
      form.append("Note", note);
      form.append("CreaterID", CurrentUser.UserID);
      form.append("UserID", id);

      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/admin/create-notes`,
        form
      );
      if (response.data.status) {
        toast.success("Note Added", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getAdminNote();
        setNoteModal(false);
      }
    } catch (e) {
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
  };
  var getRoles = (record) => {
    var array = [];

    if (record.Admin === "Y") {
      array.push("Admin");
    }
    if (record.Customer === "Y") {
      array.push("Customer");
    }
    if (record.Vendor === "Y") {
      array.push("Vendor");
    }
    if (record.DeliveryPerson === "Y") {
      array.push("Delivery Person");
    }
    if (record.SuperAdmin === "Y") {
      array.push("Super Admin");
    }

    return array.toString();
  };
  var markStatus = async (status) => {
    try {
      var form = new URLSearchParams();
      form.append("UserID", id);
      form.append("Active", status);
      var response = await BanglaBazarApi.put(Endpoint + "/api/admin/status", form);
      if (response.data.status) {
        toast.success("Status Changed Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getUserInfo();
      } else {
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
      console.log(e);
    }
  };
  var updateRoles = async () => {
    try {
      var form = new URLSearchParams();
      form.append("UserID", id);
      form.append(
        "Customer",
        customer == null || customer === "" ? "N" : customer
      );
      form.append(
        "DeliveryPerson",
        deliveryPerson == null || deliveryPerson === "" ? "N" : deliveryPerson
      );
      form.append("Vendor", vendor == null || vendor === "" ? "N" : vendor);
      form.append("Admin", admin == null || admin === "" ? "N" : admin);
      var response = await BanglaBazarApi.put(`${Endpoint}/api/admin/setRoles`, form);
      if (response.data.status) {
        toast.success("Roles Updated Successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        getUserInfo();
        setTimeout(() => {
          setModal2(!modal2);
        }, 1500);
      } else {
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
  };
  return (
    <div className="mt-5">
      {countryCodes.length < 1 || isLoading ? (
        <Loading />
      ) : (
        <>
          <h4 className="mb-4">
            <span
              onClick={() => props.history.goBack()}
              style={{ cursor: "pointer" }}
            >
              <i className="fas fa-chevron-left"></i>
            </span>{" "}
            {UserName}
          </h4>
          <Card>
            <CardBody>
              <Row>
                <Col md={3}>
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
                              document.getElementById("image-upload").click();
                            }}
                          >
                            <i className="fas fa-camera"></i> Upload
                          </div>
                        </div>
                      </div>
                    )}

                    <h4 className="ftw-400 mt-2 pb-0 mb-0"> {UserName}</h4>
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
                <Col md={9}>
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
                                onChange={(e) => setUserName(e.target.value)}
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
                              </Label>
                              <Input
                                type="email"
                                defaultValue={EmailAddress}
                                onChange={(e) =>
                                  setEmailAddress(e.target.value)
                                }
                                placeholder="user@gmail.com"
                                className="userupdate-control"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col md={6}>
                            <FormGroup>
                              <Label className="update-user-label" for="dob">
                                Date of birth
                              </Label>
                              <Input
                                type="date"
                                onChange={(e) => setBirthday(e.target.value)}
                                defaultValue={BirthDay}
                                className="userupdate-control"
                              />
                            </FormGroup>
                          </Col>
                          <Col md={6}>
                            <FormGroup>
                              <Label className="update-user-label" for="email">
                                Phone{" "}
                              </Label>
                              <PhoneInput
                                value={PhoneNumber}
                                onlyCountries={countryCodes}
                                isValid={(value, country) => {
                                  if (value.startsWith(country.countryCode)) {
                                    setDisable(false);
                                    return true;
                                  } else {
                                    setDisable(true);
                                    return false;
                                  }
                                }}
                                country={"bd"}
                                defaultValue={PhoneNumber}
                                inputClass="adduser-phone"
                                onChange={(phone) =>
                                  setPhoneNumber("+" + phone)
                                }
                              />
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
                                onChange={(e) => setGender(e.target.value)}
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
          <Card className="mt-5">
            <CardBody>
              <Row>
                <Col md={4}>
                  <div className="mt-3" style={{ marginBottom: "2.1rem" }}>
                    <h4 className="text-dark ftw-400 mb-0 pb-0">Actions</h4>
                  </div>
                </Col>
                <Col md={8} className="m-auto">
                  <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div>
                        <label>Status</label>
                        <div style={{ fontSize: "13px" }}>
                          The current status of this user is{" "}
                          {status === "Y" ? (
                            <span className="text-default">
                              <strong>Active</strong>
                            </span>
                          ) : (
                            <span className="text-danger">
                              <strong>Inactive</strong>
                            </span>
                          )}
                        </div>
                        <div>
                          {status === "Y" ? (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => markStatus("N")}
                            >
                              Mark Inactive
                            </button>
                          ) : (
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => markStatus("Y")}
                            >
                              Mark Active
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <div>
                        <label>
                          Current Role{" "}
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => setModal2(!modal2)}
                          >
                            <i className="far fa-edit"></i>
                          </span>
                        </label>
                        <div style={{ fontSize: "13px" }}>
                          <strong>{getRoles(user)}</strong>{" "}
                        </div>
                        {vendor === "Y" ? (
                          <Link
                            to={`/panel/viewBusiness/${id}`}
                            className="text-default"
                          >
                            View Store{" "}
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Card className="mt-5">
            <CardBody>
              <Row>
                <Col md={4}>
                  <div className="mt-3" style={{ marginBottom: "2.1rem" }}>
                    <h4 className="text-dark ftw-400 mb-0 pb-0">
                      General Info
                    </h4>
                  </div>
                  <div>
                    <ul className="list-group">
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Email Verified
                        <span>
                          {emailVerified === "Y" ? (
                            <i className="fas fa-check text-default"></i>
                          ) : (
                            <i className="fas fa-times text-danger"></i>
                          )}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Phone Verified
                        <span>
                          {" "}
                          {phoneVerified === "Y" ? (
                            <i className="fas fa-check text-default"></i>
                          ) : (
                            <i className="fas fa-times text-danger"></i>
                          )}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        I.P
                        <span
                          className="text-default"
                          style={{ fontSize: "13px" }}
                        >
                          {IPAddress}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Joined On
                        <span
                          className="text-default"
                          style={{ fontSize: "13px" }}
                        >
                          {createdAt === null
                            ? ""
                            : moment(createdAt).format("DD-MM-YYYY")}
                        </span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between align-items-center">
                        Last Updated
                        <span
                          className="text-default"
                          style={{ fontSize: "13px" }}
                        >
                          {lastUpdate === null
                            ? ""
                            : moment().format("DD-MM-YYYY")}
                        </span>
                      </li>
                    </ul>
                  </div>
                </Col>
                <Col md={8} className="m-auto">
                  <div className="mt-3 mb-5">
                    <div
                      className="d-flex justify-content-between"
                      style={{ alignItems: "center" }}
                    >
                      <h4 className="text-default ftw-400 ">Admin Note</h4>
                      <button
                        className="btn btn-default btn-sm"
                        onClick={() => setNoteModal(!noteModal)}
                      >
                        {" "}
                        Add Note
                      </button>
                    </div>
                    <hr />
                    <div
                      style={{
                        maxHeight: "25vh",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      {AdminNote.map((item, index) => (
                        <div key={index} className="admin-note-item">
                          <div>{item.Note}</div>
                          <div
                            className="d-flex justify-content-between"
                            style={{ alignItems: "center" }}
                          >
                            <div>
                              <small
                                className="text-secondary"
                                style={{ fontSize: "10px" }}
                              >
                                Added on{" "}
                                {moment(item.CreatedDate).format("DD-MM-YYYY")}
                              </small>
                            </div>
                            <div
                              className="text-default"
                              style={{ fontSize: "12px" }}
                            >
                              <small> By {item.CreaterName}</small>
                            </div>
                          </div>
                        </div>
                      ))}
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
                </Col>
              </Row>
            </CardBody>
          </Card>
          <Modal isOpen={noteModal} toggle={() => setNoteModal(!noteModal)}>
            <ModalHeader toggle={() => setNoteModal(!noteModal)}>
              Note
            </ModalHeader>
            <ModalBody>
              <textarea
                className="form-control"
                onChange={(e) => setNote(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-default" onClick={() => createNote()}>
                Save
              </button>
            </ModalFooter>
          </Modal>
          <Modal
            isOpen={modal2}
            toggle={() => setModal2(!modal2)}
            size="md"
            centered
          >
            <ModalHeader toggle={() => setModal2(!modal2)}>
              Manage Role
            </ModalHeader>
            <ModalBody>
              <div className="text-dark">
                <div className="text-center h6 ftw-400">Available Roles</div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      id="checkbox2"
                      defaultChecked={admin === "Y"}
                      onChange={() => setAdmin(admin === "Y" ? "N" : "Y")}
                    />{" "}
                    Admin
                  </label>
                </div>
                <div>
                  <label>
                    <input type="checkbox" id="checkbox2" checked /> Customer
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      id="checkbox2"
                      defaultChecked={deliveryPerson === "Y"}
                      onChange={() =>
                        setDeliveryPerson(deliveryPerson === "Y" ? "N" : "Y")
                      }
                    />{" "}
                    Delivery Person
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      type="checkbox"
                      id="checkbox2"
                      defaultChecked={vendor === "Y"}
                      onChange={() => setVendor(vendor === "Y" ? "N" : "Y")}
                    />{" "}
                    Vendor
                  </label>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button className="btn-white" onClick={() => setModal2(!modal2)}>
                Cancel
              </Button>{" "}
              <Button className="btn-default" onClick={() => updateRoles()}>
                Update Role
              </Button>
            </ModalFooter>
          </Modal>
        </>
      )}
    </div>
  );
}
export default UpdateUserInfo;
