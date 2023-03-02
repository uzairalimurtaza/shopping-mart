import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import NoStore from "../../../../assets/images/no-store.svg";
import CsvDownload from "react-json-to-csv";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import UserTableAction from "./UserTableAction";
import Endpoint from "./../../../../Utils/Endpoint";
import Loading from "./../../../../Utils/Loading";
import CapitalizeFirstWord from "./../../../../Utils/CapitalizeFirstWord";
import moment from "moment";
import PhoneInput from "react-phone-input-2";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import { CountryCodes } from "../../../../Helpers/CountryCodes";
import firetoast from "./../../../../Helpers/FireToast";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
function UserManagement() {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [Birthday, setBirthday] = useState("");
  const [Gender, setGender] = useState("male");
  const [phone_number, setPhoneNumber] = useState("");
  const [Customer, setCustomer] = useState("Y");
  const [Active, setActive] = useState("N");
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [disable, setDisable] = useState(false);
  const [CountryCode, setCountryCode] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const format =
    /(^(?!.*__.*)[a-z0-9]{2,253}(_?)[a-z0-9]+(?:\.[a-z0-9!#$%&*+\/=?^`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?$)/gs;
  let getUsersAndInit = async () => {
    setIsLoading(true);
    try {
      var form = new URLSearchParams();
      form.append("offset", paginate.offset);
      form.append("limit", paginate.limit);
      var resp = await BanglaBazarApi.post(`${Endpoint}/api/admin/get`, form);

      try {
        setRecords(resp["data"].data);
        if (resp["data"].data.length > 0) {
          setTotalRecords(resp["data"].total_records);
        } else {
          setTotalRecords(0);
        }
      } catch (e) {
        console.log(e);
      }
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
    }
  };
  useEffect(async () => {
    getUsersAndInit();
    setCountryCode(await CountryCodes());
  }, []);

  var getUsers = async () => {
    try {
      var response = await BanglaBazarApi.get(`${Endpoint}/api/admin/get`);
      setRecords(response["data"].data);
    } catch (e) {
      console.log(e);
    }
  };
  var paginateData = (goTo) => {
    //console.log("called");
    var offset = Number(paginate["offset"] + 1);
    var numOfPages = Math.ceil(totalRecords / offset);

    if (goTo === "next") {
      if (offset + 1 < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getUsersAndInit();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getUsersAndInit();
      }
    }
  };
  var createuser = async () => {
    try {
      if (CheckEmpty(username)) {
        return toast.error("Please provide name!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (CheckEmpty(email)) {
        return toast.error("Please provide email!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (!email.match(format)) {
        return toast.error(`Invalid Email Format`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (CheckEmpty(Birthday)) {
        return toast.error("Please provide date of birth!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (CheckEmpty(Gender)) {
        return toast.error("Please provide gender!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (CheckEmpty(phone_number)) {
        return toast.error("Please provide phone number!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (CheckEmpty(Active)) {
        return toast.error("Please add status!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        setCustomer("Y");
        var data = {
          username,
          email,
          Birthday,
          Gender,
          phone_number,
          Customer,
          Active,
        };
        try {
          var form = new URLSearchParams();
          for (var key in data) {
            form.append(key, data[key]);
          }
          var response = await BanglaBazarApi.post(`${Endpoint}/api/admin/users`, form);
          if (response.data.status) {
            toast.success("User is created successfully", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
            getUsersAndInit();
            toggle();
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
        }
      }
    } catch (e) {
      console.log(e);
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
  var showRecords = (value) => {
    var temp = paginate;
    temp.limit = value;
    setPaginate(temp);
    getUsersAndInit();
  };
  var getUserByName = async (name) => {
    setIsLoading(true);
    try {
      var filter = {
        ...paginate,
      };
      filter.search = name;
      filter.sort = "DESC";
      var form = new URLSearchParams();
      for (var key in filter) {
        form.append(key, filter[key]);
      }
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/user/userDetails-nameFilter`,
        form
      );
      setRecords(response["data"].Users);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getUserByPhone = async (name) => {
    setIsLoading(true);
    try {
      var filter = {
        ...paginate,
      };
      filter.search = name;
      filter.sort = "DESC";
      var form = new URLSearchParams();
      for (var key in filter) {
        form.append(key, filter[key]);
      }
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/user/userDetails-phoneFilter`,
        form
      );
      setRecords(response["data"].Users);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getUserByEmail = async (name) => {
    setIsLoading(true);
    try {
      var filter = {
        ...paginate,
      };
      filter.search = name;
      filter.sort = "DESC";
      var form = new URLSearchParams();
      for (var key in filter) {
        form.append(key, filter[key]);
      }
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/user/userDetails-emailFilter`,
        form
      );
      setRecords(response["data"].Users);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">User Management</h3>
        <Button className="btn-default" onClick={toggle}>
          <i className="fas fa-user-plus"></i> Add User
        </Button>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="d-flex justify-content-between mt-4">
            <div>
              <h6>
                Total Users :{" "}
                <span className="text-default">{totalRecords}</span>
              </h6>
              {/* <label style={{ fontSize: "15px" }}>
            Show Records{" "}
            <select onChange={(e) => showRecords(e.target.value)}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label> */}
            </div>
            <div>
              <div
                className="btn-group btn-left-padding"
                role="group"
                aria-label="Basic example"
              >
                <button
                  className="btn btn-light btn-sm text-default"
                  type="button"
                  onClick={() => paginateData("previous")}
                >
                  <i className="fa fa-arrow-left"></i>
                </button>
                <button className="btn btn-light btn-sm" type="button">
                  {paginate.offset + 1}
                </button>
                <button
                  className="btn btn-light btn-sm text-default"
                  type="button"
                  data-bs-original-title=""
                  title=""
                  onClick={() => paginateData("next")}
                >
                  <i className="fa fa-arrow-right"></i>
                </button>
              </div>

              <Button
                className="text-secondary"
                style={{ backgroundColor: "white", border: "white" }}
              >
                <i className="fas fa-sort-amount-down-alt text-dark"></i> Filter
              </Button>
              <CsvDownload
                data={records}
                filename="users.csv"
                className="btn btn-default-outline"
              >
                Export <i className="fas fa-arrow-alt-to-bottom"></i>
              </CsvDownload>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center">
              <h6 className="ftw-400 text-default">Search</h6>
              <button
                className="btn btn-success"
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  document.getElementById("SearchEmail").value = "";
                  document.getElementById("SearchName").value = "";
                  document.getElementById("SearchPhone").value = "";
                  getUsersAndInit();
                }}
              >
                Clear{" "}
              </button>
            </div>

            <div className="row mt-3">
              <div className="col-4">
                <div className="form-group row">
                  {/* <label for="staticEmail" className="col-sm-4 col-form-label">
                    By Name :
                  </label> */}
                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="SearchName"
                        placeholder="Search by Name"
                      // onChange={async (e) => {
                      //   await getUserByName(e.target.value);
                      //   //   getStores();
                      // }}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById("SearchName").value;
                            document.getElementById("SearchPhone").value = "";
                            document.getElementById("SearchEmail").value = "";
                            await getUserByName(elmntVal);
                          }}
                        >
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group row">
                  {/* <label for="staticEmail" className="col-sm-4 col-form-label">
                    By Phone :
                  </label> */}

                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="SearchPhone"
                        placeholder="Search by Phone"
                      // onChange={async (e) => {
                      //   await getUserByPhone(e.target.value);
                      //   //   getStores();
                      // }}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById("SearchPhone").value;
                            document.getElementById("SearchName").value = "";
                            document.getElementById("SearchEmail").value = "";
                            await getUserByPhone(elmntVal);
                          }}
                        >
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="form-group row">
                  {/* <label for="staticEmail" className="col-sm-4 col-form-label">
                    By Email :
                  </label> */}

                  <div className="col-sm-12">
                    <div className="input-group mb-3">
                      <input
                        type="text"
                        className="form-control"
                        id="SearchEmail"
                        placeholder="Search by Email"
                      // onChange={async (e) => {
                      //   await getUserByEmail(e.target.value);
                      //   //   getStores();
                      // }}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById("SearchEmail").value;
                            document.getElementById("SearchName").value = "";
                            document.getElementById("SearchPhone").value = "";
                            await getUserByEmail(elmntVal);
                          }}
                        >
                          <i className="fas fa-search"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 table-responsive">
            {isLoading ? (
              <div>
                <Loading />
              </div>
            ) : records.length > 0 ? (
              <table className="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>User Name</th>
                    <th>Email Address</th>
                    <th>Date of birth</th>
                    <th>Gender</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 &&
                    records.map((record, index) => (
                      <tr key={index}>
                        <td className="pt-18">
                          {/* <img
                      className="avatar"
                      src={
                        record.ProfilePic
                          ? record.ProfilePic
                          : "https://www.vhv.rs/dpng/d/256-2569650_men-profile-icon-png-image-free-download-searchpng.png"
                      }
                      alt="avt"
                    /> */}
                          <span
                            style={{ marginLeft: "5px" }}
                            className="color-grey-table"
                          >
                            {" "}
                            {record.UserName}
                          </span>
                        </td>
                        <td className="pt-18">{record.EmailAddress}</td>
                        <td className="pt-18">
                          {!CheckEmpty(record.BirthDay)
                            ? moment(record.BirthDay).format("DD-MM-YYYY")
                            : ""}
                        </td>
                        <td className="pt-18">
                          {CapitalizeFirstWord(record.Gender)}
                        </td>
                        <td className="pt-18">{record.PhoneNumber}</td>
                        <td className="pt-18">{getRoles(record)}</td>
                        <td className="pt-18">
                          {!CheckEmpty(record.Active) ? (
                            <>
                              {" "}
                              {record.Active === "Y" && (
                                <>
                                  <span
                                    className="badge text-default bg-light"
                                    style={{ fontSize: "13px" }}
                                  >
                                    {" "}
                                    Active
                                  </span>
                                </>
                              )}
                              {record.Active === "N" && (
                                <span
                                  className="badge text-danger"
                                  style={{ fontSize: "13px" }}
                                >
                                  {" "}
                                  Inactive
                                </span>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                        <td className="text-center pt-18 text-center">
                          <UserTableAction
                            id={record.UserID}
                            getUsers={getUsersAndInit}
                            status={record.Active}
                            record={record}
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center no-store-container ">
                <div className="mt-3">
                  <img src={NoStore} className="img-fluid no-store-img " />
                  <h2 className="ftw-400 mt-3">No Store Data Found </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Modal isOpen={modal} toggle={toggle} size="lg" centered>
          <ModalHeader toggle={toggle}>Add User</ModalHeader>
          <ModalBody>
            <div className="mt-4 mb-4">
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="firstName">Full name</Label>
                      <Input
                        type="text"
                        placeholder="Enter Full Name"
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="emailAddress">Email Address</Label>
                      <Input
                        type="email"
                        placeholder="user@gmail.com"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="dob">Date of birth</Label>
                      <Input
                        type="date"
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="email">Phone</Label>
                      <PhoneInput
                        value={phone_number}
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
                        onlyCountries={CountryCode}
                        inputClass="adduser-phone"
                        onChange={(phone) => setPhoneNumber(phone)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Gender</Label>
                      <Input
                        type="select"
                        onChange={(e) => setGender(e.target.value)}
                      >
                        <option>Select Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                        <option>Others</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="exampleEmail">Status</Label>
                      <Input
                        type="select"
                        onChange={(e) => setActive(e.target.value)}
                      >
                        <option>Select Status</option>
                        <option value={"Y"}>Active</option>
                        <option value={"N"}>Inactive</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
              </Form>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-white" onClick={toggle}>
              Cancel
            </Button>{" "}
            <Button
              className="btn-default"
              onClick={createuser}
              disabled={disable}
            >
              Add User
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
export default UserManagement;
