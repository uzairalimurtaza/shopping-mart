import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import NoStore from "../../../../../assets/images/no-store.svg";
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
import Endpoint from "../../../../../Utils/Endpoint";
import Loading from "../../../../../Utils/Loading";
import CapitalizeFirstWord from "../../../../../Utils/CapitalizeFirstWord";
import moment from "moment";
import CheckEmpty from "../../../../../Utils/CheckEmpty";
import firetoast from "../../../../../Helpers/FireToast";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import { RequiredField } from "../../../../../Utils/Required-field";
export function CourierServices() {
  const [modal, setModal] = useState(false);
  const [modal2, setModal2] = useState(false);
  const [modal3, setModal3] = useState(false);
  const toggle = () => setModal(!modal);
  const toggle2 = () => setModal2(!modal2);
  const toggle3 = () => setModal3(!modal3);


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
  const [serviceData, SetServiceData] = useState({
    CourierName: "",
    Account: "",
    ClientID: "",
    ClientSecret: "",
    EndPoint: "",
    DeliveryTrackURL: "",
    BusinessEmail: "",
    BusinessPhone: "",
    BusinessURL: "",
    APIAvailable: "Y",
    Active: "Y",
    AdminNote: "",
  });
  const [editServiceData, SetEditServiceData] = useState({

  });
  const [deleteData,setDeleteData] = useState(null)
  const format =
    /(^(?!.*__.*)[a-z0-9]{2,253}(_?)[a-z0-9]+(?:\.[a-z0-9!#$%&*+\/=?^`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9]*[a-z0-9])?$)/gs;
  let getServicesAndInit = async () => {
    setIsLoading(true);
    try {
      var resp = await BanglaBazarApi.get(
        `${Endpoint}/api/courier/get-courier`
      );

      try {
        setRecords(resp["data"].getCourierService);
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
    getServicesAndInit();
  }, []);
var removeRecord = async()=>{
    try{
        var response = await BanglaBazarApi.post(`${Endpoint}/api/courier/delete-courier`,{
            "CourierID":deleteData.CourierID
        })
        if(response.data.status){
            firetoast("Record Removed!","success",2000,"top-center")
            getServicesAndInit()
        }
        else{
            firetoast(response.data.message||response.data.error,"default-error")
        }
    }
    catch(e){
        console.log(e)
    }
}
  var createService = async () => {
    var data = { ...serviceData };
    try {
      if (CheckEmpty(data["CourierName"])) {
        return toast.error("Please courier service name!", {
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
        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/courier/add-courier`,
          data
        );
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
          getServicesAndInit();
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
    } catch (e) {
      console.log(e);
    }
  };
  var updateService = async () => {
    var data = { ...editServiceData };
    try {
      if (CheckEmpty(data["CourierName"])) {
        return toast.error("Please courier service name!", {
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
        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/courier/update-courier`,
          data
        );
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
          getServicesAndInit();
          toggle3();
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
    } catch (e) {
      console.log(e);
    }
  };

  var handleChange = ({ currentTarget: input }) => {
    var temp = { ...serviceData };
    temp[input.name] = input.value;
    SetServiceData(temp);
  };
  var handleCheckboxes = (e) => {
    var temp = { ...serviceData };
    temp[e.target.name] = e.target.checked ? "Y" : "N";
    SetServiceData(temp);
  };
  var handleEditChange = ({ currentTarget: input }) => {
    var temp = { ...editServiceData };
    temp[input.name] = input.value;
    SetEditServiceData(temp);
  };
  var handleEditCheckboxes = (e) => {
    var temp = { ...editServiceData };
    temp[e.target.name] = e.target.checked ? "Y" : "N";
    SetEditServiceData(temp);
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Courier Services</h3>
        <Button className="btn-default" onClick={toggle}>
          <i className="fas fa-user-plus"></i> Add Service
        </Button>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="d-flex justify-content-between mt-4">
            <div>
              <h6>
                Total Services :{" "}
                <span className="text-default">{totalRecords}</span>
              </h6>
            </div>
            <div>
              <Button
                className="text-secondary"
                style={{ backgroundColor: "white", border: "white" }}
              >
                <i className="fas fa-sort-amount-down-alt text-dark"></i> Filter
              </Button>
              <CsvDownload
                data={records}
                filename="services.csv"
                className="btn btn-default-outline"
              >
                Export <i className="fas fa-arrow-alt-to-bottom"></i>
              </CsvDownload>
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
                    <th style={{ width: "15%" }}>Courier Name</th>
                    <th>Account</th>
                    <th>Client ID</th>
                    <th>Client Secret</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Api Available</th>
                    <th>Active</th>
                    <th>Admin Note</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {records.length > 0 &&
                    records.map((record, index) => (
                      <tr key={index}>
                        <td className="pt-18">{record.CourierName}</td>
                        <td className="pt-18">{record.Account}</td>
                        <td className="pt-18">{record.ClientID}</td>
                        <td className="pt-18">{record.ClientSecret}</td>
                        <td className="pt-18">{record.BusinessEmail}</td>
                        <td className="pt-18">{record.BusinessPhone}</td>
                        <td className="pt-18">
                          {!CheckEmpty(record.APIAvailable) ? (
                            <>
                              {" "}
                              {record.APIAvailable === "Y" && (
                                <>
                                  <span
                                    className="badge text-default bg-light"
                                    style={{ fontSize: "13px" }}
                                  >
                                    {" "}
                                    Yes
                                  </span>
                                </>
                              )}
                              {record.APIAvailable === "N" && (
                                <span
                                  className="badge text-danger"
                                  style={{ fontSize: "13px" }}
                                >
                                  {" "}
                                  No
                                </span>
                              )}
                            </>
                          ) : (
                            ""
                          )}
                        </td>
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
                          {record.AdminNote}
                        </td>
                        <td>
                          <div
                            class="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            <button type="button" class="btn btn-success" onClick={()=>{SetEditServiceData(record)
                                toggle3()}}>
                            <i class="fas fa-eye"></i>
                            </button>
                            <button type="button" class="btn btn-danger" onClick={()=>{setDeleteData(record)
                            toggle2()}}>
                            <i class="fas fa-trash" ></i>
                            </button>
                          </div>
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
          <ModalHeader toggle={toggle}>New Services</ModalHeader>
          <ModalBody>
            <div className="mt-4 mb-4">
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="serviceName">
                        Courier name <RequiredField />
                      </Label>
                      <Input
                        type="text"
                        placeholder="Courier Name"
                        name="CourierName"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="courierAccount">Account</Label>
                      <Input
                        type="text"
                        name="Account"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="clientId">Client ID</Label>
                      <Input
                        type="text"
                        name="ClientID"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="clientSecret">Client Secret</Label>
                      <Input
                        type="text"
                        name="ClientSecret"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Endpoint</Label>
                      <Input
                        type="text"
                        name="EndPoint"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="exampleEmail">Delivery Track Url</Label>
                      <Input
                        type="text"
                        name="DeliveryTrackURL"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Business Email</Label>
                      <Input
                        type="text"
                        name="BusinessEmail"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="exampleEmail">Business Phone</Label>
                      <Input
                        type="text"
                        name="BusinessPhone"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Business URL</Label>
                      <Input
                        type="text"
                        name="BusinessURL"
                        onChange={(e) => handleChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input default-check-color"
                        type="checkbox"
                        name="APIAvailable"
                        onChange={(e) => handleCheckboxes(e)}
                        defaultChecked={serviceData["APIAvailable"] === "Y"}
                      />
                      <label className="form-check-label" for="inlineCheckbox3">
                        Api Available
                      </label>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input default-check-color"
                        type="checkbox"
                        name="Active"
                        onChange={(e) => handleCheckboxes(e)}
                        defaultChecked={serviceData["Active"] === "Y"}
                      />
                      <label className="form-check-label" for="inlineCheckbox3">
                        Active
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={8}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Admin Note</Label>
                      <textarea
                        rows={5}
                        className="form-control"
                        name="AdminNote"
                        onChange={(e) => handleChange(e)}
                      />
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
            <Button className="btn-default" onClick={createService}>
              Add Service
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={modal2} toggle={toggle2} centered>
          <ModalHeader toggle={toggle2}>Remove Service</ModalHeader>
          <ModalBody>
        <h5>Are you sure to remove this courier service?</h5>
          </ModalBody>
          <ModalFooter>
            <Button className="btn-white" onClick={toggle2}>
              Cancel
            </Button>{" "}
            <Button className="btn-default" onClick={removeRecord}>
             Yes
            </Button>
          </ModalFooter>
        </Modal>
        <Modal isOpen={modal3} toggle={toggle3} size="lg" centered>
          <ModalHeader toggle={toggle3}>New Services</ModalHeader>
          <ModalBody>
            <div className="mt-4 mb-4">
              <Form>
                <Row>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="serviceName">
                        Courier name <RequiredField />
                      </Label>
                      <Input
                        type="text"
                        placeholder="Courier Name"
                        defaultValue={editServiceData["CourierName"]}
                        name="CourierName"
                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="courierAccount">Account</Label>
                      <Input
                        type="text"
                        name="Account"
                        defaultValue={editServiceData["Account"]}
                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="clientId">Client ID</Label>
                      <Input
                        type="text"
                        name="ClientID"
                        defaultValue={editServiceData["ClientID"]}

                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="clientSecret">Client Secret</Label>
                      <Input
                        type="text"
                        name="ClientSecret"
                        defaultValue={editServiceData["ClientSecret"]}

                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Endpoint</Label>
                      <Input
                        type="text"
                        name="EndPoint"
                        defaultValue={editServiceData["EndPoint"]}

                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="exampleEmail">Delivery Track Url</Label>
                      <Input
                        type="text"
                        defaultValue={editServiceData["DeliveryTrackURL"]}

                        name="DeliveryTrackURL"
                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Business Email</Label>
                      <Input
                        type="text"
                        defaultValue={editServiceData["BusinessEmail"]}

                        name="BusinessEmail"
                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="exampleEmail">Business Phone</Label>
                      <Input
                        type="text"
                        name="BusinessPhone"
                        defaultValue={editServiceData["BusinessPhone"]}

                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Business URL</Label>
                      <Input
                        type="text"
                        name="BusinessURL"
                        defaultValue={editServiceData["BusinessURL"]}

                        onChange={(e) => handleEditChange(e)}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={6}>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input default-check-color"
                        type="checkbox"
                        name="APIAvailable"
                        onChange={(e) => handleEditCheckboxes(e)}
                        defaultChecked={editServiceData["APIAvailable"] === "Y"}
                      />
                      <label className="form-check-label" for="inlineCheckbox3">
                        Api Available
                      </label>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input default-check-color"
                        type="checkbox"
                        name="Active"
                        onChange={(e) => handleEditCheckboxes(e)}
                        defaultChecked={editServiceData["Active"] === "Y"}
                      />
                      <label className="form-check-label" for="inlineCheckbox3">
                        Active
                      </label>
                    </div>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col md={8}>
                    <FormGroup className="modal-formgroup">
                      <Label for="examplePassword">Admin Note</Label>
                      <textarea
                        rows={5}
                        className="form-control"
                        defaultValue={editServiceData["AdminNote"]}

                        name="AdminNote"
                        onChange={(e) => handleEditChange(e)}
                      />
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
            <Button className="btn-default" onClick={updateService}>
              Update
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}
