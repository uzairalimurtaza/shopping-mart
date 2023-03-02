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
import CsvDownload from "react-json-to-csv";

function CityList() {
  const { StateID, CountryID } = useParams();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [addModal, setAddModal2] = useState(false);
  const [mode, setMode] = useState("");
  const [countries, setCountries] = useState([]);

  const [countryID, setCountryID] = useState("");
  const [City, setCity] = useState("");
  const [Native, setNative] = useState("");
  const [VATTaxRate, setVATTaxRate] = useState("");
  const [FlatDeliveryRate, setFlatDeliveryRate] = useState("");
  const [FlatDeliveryRateKilo, setFlatDeliveryRateKilo] = useState("");
  const [DeliveryPersonAvailable, setDeliveryPersonAvailable] = useState("Y");
  const [Active, setActive] = useState("Y");
  const [AdminNote, setAdminNote] = useState("");

  const [IdToEdit, setIdToEdit] = useState("");
  useEffect(() => {
    getCities();
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
        getCities();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        setPaginate(paginate);
        getCities();
      }
    }
  };
  var getCities = async () => {
    try {
      var form = new URLSearchParams();
      form.append("StateID", StateID);
      form.append("limit", paginate.limit);
      form.append("offset", paginate.offset);
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/location/get-city`,
        form
      );
      setCities(response.data.City);
      setTotalRecords(response.data.total_records);
    } catch (e) {
      firetoast("Error while getting states", "error", 3000, "top-right");
    }
  };
  let resetState = () => {
    setAddModal2(false);
    setCountryID("");
    setCity("");
    setNative("");
    setVATTaxRate("");
    setFlatDeliveryRate("");
    setFlatDeliveryRateKilo("");
    setActive("Y");
    setAdminNote("");
    setIdToEdit("");
  };
  let setAddModal = () => {
    if (addModal) {
      resetState();
      setAddModal2(!addModal);
    } else {
      setAddModal2(!addModal);
    }
  };
  var AddCity = async () => {
    try {
      if (CheckEmpty(City)) {
        return firetoast("City Name is required", "error", 3000, "top-right");
      } else {
        var data = {
          City,
          StateID,
          CountryID,
          Native,
          VATTaxRate,
          FlatDeliveryRate,
          FlatDeliveryRateKilo,
          DeliveryPersonAvailable,
          Active,
          AdminNote,
        };
        var form = new URLSearchParams();
        for (var key in data) {
          form.append(key, data[key]);
        }
        var response = await BanglaBazarApi.post(
          `${Endpoint}/api/location/add-city`,
          form
        );
        if (response.data.status) {
          firetoast("City Added successfully", "success", 3000, "top-right");
          setTimeout(() => {
            getCities();
            resetState();
          }, 2000);
        } else {
          var { error, message } = response.data;
          firetoast(error || message, "success", 3000, "top-right");
        }
      }
    } catch (e) {
      firetoast(
        "Something went wrong while adding city",
        "error",
        3000,
        "top-right"
      );
    }
  };
  let dataToEdit = (city) => {
    setMode("edit");
    setIdToEdit(city.StateID);
    setCountryID(city.CountryID);
    setCity(city.City);
    setNative(city.Native);
    setVATTaxRate(city.VATTaxRate);
    setFlatDeliveryRate(city.FlatDeliveryRate);
    setFlatDeliveryRateKilo(city.FlatDeliveryRateKilo);
    setActive(city.Active);
    setAdminNote(city.AdminNote);
    setAddModal(!addModal);
  };
  var UpdateState = async () => {
    try {
      if (CheckEmpty(City)) {
        return firetoast("City Name is required", "error", 3000, "top-right");
      } else {
        var data = {
          StateID,
          CountryID,
          City,
          Native,
          VATTaxRate,
          FlatDeliveryRate,
          FlatDeliveryRateKilo,
          DeliveryPersonAvailable,
          Active,
          AdminNote,
        };
        var form = new URLSearchParams();
        for (var key in data) {
          form.append(key, data[key]);
        }
        var response = await BanglaBazarApi.put(
          `${Endpoint}/api/location/update-city/${IdToEdit}`,
          form
        );
        if (response.data.status) {
          firetoast("City Updated successfully", "success", 3000, "top-right");
          setTimeout(() => {
            getCities();
            resetState();
          }, 2000);
        } else {
          var { error, message } = response.data;
          firetoast(error || message, "success", 3000, "top-right");
        }
      }
    } catch (e) {
      firetoast(
        "Something went wrong while city state",
        "error",
        3000,
        "top-right"
      );
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">City List</h3>
        <button
          className="btn btn-success"
          onClick={() => {
            setMode("add");
            setAddModal(!addModal);
          }}
        >
          <i className="fas fa-globe-asia"></i> Add City
        </button>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <>
            <div className="d-flex justify-content-between mt-4">
              <div>
                <h6>
                  Total States :{" "}
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
                  data={cities}
                  filename="cities.csv"
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
              ) : cities.length > 0 ? (
                <table className="table table-borderless" id="myTable">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}>Name</th>

                      <th>Country</th>
                      <th>Native</th>
                      <th>State Code</th>
                      <th>Flat Delivery Rate</th>
                      <th>Flat Delivery Rate Kilo</th>

                      <th>VAT Tax Rate</th>
                      <th>Active</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cities.map((state, index) => (
                      <tr>
                        <td>{state.State}</td>
                        <td>{state.Country}</td>
                        <td>{state.Native}</td>
                        <td>{state.StateCode}</td>
                        <td>{state.FlatDeliveryRate}</td>
                        <td>{state.FlatDeliveryRateKilo}</td>
                        <td>{state.VATTaxRate}</td>
                        <td>
                          {state.Active === "Y"
                            ? Icons.GreenTick
                            : Icons.RedCross}
                        </td>
                        <td>
                          <UncontrolledDropdown>
                            <DropdownToggle className="btn btn-light text-default">
                              Action
                            </DropdownToggle>
                            <DropdownMenu>
                              {/* <DropdownItem
                              onClick={() => {
                                history.push(
                                  `/panel/state-list/${country.CountryID}`
                                );
                              }}
                              >
                                View States{" "}
                              </DropdownItem> */}
                              <DropdownItem
                                onClick={() => {
                                  setMode("edit");
                                  dataToEdit(state);
                                }}
                              >
                                Edit{" "}
                              </DropdownItem>
                              {/* <DropdownItem
                              onClick={() => {
                                setIdToDelete(country.CountryID);
                                setDeleteModal(!deleteModal);
                              }}
                              >
                                Remove
                              </DropdownItem> */}
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
          <h4 className="ftw-400">City</h4>
        </ModalHeader>
        <ModalBody>
          <div className="row mt-2">
            <div className="col-8">
              <label>
                City Name <RequiredField />
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={City}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            {/* <div className="col-4">
              <label>
                Country <RequiredField />
              </label>
              <select
                className="form-control"
                onChange={(e) => setCountry(e.target.value)}
              >
                <option>Select country</option>
                {countries.map((item, index) => (
                  <option
                    key={index}
                    value={item.countryID}
                    selected={parseInt(countryID) === parseInt(item.CountryID)}
                  >
                    {item.Country}
                  </option>
                ))}
              </select>
            </div> */}
          </div>
          <div className="row mt-2">
            {/* <div className="col-3">
              <label>State Code</label>
              <input
                className="form-control"
                type="number"
                defaultValue={StateCode}
                onChange={(e) => setStateCode(e.target.value)}
              />
            </div> */}
            <div className="col-3">
              <label>Native </label>
              <input
                className="form-control"
                type="text"
                defaultValue={Native}
                onChange={(e) => setNative(e.target.value)}
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
          </div>
          <div className="row mt-2">
            <div className="col-3">
              <label>Flat Delivery Rate Kilo</label>
              <input
                className="form-control"
                type="number"
                defaultValue={FlatDeliveryRateKilo}
                onChange={(e) => setFlatDeliveryRateKilo(e.target.value)}
              />
            </div>
            <div className="col-9">
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
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input default-check-color"
                  type="checkbox"
                  id="inlineCheckbox3"
                  defaultChecked={DeliveryPersonAvailable === "Y"}
                  onChange={() =>
                    setDeliveryPersonAvailable(
                      DeliveryPersonAvailable === "Y" ? "N" : "Y"
                    )
                  }
                />
                <label className="form-check-label" for="inlineCheckbox3">
                  Allow Delivery Person
                </label>
              </div>
            </div>
          </div>
          <ModalFooter>
            {mode === "add" && (
              <button className="btn btn-success" onClick={() => AddCity()}>
                Submit
              </button>
            )}
            {mode === "edit" && (
              <button className="btn btn-success" onClick={() => UpdateState()}>
                Update
              </button>
            )}
          </ModalFooter>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default CityList;
