// DepartmentCategories
import Loading from "./../../../../Utils/Loading";
import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { CurrentUser } from "./../../../../Helpers/Auth";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import axios from "axios";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import NoStore from "../../../../assets/images/no-store.svg";
import { RequiredField } from "./../../../../Utils/Required-field";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import Icons from "./../../../../Utils/Icons";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import VariantRow from "../../Web App/Web App Components/VariantRow";
import VariantValueRow from "./../../Web App/Web App Components/VariantValueRow";
function DepartmentSubCategories() {
  const history = useHistory();
  const { name, id, deptID } = useParams();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [Name, setName] = useState("");
  const [SubCategoryPic, setSubCategoryPic] = useState("");
  const [Description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [variantModal, setVariantModal] = useState(false);
  const [modal, setAddModal] = useState(false);
  const [editModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [CategoryID, setCategoryID] = useState(id);
  const [subcategories, setSubCategories] = useState([]);
  const [editID, setEditID] = useState("");
  const [deleteID, setDeleteID] = useState("");
  const [ShippingGlobal, setShippingGlobal] = useState("Y");
  const [Active, setActive] = useState("Y");
  const [variantLoading, setVariantLoading] = useState(false);
  const [SubCategoryVariants, setSubCategoryVariants] = useState([]);
  const [VariantValues, setVariantValues] = useState([]);
  const [newVariant, setNewVariant] = useState([]);
  const [newVariantValue, setnewVariantValue] = useState([]);
  const [ChangingVariantId, setChangingVariantId] = useState("");
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
  var setItemToBeEdited = (item) => {
    setName(item.SubCategory);
    setEditID(item.SubCategoryID);
    setDescription(item.Description);
    setSubCategoryPic(item.SubCategoryPic);
    setShippingGlobal(item.ShippingGlobal);
    setActive(item.Active);
    setEditModal(!editModal);
  };
  var deleteCategory = async () => {
    try {
      var response = await axios.delete(
        `${Endpoint}/api/category/delete-subcategory/${deleteID}`
      );
      if (response.data.status) {
        firetoast("Sub Category Removed!", "success", 3000, "top-right");
        getSubCategories();
        setTimeout(async () => {
          await resetState();
        }, 2000);
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
        await resetState();
      }
    } catch (e) {
      await resetState();
      firetoast(
        "Something went wrong while removing category",
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
        getSubCategories();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getSubCategories();
      }
    }
  };
  var getCategories = async () => {
    try {
      var form = new URLSearchParams();
      form.append("DepartmentID", deptID);
      var response = await axios.post(
        `${Endpoint}/api/category/get-allcategory`,
        form
      );
      setCategories(response.data.Category);
    } catch (e) {
      firetoast(
        "Something went wrong while getting departments",
        "error",
        4000,
        "top-right"
      );
    }
  };
  useEffect(() => {
    getSubCategories();
    getCategories();
  }, []);
  var getSubCategories = async () => {
    try {
      var form = new URLSearchParams();
      form.append("limit", paginate.limit);
      form.append("offset", paginate.offset);
      form.append("CategoryID", id);
      var response = await axios.post(
        `${Endpoint}/api/category/get-subcategory`,
        form
      );
      setSubCategories(response.data.SubCategory);
      setTotalRecords(response.data.total_records);
    } catch (e) {
      firetoast(
        "Something went wrong while getting categories",
        "error",
        4000,
        "top-right"
      );
    }
  };
  var EditCategory = async () => {
    if (CheckEmpty(Name)) {
      return firetoast(
        "Category name can't be empty",
        "error",
        3000,
        "top-right"
      );
    }
    if (CheckEmpty(SubCategoryPic)) {
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
    if (CheckEmpty(CategoryID)) {
      setCategoryID(id);
    }
    try {
      var form = new FormData();
      form.append("CategoryID", CategoryID);
      form.append("SubCategory", Name);
      form.append("Description", Description);
      form.append("SubCategoryPic", SubCategoryPic);
      form.append("ShippingGlobal", ShippingGlobal);
      form.append("Active", Active);
      var response = await axios.put(
        `${Endpoint}/api/category/update-subcategory/${editID}`,
        form
      );
      if (response.data.status) {
        firetoast("Sub Category Updated!", "success", 3000, "top-right");
        setTimeout(async () => {
          await resetState();
        }, 1000);
        getSubCategories();
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
        "Someting went wrong while updating subcategory",
        "error",
        5000,
        "top-center"
      );
    }
  };
  var toggleDeleteModal = (id) => {
    setDeleteID(id);
    setDeleteModal(!deleteModal);
  };
  var submitSubCategory = async () => {
    if (CheckEmpty(Name)) {
      return firetoast(
        "Category name can't be empty",
        "error",
        3000,
        "top-right"
      );
    }
    if (CheckEmpty(SubCategoryPic)) {
      return firetoast(
        "Category picture is required",
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
      form.append("SubCategory", Name);
      form.append("Description", Description);
      form.append("SubCategoryPic", SubCategoryPic);
      form.append("CategoryID", id);
      form.append("ShippingGlobal", ShippingGlobal);
      form.append("Active", Active);
      var response = await axios.post(
        `${Endpoint}/api/category/add-subcategory`,
        form
      );
      if (response.data.status) {
        firetoast("Sub Category Added!", "success", 3000, "top-right");
        getSubCategories();

        setTimeout(async () => {
          await resetState();
        }, 2000);
      } else {
        firetoast(
          response.data.message || response.data.error,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      firetoast(
        "Someting went wrong while creating sub category",
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
    setSubCategoryPic("");
    setDescription("");
    setAddModal(false);
    setUpdateModal(false);
    setDeleteModal(false);
    setIsLoading(false);
    setCategoryID(id);
    setEditID("");
    setDeleteID("");
    setShippingGlobal("Y");
    setActive("Y");
  };
  var setVariant = async (item) => {
    setVariantLoading(true);
    setName(item.SubCategory);
    setEditID(item.SubCategoryID);
    await getVariants(item.SubCategoryID);
    setVariantModal(!variantModal);
    setVariantLoading(false);
  };
  var getVariants = async (id) => {
    try {
      var response = await axios.get(
        `${Endpoint}/api/category/get-subcategoryvariant/${id}`
      );

      if (response.data.status) {
        setSubCategoryVariants(response.data.SubCategoryVariant);
      } else {
        setSubCategoryVariants([]);
      }
    } catch (e) {
      setSubCategoryVariants([]);
      firetoast(
        "Something went wrong while getting variants",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var getVariantValues = async (id) => {
    setChangingVariantId(id);
    try {
      var response = await axios.get(
        `${Endpoint}/api/category/get-subcategoryvariantvalue/${id}`
      );
      console.log(response);
      setVariantValues(response.data.SubCategoryVariantValue);
    } catch (e) {
      setVariantValues([]);
      firetoast(
        "Something went wrong while getting variants values",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var clearNewVariant = () => {
    setNewVariant([]);
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">
          {" "}
          <span
            onClick={() =>
              history.push(`/panel/department-categories/${id}/${name}`)
            }
            style={{ cursor: "pointer" }}
          >
            <i className="fas fa-chevron-left"></i>
          </span>{" "}
          Sub categories for {name}
        </h3>
        <button className="btn btn-success" onClick={() => setModal(!modal)}>
          Add Sub category
        </button>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          {subcategories.length > 0 ? (
            <>
              <div className="d-flex justify-content-between mt-4">
                <div>
                  <h6>
                    Total Categories :{" "}
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
                  <Button
                    className="btn-default-outline"
                    style={{ marginLeft: "15px" }}
                  >
                    Export <i className="fas fa-arrow-alt-to-bottom"></i>
                  </Button>
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
                        <th>Shipping Global</th>
                        <th>Active</th>
                        <th>Description</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((item, index) => (
                        <tr>
                          <td>{item.SubCategory}</td>
                          <td style={{ width: "100px" }}>
                            <img
                              src={`${Endpoint}/${item.SubCategoryPic}`}
                              className="img-fluid"
                              style={{ height: "100px" }}
                              alt="dept-img"
                            />
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
                                <DropdownItem onClick={() => setVariant(item)}>
                                  Manage Variants
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
                                    toggleDeleteModal(item.SubCategoryID)
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
                <h2 className="ftw-400 mt-3">No Category Data Found </h2>
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
          Sub Category Details
        </ModalHeader>
        <ModalBody>
          <div className="row mt-3">
            <div className="col-md-6 col-sm-12">
              <label>
                Sub Category Name <RequiredField />
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
                Sub Category Image <RequiredField />
              </label>
              <input
                className="form-control"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setSubCategoryPic(e.target.files[0])}
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
          <div className="mt-3">
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
          <Button color="success" onClick={() => submitSubCategory()}>
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
          Edit Sub Category Details
        </ModalHeader>
        <ModalBody>
          <div className="row mt-3">
            <div className="col-md-6 col-sm-12">
              <label>
                Sub Category Name <RequiredField />
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
                Sub Category Image <RequiredField />
              </label>
              <input
                className="form-control"
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => setSubCategoryPic(e.target.files[0])}
              />
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-md-6 col-sm-12">
              <label>Category</label>
              <select
                className="form-control"
                onChange={(e) => setCategoryID(e.target.value)}
              >
                <option>Select option...</option>
                {categories.map((cat, index) => (
                  <option
                    value={cat.CategoryID}
                    key={index}
                    selected={cat.CategoryID === parseInt(id)}
                  >
                    {cat.Category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 col-sm-12">
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
          <Button color="success" onClick={() => EditCategory()}>
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
          Attention!
        </ModalHeader>
        <ModalBody>
          <div>Are you sure you want to remove this sub category ?</div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={() => deleteCategory()}>
            Remove
          </Button>{" "}
        </ModalFooter>
      </Modal>
      {/*Variant Modal */}
      <Modal
        isOpen={variantModal}
        toggle={() => setVariantModal(!variantModal)}
        backdrop="static"
        size="lg"
      >
        <ModalHeader toggle={() => setVariantModal(!variantModal)}>
          Manage Variants
        </ModalHeader>
        <ModalBody>
          <div className="row">
            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <h5 className="ftw-400 text-default">Variants</h5>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    var temp = [...newVariant];
                    let obj = {
                      SubCategoryID: editID,
                      Variant: "",
                    };
                    temp.push(obj);
                    setNewVariant(temp);
                  }}
                  disabled={newVariant.length > 0}
                >
                  Add Variant
                </button>
              </div>
              <div className="mt-3">
                {SubCategoryVariants.map((variant, index) => (
                  <VariantRow
                    variant={variant}
                    index={index}
                    status="1"
                    getVariants={getVariants}
                    getVariantValues={getVariantValues}
                  />
                ))}
                {newVariant.map((variant, index) => (
                  <VariantRow
                    variant={variant}
                    index={index}
                    clearNewVariant={clearNewVariant}
                    status="2"
                    getVariants={getVariants}
                  />
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex justify-content-between">
                <h5 className="ftw-400 text-default">
                  {VariantValues.length > 0
                    ? `${VariantValues[0].VariantName} Values`
                    : "No Values found for this variant"}
                </h5>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => {
                    var temp = [...newVariantValue];
                    let obj = {
                      SubCategoryVariantID: ChangingVariantId,
                      VariantValue: "",
                    };
                    temp.push(obj);
                    setnewVariantValue(temp);
                  }}
                  disabled={newVariantValue.length > 0}
                >
                  Add Value
                </button>
              </div>
              <div className="mt-3">
                {VariantValues.map((variant, index) => (
                  <VariantValueRow
                    variant={variant}
                    index={index}
                    status="1"
                    getVariantValues={getVariantValues}
                  />
                ))}
                {newVariantValue.map((variant, index) => (
                  <VariantValueRow
                    variant={variant}
                    index={index}
                    status="2"
                    clearNewVariant={() => setnewVariantValue([])}
                    getVariantValues={getVariantValues}
                  />
                ))}
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
}
export default DepartmentSubCategories;
