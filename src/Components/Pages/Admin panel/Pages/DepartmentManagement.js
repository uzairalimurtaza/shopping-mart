import Loading from "./../../../../Utils/Loading";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { CurrentUser } from "./../../../../Helpers/Auth";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import NoStore from "../../../../assets/images/no-store.svg";
import { RequiredField } from "./../../../../Utils/Required-field";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import CsvDownload from "react-json-to-csv";
import Icons from "./../../../../Utils/Icons";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
function DepartmentManagement() {
  const history = useHistory();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 10,
  });
  const [Name, setName] = useState("");
  const [DepartmentPic, setDepartmentPic] = useState("");
  const [Description, setDescription] = useState("");
  const [modal, setAddModal] = useState(false);
  const [editModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [department, setDepartments] = useState([]);
  const [DigitalProduct, setDigitalProduct] = useState("N");
  const [ShippingGlobal, setShippingGlobal] = useState("N");
  const [Active, setActive] = useState("N");
  const [editID, setEditID] = useState("");
  const [deleteID, setDeleteID] = useState("");
  var setItemToBeEdited = (item) => {
    console.log(item);
    setName(item.Department);
    setEditID(item.DepartmentID);
    setDescription(item.Description);
    setDepartmentPic(item.DepartmentPic);
    setDigitalProduct(item.DigitalProduct);
    setShippingGlobal(item.ShippingGlobal);
    setActive(item.Active);
    setEditModal(!editModal);
  };
  var setModal = async (val) => {
    if (val) {
      await resetState();
      setAddModal(val);
    } else {
      setAddModal(val);
    }
  };
  var setEditModal = async (val) => {
    if (!val) {
      await resetState();
      setUpdateModal(val);
    } else {
      setUpdateModal(val);
    }
  };
  var deleteDepartment = async () => {
    try {
      var response = await axios.delete(
        `${Endpoint}/api/department/delete-department/${deleteID}`
      );
      if (response.data.status) {
        firetoast("Department Removed!", "success", 3000, "top-right");
        setDeleteModal(!deleteModal);
        getDepartments();
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
        setDeleteID("");
        setDeleteModal(!deleteModal);
      }
    } catch (e) {
      setDeleteID("");
      firetoast(
        "Something went wrong while removing departments",
        "error",
        4000,
        "top-right"
      );
    }
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
        getDepartments();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getDepartments();
      }
    }
  };
  useEffect(() => {
    getDepartments();
  }, []);
  var getDepartments = async () => {
    try {
      var form = new URLSearchParams();
      form.append("limit", paginate.limit);
      form.append("offset", paginate.offset);
      var response = await axios.post(
        `${Endpoint}/api/department/get-department`,
        form
      );
      setDepartments(response.data.Department);
      setTotalRecords(response.data.total_records);
    } catch (e) {
      firetoast(
        "Something went wrong while getting departments",
        "error",
        4000,
        "top-right"
      );
    }
  };
  var EditDepartment = async () => {
    if (CheckEmpty(Name)) {
      return firetoast(
        "Department name can't be empty",
        "error",
        3000,
        "top-right"
      );
    }
    if (CheckEmpty(DepartmentPic)) {
      return firetoast(
        "Department picture is required",
        "error",
        3000,
        "top-right"
      );
    }
    if (CheckEmpty(Description)) {
      return firetoast("Description is empty", "error", 3000, "top-right");
    }
    try {
      var form = new FormData();
      form.append("Department", Name);
      form.append("Description", Description);
      form.append("DepartmentPic", DepartmentPic);
      form.append("DigitalProduct", DigitalProduct);
      form.append("ShippingGlobal", ShippingGlobal);
      form.append("Active", Active);
      var response = await axios.put(
        `${Endpoint}/api/department/update-department/${editID}`,
        form
      );
      if (response.data.status) {
        firetoast("Department Updated!", "success", 3000, "top-right");
        setTimeout(async () => {
          await resetState();
        }, 1000);
        getDepartments();
      } else {
        firetoast(
          response.data.message || response.data.error,
          "success",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      firetoast(
        "Someting went wrong while updating department",
        "error",
        5000,
        "top-center"
      );
    }
  };
  var toggleDeleteModal = (id) => {
    console.log(id);
    setDeleteID(id);
    setDeleteModal(!deleteModal);
  };
  var submitDepartment = async () => {
    if (CheckEmpty(Name)) {
      return firetoast(
        "Department name can't be empty",
        "error",
        3000,
        "top-right"
      );
    }
    if (CheckEmpty(DepartmentPic)) {
      return firetoast(
        "Department picture is required",
        "error",
        3000,
        "top-right"
      );
    }
    if (CheckEmpty(Description)) {
      return firetoast("Description is empty", "error", 3000, "top-right");
    }
    try {
      var form = new FormData();
      form.append("Department", Name);
      form.append("Description", Description);
      form.append("DepartmentPic", DepartmentPic);
      form.append("DigitalProduct", DigitalProduct);
      form.append("ShippingGlobal", ShippingGlobal);
      form.append("Active", Active);
      var response = await axios.post(
        `${Endpoint}/api/department/add-department`,
        form
      );
      if (response.data.status) {
        firetoast("Department Created!", "success", 3000, "top-right");
        getDepartments();
        setTimeout(async () => {
          await resetState();
        }, 2000);
      } else {
        firetoast(
          response.data.message || response.data.error,
          "success",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      firetoast(
        "Someting went wrong while creating department",
        "error",
        5000,
        "top-center"
      );
    }
  };
  var resetState = () => {
    setPaginate({
      offset: 0,
      limit: 5,
    });
    setName("");
    setDepartmentPic("");
    setDescription("");
    setAddModal(false);
    setUpdateModal(false);
    setDeleteModal(false);
    setIsLoading(false);
    setTotalRecords(0);
    setDigitalProduct("N");
    setShippingGlobal("N");
    setActive("N");
    setEditID("");
    setDeleteID("");
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Department Management</h3>
        <button className="btn btn-success" onClick={() => setModal(!modal)}>
          Add Department
        </button>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          {department.length > 0 ? (
            <>
              <div className="d-flex justify-content-between mt-4">
                <div>
                  <h6>
                    Total Departments :{" "}
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
                    data={department}
                    filename="departments.csv"
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
                ) : (
                  <table className="table table-borderless" id="myTable">
                    <thead>
                      <tr>
                        <th style={{ width: "15%" }}>Name</th>

                        <th>Image</th>
                        <th>Digital Product</th>
                        <th>Shipping Global</th>
                        <th>Active</th>
                        <th>Description</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {department.map((item, index) => (
                        <tr>
                          <td>{item.Department}</td>
                          <td style={{ width: "100px" }}>
                            <img
                              src={`${Endpoint}/${item.DepartmentPic}`}
                              className="img-fluid"
                              alt="dept-img"
                            />
                          </td>
                          <td>
                            {item.DigitalProduct === "Y"
                              ? Icons.GreenTick
                              : Icons.RedCross}
                          </td>
                          <td>
                            {item.ShippingGlobal === "Y"
                              ? Icons.GreenTick
                              : Icons.RedCross}
                          </td>
                          <td>
                            {item.Active === "Y"
                              ? Icons.GreenTick
                              : Icons.RedCross}
                          </td>
                          <td>{item.Description}</td>
                          <td>
                            {" "}
                            <UncontrolledDropdown>
                              <DropdownToggle color="success">
                                Actions
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={() =>
                                    history.push(
                                      `/panel/department-categories/${item.DepartmentID}/${item.Department}`
                                    )
                                  }
                                >
                                  View categories
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => {
                                    setItemToBeEdited(item);
                                  }}
                                >
                                  Edit
                                </DropdownItem>

                                <DropdownItem
                                  onClick={() =>
                                    toggleDeleteModal(item.DepartmentID)
                                  }
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
                )}
              </div>
            </>
          ) : (
            <div className="text-center no-store-container ">
              <div className="mt-3">
                <img src={NoStore} className="img-fluid no-store-img " />
                <h2 className="ftw-400 mt-3">No Department Data Found </h2>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal
        isOpen={modal}
        toggle={() => setModal(!modal)}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={() => setModal(!modal)}>
          Department Details
        </ModalHeader>
        <ModalBody>
          <div className="row mt-3">
            <div className="col-md-6 col-sm-12">
              <label>
                Department Name <RequiredField />
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={Name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label>
                Department Image <RequiredField />
              </label>
              <input
                className="form-control"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setDepartmentPic(e.target.files[0])}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 col-sm-12">
              <label>
                Description <RequiredField />
              </label>
              <textarea
                className="form-control"
                rows={5}
                defaultValue={Description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <hr />
          <div className="mt-3 d-flex justify-content-between">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox1 "
                value={DigitalProduct}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDigitalProduct("Y");
                  } else {
                    setDigitalProduct("N");
                  }
                }}
              />
              <label className="form-check-label" for="inlineCheckbox1">
                Is Digital Product
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox2"
                value={ShippingGlobal}
                onChange={(e) => {
                  if (e.target.checked) {
                    setShippingGlobal("Y");
                  } else {
                    setShippingGlobal("N");
                  }
                }}
              />
              <label className="form-check-label" for="inlineCheckbox2">
                Shipping Global
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                value={Active}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActive("Y");
                  } else {
                    setActive("N");
                  }
                }}
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Active
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => submitDepartment()}>
            Create
          </Button>{" "}
        </ModalFooter>
      </Modal>
      {/*Edit Modal*/}
      <Modal
        isOpen={editModal}
        toggle={() => setEditModal(!editModal)}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={() => setEditModal(!editModal)}>
          Edit Department Details
        </ModalHeader>
        <ModalBody>
          <div className="row mt-3">
            <div className="col-md-6 col-sm-12">
              <label>
                Department Name <RequiredField />
              </label>
              <input
                className="form-control"
                type="text"
                defaultValue={Name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="col-md-6 col-sm-12">
              <label>
                Department Image <RequiredField />
              </label>
              <input
                className="form-control"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setDepartmentPic(e.target.files[0])}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-12 col-sm-12">
              <label>
                Description <RequiredField />
              </label>
              <textarea
                className="form-control"
                rows={5}
                defaultValue={Description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <hr />
          <div className="mt-3 d-flex justify-content-between">
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox1 "
                defaultChecked={DigitalProduct === "Y"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setDigitalProduct("Y");
                  } else {
                    setDigitalProduct("N");
                  }
                }}
              />
              <label className="form-check-label" for="inlineCheckbox1">
                Is Digital Product
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox2"
                defaultChecked={ShippingGlobal === "Y"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setShippingGlobal("Y");
                  } else {
                    setShippingGlobal("N");
                  }
                }}
              />
              <label className="form-check-label" for="inlineCheckbox2">
                Shipping Global
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input default-check-color"
                type="checkbox"
                id="inlineCheckbox3"
                defaultChecked={Active === "Y"}
                onChange={(e) => {
                  if (e.target.checked) {
                    setActive("Y");
                  } else {
                    setActive("N");
                  }
                }}
              />
              <label className="form-check-label" for="inlineCheckbox3">
                Active
              </label>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => EditDepartment()}>
            Update
          </Button>{" "}
        </ModalFooter>
      </Modal>
      {/*Delete Modal*/}
      <Modal
        isOpen={deleteModal}
        toggle={() => setDeleteModal(!deleteModal)}
        backdrop="static"
        size="md"
      >
        <ModalHeader toggle={() => setDeleteModal(!deleteModal)}>
          Department Details
        </ModalHeader>
        <ModalBody>
          <div>Are you sure you want to remove this department ?</div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => deleteDepartment()}>
            Remove
          </Button>{" "}
        </ModalFooter>
      </Modal>
    </div>
  );
}
export default DepartmentManagement;
