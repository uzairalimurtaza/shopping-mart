import { useState, useEffect } from "react";
import Loading from "./../../../../../Utils/Loading";
import NoStore from "../../../../../assets/images/no-store.svg";
import { Button } from "reactstrap";
import { useParams } from "react-router-dom";
import firetoast from "./../../../../../Helpers/FireToast";
import BanglaBazarApi from "../../../../Api/BanglaBazarApi";
import { RequiredField } from "./../../../../../Utils/Required-field";
import Endpoint from "./../../../../../Utils/Endpoint";
import CheckEmpty from "./../../../../../Utils/CheckEmpty";
import Icons from "./../../../../../Utils/Icons";
import { useHistory } from "react-router";
import PhoneInput from "react-phone-input-2";
import CsvDownload from "react-json-to-csv";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { CountryCodes } from "../../../../../Helpers/CountryCodes";
function PaymentGateway() {
  const history = useHistory();

  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [IdToDelete, setIdToDelete] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [addModal, setAddModal2] = useState(false);
  const [gateways, setGateways] = useState([]);
  const [CountryCode, setCountryCode] = useState([]);
  const [mode, setMode] = useState("");
  const [IdToEdit, setIdToEdit] = useState("");
  const [GatewayName, setGatewayName] = useState("");
  const [Account, setAccount] = useState("");
  const [BusinessEmail, setBusinessEmail] = useState("");
  const [BusinessPhone, setBusinessPhone] = useState("");
  const [BusinessURL, setBusinessURL] = useState("");
  const [ClientID, setClientID] = useState("");
  const [ClientSecret, setClientSecret] = useState("");
  const [EndPoint, setEndpoint] = useState("");
  const [Rate, setRate] = useState("");
  const [PerTransaction, setPerTransaction] = useState("");
  const [CurrencyCode, setCurrencyCode] = useState("");
  const [Active, setActive] = useState("Y");
  const [AdminNote, setAdminNote] = useState("");

  useEffect(async () => {
    getGateways();
    setCountryCode(await CountryCodes());
  }, []);
  var paginateData = (goTo) => {
    //console.log("called");
    var offset = paginate.offset + 1;
    var numOfPages = Math.ceil(totalRecords / offset);
    console.log(offset, numOfPages);
    if (goTo === "next") {
      if (offset < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        setPaginate(paginate);
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        setPaginate(paginate);
      }
    }
  };
  let getGateways = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/payment/get-paymentGateway`
      );
      if (response.data.status) {
        setGateways(response.data.PaymentGateway);
      } else {
        firetoast("Error while getting gateways", "error", 3000, "top-right");
      }
    } catch (e) {
      firetoast("Error while getting gateways", "error", 3000, "top-right");
    }
  };
  let resetState = () => {
    setAddModal2(false);
    setGatewayName("");
    setAccount("");
    setBusinessEmail("");
    setBusinessPhone("");
    setBusinessURL("");
    setClientID("");
    setClientSecret("");
    setEndpoint("");
    setRate("");
    setPerTransaction("");
    setCurrencyCode("");
    setActive("Y");
    setAdminNote("");
  };
  let dataToEdit = (item) => {
    setMode("edit");
    setIdToEdit(item.GatewayID);
    setGatewayName(item.GatewayName);
    setAccount(item.Account);
    setBusinessEmail(item.BusinessEmail);
    setBusinessPhone(item.BusinessPhone);
    setBusinessURL(item.BusinessURL);
    setClientID(item.ClientID);
    setClientSecret(item.ClientSecret);
    setEndpoint(item.EndPoint);
    setRate(item.Rate);
    setPerTransaction(item.PerTransaction);
    setCurrencyCode(item.CurrencyCode);
    setActive(item.Active);
    setAdminNote(item.AdminNote);
    setAddModal2(true);
  };
  let setAddModal = () => {
    if (addModal) {
      resetState();
      setAddModal2(!addModal);
    } else {
      setAddModal2(!addModal);
    }
  };
  let AddGateway = async () => {
    try {
      if (CheckEmpty(GatewayName)) {
        firetoast("Gateway Name is required", "error", 3000, "top-right");
      } else {
        var data = {
          GatewayName,
          Account,
          BusinessEmail,
          BusinessPhone,
          BusinessURL,
          ClientID,
          ClientSecret,
          EndPoint,
          Rate,
          PerTransaction,
          CurrencyCode,
          Active,
          AdminNote,
        };
        var form = new URLSearchParams();
        for (let key in data) {
          form.append(key, data[key]);
        }

        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/payment/add-paymentGateway`,
          form
        );
        if (response.data.status) {
          firetoast("Gateway added successfully", "success", 3000, "top-right");
          setTimeout(() => {
            getGateways();
            resetState();
          }, 3000);
        }
      }
    } catch (e) {
      firetoast(
        "Something went wrong while adding gateway",
        "error",
        3000,
        "top-right"
      );
    }
  };
  let UpdateGateway = async () => {
    try {
      if (CheckEmpty(GatewayName)) {
        firetoast("Gateway Name is required", "error", 3000, "top-right");
      } else {
        var data = {
          GatewayName,
          Account,
          BusinessEmail,
          BusinessPhone,
          BusinessURL,
          ClientID,
          ClientSecret,
          EndPoint,
          Rate,
          PerTransaction,
          CurrencyCode,
          Active,
          AdminNote,
        };
        var form = new URLSearchParams();
        for (let key in data) {
          form.append(key, data[key]);
        }

        var response = await BanglaBazarApi.put(
          `${Endpoint}/api/payment/update-paymentGateway/${IdToEdit}`,
          form
        );
        if (response.data.status) {
          firetoast(
            "Gateway updated successfully",
            "success",
            3000,
            "top-right"
          );
          setTimeout(() => {
            getGateways();
            resetState();
          }, 3000);
        }
      }
    } catch (e) {
      firetoast(
        "Something went wrong while updating gateway",
        "error",
        3000,
        "top-right"
      );
    }
  };
  let removeGateway = async () => {
    try {
      var response = await BanglaBazarApi.delete(
        `${Endpoint}/api/payment/delete-paymentGateway/${IdToDelete}`
      );
      if (response.data.status) {
        firetoast("Gateway removed!", "success", 3000, "top-right");
        setTimeout(() => {
          getGateways();
          setDeleteModal(!deleteModal);
        }, 3000);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "error", 3000, "top-right");
      }
    } catch (e) {
      firetoast(
        "Something went wrong while removing gateway",
        "error",
        3000,
        "top-right"
      );
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h4 className="mb-4">
          <span
            onClick={() => history.push("/panel/other-settings")}
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-chevron-left"></i>
          </span>{" "}
          Payment Gateways
        </h4>
        <button
          className="btn btn-success"
          onClick={() => {
            setMode("add");
            setAddModal(!addModal);
          }}
        >
          <i className="fas fa-globe-asia"></i> Add gateway
        </button>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <>
            <div className="d-flex justify-content-between mt-4">
              <div>
                <h6>
                  Total Gateways :{" "}
                  <span className="text-default">{gateways.length}</span>
                </h6>
              </div>
              <div>
                {/* <div
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
                </div> */}

                <Button
                  className="text-secondary"
                  style={{ backgroundColor: "white", border: "white" }}
                >
                  <i className="fas fa-sort-amount-down-alt text-dark"></i>{" "}
                  Filter
                </Button>
                <CsvDownload
                  data={gateways}
                  filename="gateways.csv"
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
              ) : gateways.length > 0 ? (
                <table className="table table-borderless" id="myTable">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Gateway Name</th>
                      <th>Business Email</th>
                      <th>Business Phone</th>
                      <th>Business URL</th>
                      <th>Account</th>
                      <th>Currency Code</th>
                      <th>Endpoint</th>
                      <th>Per Transaction</th>
                      <th>Rate</th>
                      <th>Active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {gateways.map((item, index) => (
                      <tr key={index}>
                        <td>{item.GatewayName}</td>
                        <td>{item.BusinessEmail}</td>
                        <td>{item.BusinessPhone}</td>
                        <td>{item.BusinessURL}</td>
                        <td>{item.Account}</td>
                        <td>{item.CurrencyCode}</td>
                        <td>{item.EndPoint}</td>
                        <td>{item.PerTransaction}</td>
                        <td>{item.Rate}</td>
                        <td>
                          {item.Active === "Y"
                            ? Icons.GreenTick
                            : Icons.RedCross}
                        </td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn btn-light text-default">
                              Action
                            </DropdownToggle>
                            <DropdownMenu>
                              <DropdownItem
                                onClick={() => {
                                  setMode("edit");
                                  dataToEdit(item);
                                }}
                              >
                                Edit{" "}
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setIdToDelete(item.GatewayID);
                                  setDeleteModal(!deleteModal);
                                }}
                              >
                                Remove{" "}
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center no-store-container ">
                  <div className="mt-3">
                    <img src={NoStore} className="img-fluid no-store-img " />
                    <h2 className="ftw-400 mt-3">No State Data Found </h2>
                  </div>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
      {/*Add Modal*/}
      <Modal
        isOpen={addModal}
        toggle={() => setAddModal(!addModal)}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={() => setAddModal(!addModal)}>
          <h4 className="ftw-400">Payment Gateways</h4>
        </ModalHeader>
        <ModalBody>
          <div className="m-3">
            <div className="row mt-3 ">
              <div className="col-6">
                <label>
                  Gateway Name <RequiredField />
                </label>
                <input
                  className="form-control"
                  defaultValue={GatewayName}
                  onChange={(e) => setGatewayName(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label>Account</label>
                <input
                  className="form-control"
                  defaultValue={Account}
                  onChange={(e) => setAccount(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <label>Business Email</label>
                <input
                  className="form-control"
                  defaultValue={BusinessEmail}
                  onChange={(e) => setBusinessEmail(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label>Business Phone</label>
                <PhoneInput
                  value={BusinessPhone}
                  defaultValue={BusinessPhone}
                  inputClass="adduser-phone"
                  isValid={(value, country) => {
                    if (value.startsWith(country.countryCode)) {
                      //   setDisable(false);
                      return true;
                    } else {
                      //   setDisable(true);
                      return false;
                    }
                  }}
                  country={"bd"}
                  onlyCountries={CountryCode}
                  onChange={(phone) => {
                    setBusinessPhone("+" + phone);
                  }}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <label>Business URL</label>
                <input
                  className="form-control"
                  defaultValue={BusinessURL}
                  onChange={(e) => setBusinessURL(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-6">
                <label>Client ID</label>
                <input
                  className="form-control"
                  defaultValue={ClientID}
                  onChange={(e) => setClientID(e.target.value)}
                />
              </div>
              <div className="col-6">
                <label>Client Secret</label>
                <input
                  className="form-control"
                  defaultValue={ClientSecret}
                  onChange={(e) => setClientSecret(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-8">
                <label>Endpoint</label>
                <input
                  className="form-control"
                  defaultValue={EndPoint}
                  onChange={(e) => setEndpoint(e.target.value)}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-3">
                <label>Rate</label>
                <input
                  className="form-control"
                  defaultValue={Rate}
                  onChange={(e) => setRate(e.target.value)}
                />
              </div>
              <div className="col-3">
                <label>Per Transaction</label>
                <input
                  className="form-control"
                  defaultValue={PerTransaction}
                  onChange={(e) => setPerTransaction(e.target.value)}
                />
              </div>
              <div className="col-3">
                <label>Currency Code</label>
                <input
                  className="form-control"
                  defaultValue={CurrencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                />
              </div>
              <div className="col-3">
                <label>Active</label>
                <div>
                  <input
                    className="form-check-input default-check-color"
                    type="checkbox"
                    id="inlineCheckbox3"
                    defaultChecked={Active === "Y"}
                    onChange={() => setActive(Active === "Y" ? "N" : "Y")}
                  />
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12">
                <label>Admin Note</label>
                <textarea
                  className="form-control"
                  defaultValue={AdminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </div>
            </div>
          </div>
          <ModalFooter>
            {mode === "add" && (
              <button className="btn btn-success" onClick={() => AddGateway()}>
                Submit
              </button>
            )}
            {mode === "edit" && (
              <button
                className="btn btn-success"
                onClick={() => UpdateGateway()}
              >
                Update
              </button>
            )}
          </ModalFooter>
        </ModalBody>
      </Modal>
      {/*Delete Modal*/}
      <Modal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        backdrop="static"
        size="md"
      >
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>
          <h4 className="ftw-400">Alert!</h4>
        </ModalHeader>
        <ModalBody>
          <h4>Are you sure you want to remove this gateway?</h4>
          <ModalFooter>
            <button className="btn btn-danger" onClick={() => removeGateway()}>
              Remove
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default PaymentGateway;
