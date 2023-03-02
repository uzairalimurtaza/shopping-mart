import { useState, useEffect } from "react";
import Loading from "./../../../../../Utils/Loading";
import NoStore from "../../../../../assets/images/no-store.svg";
import { Button } from "reactstrap";
import firetoast from "./../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../Utils/Endpoint";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import Icons from "./../../../../../Utils/Icons";
import { RequiredField } from "./../../../../../Utils/Required-field";
import CheckEmpty from "./../../../../../Utils/CheckEmpty";
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
import { getCountries } from "libphonenumber-js";
import { useHistory } from "react-router-dom";
function CountryList() {
  const history = useHistory();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [countries, setCountries] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [addModal, setAddModal2] = useState(false);
  const [Country, setCountry] = useState("");
  const [GatewayID, setGatewayID] = useState("");
  const [IOSCountryCode, setIOSCountryCode] = useState("");
  const [CurrencyCode, setCurrencyCode] = useState("");
  const [CountryPhoneCode, setCountryPhoneCode] = useState("");
  const [GMTtime, setGMTtime] = useState("");
  const [AllowUser, setAllowUser] = useState("Y");
  const [AllowDelivery, setAllowDelivery] = useState("Y");
  const [AllowVendor, setAllowVendor] = useState("Y");
  const [VATTaxRate, setVATTaxRate] = useState("");
  const [FlatDeliveryRate, setFlatDeliveryRate] = useState("");
  const [FlatDeliveryRateKilo, setFlatDeliveryRateKilo] = useState("");
  const [Active, setActive] = useState("Y");
  const [AdminNote, setAdminNote] = useState("");
  const [Gateways, setGateways] = useState([]);
  const [ISO2, setISO2] = useState("");
  const [mode, setMode] = useState("");
  const [IdToDelete, setIdToDelete] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [idToBeEdit, setIdToBeEdit] = useState("");
  useEffect(() => {
    GetCountries();
    getGateway();
  }, []);
  let setAddModal = () => {
    if (addModal) {
      resetState();
      setAddModal2(!addModal);
    } else {
      setAddModal2(!addModal);
    }
  };

  var resetState = () => {
    setAddModal2(false);
    setCountry("");
    setGatewayID("");
    setIOSCountryCode("");
    setCurrencyCode("");
    setCountryPhoneCode("");
    setGMTtime("");
    setAllowUser("Y");
    setAllowDelivery("Y");
    setAllowVendor("Y");
    setVATTaxRate("");
    setFlatDeliveryRate("");
    setFlatDeliveryRateKilo("");
    setActive("Y");
    setAdminNote("");
    setISO2("");
    setMode("");
    setIdToDelete("");
    setDeleteModal(false);
  };
  var dataToEdit = (item) => {
    setIdToBeEdit(item.CountryID);
    setCountry(item.Country);
    setGatewayID(item.GatewayID);
    setIOSCountryCode(item.IOSCountryCode);
    setCurrencyCode(item.CurrencyCode);
    setCountryPhoneCode(item.CountryPhoneCode);
    setGMTtime(item.GMTtime);
    setAllowUser(item.AllowUser);
    setAllowDelivery(item.AllowDelivery);
    setAllowVendor(item.AllowVendor);
    setVATTaxRate(item.VATTaxRate);
    setFlatDeliveryRate(item.FlatDeliveryRate);
    setFlatDeliveryRateKilo(item.FlatDeliveryRateKilo);
    setActive(item.Active);
    setAdminNote(item.AdminNote);
    setISO2(item.ISO2);
    setAddModal(true);
  };
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

        GetCountries();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        GetCountries();
      }
    }
  };
  var GetCountries = async () => {
    setIsLoading(true);
    try {
      var form = new URLSearchParams();
      form.append("limit", paginate.limit);
      form.append("offset", paginate.offset);
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/location/get-country`,
        form
      );
      if (response.data.status) {
        setCountries(response.data.Country);
        setTotalRecords(response.data.total_records);
        setIsLoading(false);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "error", 3000, "top-right");
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      firetoast("Error while fetching countries", "error", 3000, "top-right");
    }
  };
  var getGateway = async () => {
    try {
      var response = await BanglaBazarApi.get(
        `${Endpoint}/api/payment/get-paymentGateway`
      );
      if (response.data.status) {
        setGateways(response.data.PaymentGateway);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "error", 3000, "top-right");
      }
    } catch (e) {
      firetoast("Error while fetching countries", "error", 3000, "top-right");
    }
  };
  var AddCountry = async () => {
    try {
      if (CheckEmpty(Country)) {
        return firetoast(
          "Country Name is required",
          "error",
          3000,
          "top-right"
        );
      } else if (CheckEmpty(GatewayID)) {
        return firetoast(
          "Please provide gateway is required",
          "error",
          3000,
          "top-right"
        );
      } else if (CheckEmpty(ISO2)) {
        return firetoast(
          "Please provide ISO2 is required",
          "error",
          3000,
          "top-right"
        );
      } else if (CheckEmpty(IOSCountryCode)) {
        return firetoast(
          "Please provide IOS Country Code is required",
          "error",
          3000,
          "top-right"
        );
      } else {
        var data = {
          Country,
          GatewayID,
          IOSCountryCode,
          CurrencyCode,
          CountryPhoneCode,
          GMTtime,
          AllowUser,
          AllowDelivery,
          AllowVendor,
          VATTaxRate,
          FlatDeliveryRate,
          FlatDeliveryRateKilo,
          Active,
          AdminNote,
          ISO2,
        };
        var form = new URLSearchParams();
        for (var key in data) {
          form.append(key, data[key]);
        }
        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/location/add-country`,
          form
        );
        if (response.data.status) {
          firetoast("Country Added successfully", "success", 3000, "top-right");
          setTimeout(() => {
            getCountries();
            resetState();
          }, 2000);
        } else {
          var { error, message } = response.data;
          firetoast(error || message, "success", 3000, "top-right");
        }
      }
    } catch (e) {
      firetoast(
        "Something went wrong while adding country",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var UpdateCountry = async () => {
    try {
      if (CheckEmpty(Country)) {
        return firetoast(
          "Country Name is required",
          "error",
          3000,
          "top-right"
        );
      } else if (CheckEmpty(GatewayID)) {
        return firetoast(
          "Please provide gateway is required",
          "error",
          3000,
          "top-right"
        );
      } else if (CheckEmpty(ISO2)) {
        return firetoast(
          "Please provide ISO2 is required",
          "error",
          3000,
          "top-right"
        );
      } else if (CheckEmpty(IOSCountryCode)) {
        return firetoast(
          "Please provide IOS Country Code is required",
          "error",
          3000,
          "top-right"
        );
      } else {
        var data = {
          Country,
          GatewayID,
          IOSCountryCode,
          CurrencyCode,
          CountryPhoneCode,
          GMTtime,
          AllowUser,
          AllowDelivery,
          AllowVendor,
          VATTaxRate,
          FlatDeliveryRate,
          FlatDeliveryRateKilo,
          Active,
          AdminNote,
          ISO2,
        };
        var form = new URLSearchParams();
        for (var key in data) {
          form.append(key, data[key]);
        }
        var response = await BanglaBazarApi.put(
          `${Endpoint}/api/location/update-country/${idToBeEdit}`,
          form
        );
        if (response.data.status) {
          firetoast(
            "Country Updated successfully",
            "success",
            3000,
            "top-right"
          );
          setTimeout(() => {
            getCountries();
            resetState();
          }, 2000);
        } else {
          var { error, message } = response.data;
          firetoast(error || message, "success", 3000, "top-right");
        }
      }
    } catch (e) {
      firetoast(
        "Something went wrong while updating country",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var RemoveCountry = async () => {
    try {
      var response = await BanglaBazarApi.delete(
        `${Endpoint}/api/location/delete-country/${IdToDelete}`
      );
      if (response.data.status) {
        firetoast("Country removes successfully", "success", 3000, "top-right");
        setTimeout(() => {
          resetState();
        }, 3000);
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "error", 3000, "top-right");
      }
    } catch (e) {
      firetoast("Error while removing country", "error", 3000, "top-right");
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Countries List</h3>
        <div>
          <button
            className="btn btn-success"
            onClick={() => {
              setMode("add");
              setAddModal(!addModal);
            }}
          >
            <i className="fas fa-globe-asia"></i> Add Country
          </button>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <>
            <div className="d-flex justify-content-between mt-4">
              <div>
                <h6>
                  Total Countries :{" "}
                  <span className="text-default">{totalRecords}</span>
                </h6>
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
                  <i className="fas fa-sort-amount-down-alt text-dark"></i>{" "}
                  Filter
                </Button>
                <CsvDownload
                  data={countries}
                  filename="countries.csv"
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
              ) : countries.length > 0 ? (
                <table className="table table-borderless" id="myTable">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Name</th>

                      <th>Phone Code</th>
                      <th>Currency Code</th>
                      <th>Flat Delivery Rate</th>
                      <th>Flat Delivery Rate Kilo</th>
                      <th>GMT time</th>
                      {/* <th>Gateway</th> */}
                      <th>IOS Country Code</th>
                      <th>ISO2</th>
                      <th>VAT Tax Rate</th>
                      <th>Active </th>
                      <th>User Allowed</th>
                      <th>Vendor Allowed</th>
                      <th>User Allowed</th>
                      <th>Delivery Allowed</th>
                      <td></td>
                    </tr>
                  </thead>
                  <tbody>
                    {countries.map((country, item) => (
                      <tr key={item}>
                        <td>{country.Country}</td>
                        <td>{country.CountryPhoneCode}</td>
                        <td>{country.CurrencyCode}</td>
                        <td>{country.FlatDeliveryRate}</td>
                        <td>{country.FlatDeliveryRateKilo}</td>
                        <td>{country.GMTtime}</td>
                        {/* <td>{country.GatewayName}</td> */}
                        <td>{country.IOSCountryCode}</td>
                        <td>{country.ISO2}</td>
                        <td>{country.VATTaxRate}</td>
                        <td>
                          {country.Active === "Y"
                            ? Icons.GreenTick
                            : Icons.RedCross}
                        </td>
                        <td>
                          {country.AllowUser === "Y"
                            ? Icons.GreenTick
                            : Icons.RedCross}
                        </td>
                        <td>
                          {country.AllowVendor === "Y"
                            ? Icons.GreenTick
                            : Icons.RedCross}
                        </td>
                        <td>
                          {country.AllowDelivery === "Y"
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
                                  history.push(
                                    `/panel/state-list/${country.CountryID}`
                                  );
                                }}
                              >
                                View States{" "}
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setMode("edit");
                                  dataToEdit(country);
                                }}
                              >
                                Edit{" "}
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => {
                                  setIdToDelete(country.CountryID);
                                  setDeleteModal(!deleteModal);
                                }}
                              >
                                Remove
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
                    <h2 className="ftw-400 mt-3">No Countries Data Found </h2>
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
          <h4 className="ftw-400">Country</h4>
        </ModalHeader>
        <ModalBody>
          <div className="row mt-2">
            <div className="col-8">
              <label>
                Country Name <RequiredField />
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={Country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="col-4">
              <label>
                Gateway <RequiredField />
              </label>
              <select
                className="form-control"
                onChange={(e) => setGatewayID(e.target.value)}
              >
                <option>Select gateway</option>
                {Gateways.map((item, index) => (
                  <option
                    key={index}
                    value={item.GatewayID}
                    selected={parseInt(GatewayID) === parseInt(item.GatewayID)}
                  >
                    {item.GatewayName}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-3">
              <label>Country Phone Code</label>
              <input
                className="form-control"
                type="number"
                defaultValue={CountryPhoneCode}
                onChange={(e) => setCountryPhoneCode(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>Currency Code</label>
              <input
                className="form-control"
                type="text"
                defaultValue={CurrencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>
                ISO2 <RequiredField />
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={ISO2}
                onChange={(e) => setISO2(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>
                IOS Country Code <RequiredField />
              </label>
              <input
                className="form-control"
                type="number"
                defaultValue={IOSCountryCode}
                onChange={(e) => setIOSCountryCode(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-3">
              <label>GMT Time</label>
              <input
                className="form-control"
                type="number"
                defaultValue={GMTtime}
                onChange={(e) => setGMTtime(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>VAT Tax Rate</label>
              <input
                className="form-control"
                type="number"
                defaultValue={VATTaxRate}
                onChange={(e) => setVATTaxRate(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>Flat Delivery Rate</label>
              <input
                className="form-control"
                type="number"
                defaultValue={FlatDeliveryRate}
                onChange={(e) => setFlatDeliveryRate(e.target.value)}
              />
            </div>
            <div className="col-3">
              <label>Flat Delivery Rate Kilo</label>
              <input
                className="form-control"
                type="number"
                defaultValue={FlatDeliveryRateKilo}
                onChange={(e) => setFlatDeliveryRateKilo(e.target.value)}
              />
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <label>Admin Note</label>
              <textarea
                className="form-control"
                defaultValue={AdminNote}
                onChange={(e) => setAdminNote(e.target.value)}
              />
            </div>
          </div>
          <hr />
          <div className="mt-2 row">
            <div className="col-4">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox3"
                  defaultChecked={Active === "Y"}
                  onChange={() => setActive(Active === "Y" ? "N" : "Y")}
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Active
                </label>
              </div>
            </div>
            <div className="col-4">
              {" "}
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox3"
                  defaultChecked={AllowDelivery === "Y"}
                  onChange={() =>
                    setAllowDelivery(AllowDelivery === "Y" ? "N" : "Y")
                  }
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Allow Delivery
                </label>
              </div>
            </div>
            <div className="col-4">
              {" "}
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox3"
                  defaultChecked={AllowUser === "Y"}
                  onChange={() => setAllowUser(AllowUser === "Y" ? "N" : "Y")}
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Allow User
                </label>
              </div>
            </div>
            <div className="col-4">
              {" "}
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox3"
                  defaultChecked={AllowVendor === "Y"}
                  onChange={() =>
                    setAllowVendor(AllowVendor === "Y" ? "N" : "Y")
                  }
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Allow Vendor
                </label>
              </div>
            </div>
          </div>
          <ModalFooter>
            {mode === "add" && (
              <button className="btn btn-success" onClick={() => AddCountry()}>
                Submit
              </button>
            )}
            {mode === "edit" && (
              <button
                className="btn btn-success"
                onClick={() => UpdateCountry()}
              >
                Update
              </button>
            )}
          </ModalFooter>
        </ModalBody>
      </Modal>
      {/*Delete*/}
      <Modal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>
          <h4 className="ftw-400">Remove Country</h4>
        </ModalHeader>
        <ModalBody>
          <h6>Are you sure you want to delete this country ?</h6>
          <ModalFooter>
            <button className="btn btn-success" onClick={() => RemoveCountry()}>
              Remove
            </button>
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default CountryList;
