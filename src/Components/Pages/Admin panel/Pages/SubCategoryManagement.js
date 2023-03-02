import { useState, useEffect } from "react";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import axios from "axios";
import Loading from "../../../../Utils/Loading";
import NoData from "../../../../assets/images/no-data.png";
import { Link } from "react-router-dom";
import { CurrentUser } from "../../../../Helpers/Auth";
function SubCategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubCategories] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [list, setList] = useState([]);
  const [newList, setNewList] = useState([]);

  var getAllCategories = async () => {
    try {
      var response = await axios.get(
        `${Endpoint}/api/category/get-allcategories`
      );
      setCategories(response.data.Category);
    } catch (e) {
      firetoast("Something went while fetching categories");
    }
  };
  useEffect(() => {
    getAllCategories();
    getSubCategories();
  }, []);
  var AddToList = async (index) => {
    var temp = [...newList];
    let item = subcategories[index];
    item["status"] = 0;
    let found = false;
    for (let i = 0; i < list.length; i++) {
      if (parseInt(item.SubCategoryID) === parseInt(list[i].SubCategoryID)) {
        return firetoast(
          "This subcatgory is already in existing",
          "error",
          3000,
          "top-right"
        );
      }
    }

    for (let i = 0; i < temp.length; i++) {
      if (parseInt(item.SubCategoryID) === parseInt(temp[i].SubCategoryID)) {
        found = true;
      }
    }

    if (found) {
      return firetoast(
        "This sub category already exist in the list!",
        "error",
        3000,
        "top-right"
      );
    } else {
      temp.push(item);
      setNewList(temp);
    }
  };
  var getSubCategories = async () => {
    try {
      const response = await axios.get(
        `${Endpoint}/api/store-management/get-vendorSubCategory/${CurrentUser.UserID}`
      );
      setList(response.data.VendorSubCategory);
    } catch (e) {
      firetoast(
        "Error while getting subcategories",
        "error",
        3000,
        "top-right"
      );
    }
  };
  var GetSubCategories = async (id) => {
    setisLoading(true);
    try {
      var response = await axios.get(
        `${Endpoint}/api/category/get-subcategory/${id}`
      );
      setSubCategories(response.data.SubCategory);
      setisLoading(false);
    } catch (e) {
      setisLoading(false);
      firetoast("Error while fetching subcategories");
    }
  };
  var deleteFromList = async (index) => {
    var temp = [...newList];
    temp.splice(index, 1);
    setNewList(temp);
  };
  var deleteFromExistingList = async (index) => {
    let temp = [...list];
    let id = temp[index].ID;
    try {
      var response = await axios.delete(
        `${Endpoint}/api/store-management/delete-vendorSubCategory/${id}`
      );
      if (response.data.status) {
        firetoast("Subcategory removed!", "success", 3000, "top-right");
        getSubCategories();
      } else {
        firetoast(
          response.data.error || response.data.message,
          "success",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      firetoast(
        "Something went wrong while removing subcategory",
        "success",
        3000,
        "top-right"
      );
    }
  };

  var saveList = async () => {
    let array = [];

    for (let i = 0; i < newList.length; i++) {
      array.push(newList[i].SubCategoryID);
    }
    var data = {
      VendorID: CurrentUser.UserID,
      SubCategoryID: array,
    };
    try {
      const response = await axios.post(
        `${Endpoint}/api/store-management/add-vendorSubCategory`,
        data
      );
      if (response.data.status) {
        firetoast(
          "Subcategories saved successfully!",
          "success",
          3000,
          "top-right"
        );
      } else {
        firetoast(
          response.data.error || response.data.message,
          "error",
          3000,
          "top-right"
        );
      }
    } catch (e) {
      firetoast(
        "Something went wrong while saving subcategories",
        "error",
        3000,
        "top-right"
      );
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between mt-5">
        <h3 className="ftw-400">Manage Subcategories</h3>
      </div>
      <div className="row">
        <div className="col-8">
          <div className="card mt-2">
            <div className="card-body">
              <div className="row">
                <div className="col-lg-8 col-md-10 col-sm-12">
                  <div className="form-group row">
                    <label
                      for="staticEmail"
                      className="col-sm-2 col-form-label"
                    >
                      {" "}
                      Categories
                    </label>
                    <div className="col-sm-10">
                      <select
                        className="form-control"
                        onChange={(e) => GetSubCategories(e.target.value)}
                      >
                        <option>Select Option ....</option>
                        {categories.map((item, index) => (
                          <option key={index} value={item.CategoryID}>
                            {item.Category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mt-2">
            <div className="card-body">
              <h5 className="ftw-400 text-success">Subcategories</h5>
              {isLoading ? (
                <Loading text="Getting SubCategories" />
              ) : (
                <div className="row">
                  {subcategories.length > 0 ? (
                    subcategories.map((item, index) => (
                      <div
                        className="col-lg-4 col-md-4 col-sm-6 col-xs-12"
                        key={index}
                      >
                        <div className="card mb-3">
                          <div className="row no-gutters">
                            <div className="col-md-12">
                              <div className="card-body d-flex justify-content-between">
                                <h5 className="card-title">
                                  {item.SubCategory}
                                </h5>
                                <div className="card-text">
                                  <Link
                                    to="#"
                                    className="td-none"
                                    style={{ fontSize: "18px" }}
                                    onClick={() => AddToList(index)}
                                  >
                                    <i className="fas fa-plus text-success"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center">
                      <img
                        src={NoData}
                        alt="no-data"
                        style={{ height: "100px" }}
                      />
                      <span style={{ fontSize: "18px" }}>
                        No data to display
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="card mt-2">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5 className="ftw-400 text-success">Selected Subcategories</h5>
                <button
                  className="btn btn-success"
                  disabled={newList.length < 1}
                  onClick={() => saveList()}
                >
                  Save{" "}
                </button>
              </div>
              {isLoading ? (
                <Loading text="Getting SubCategories" />
              ) : (
                <div className="row">
                  {newList.length > 0 ? (
                    <div className="row w-100">
                      {newList.map((item, index) => (
                        <div
                          className="col-lg-3 col-md-4 col-sm-6 col-xs-12"
                          key={index}
                        >
                          <div className="card mb-3">
                            <div className="row no-gutters">
                              <div className="col-md-12">
                                <div className="card-body d-flex justify-content-between">
                                  <h5 className="card-title">
                                    {item.SubCategory}
                                  </h5>
                                  <div className="card-text">
                                    <Link
                                      to="#"
                                      className="td-none"
                                      style={{ fontSize: "18px" }}
                                      onClick={() => deleteFromList(index)}
                                    >
                                      <i className="fas fa-trash text-danger"></i>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <img
                        src={NoData}
                        alt="no-data"
                        style={{ height: "100px" }}
                      />
                      <span style={{ fontSize: "18px" }}>
                        No data to display
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="card mt-2">
            <div className="card-body">
              <h5 className="ftw-400 text-success">Existing Subcategories</h5>
              {list.length < 1 && (
                <div className="text-center">
                  <img src={NoData} alt="no-data" style={{ height: "100px" }} />
                  <span style={{ fontSize: "18px" }}>No data to display</span>
                </div>
              )}
              {list.map((item, index) => (
                <div
                  className="d-flex justify-content-between"
                  key={index}
                  style={{ paddingTop: "10px" }}
                >
                  <td>
                    <p style={{ fontSize: "18px", marginBottom: "0px" }}>
                      <i className="fas fa-caret-right text-success"></i>{" "}
                      {item.SubCategory}
                    </p>
                  </td>

                  <td>
                    {" "}
                    <Link
                      to="#"
                      className="td-none"
                      style={{ fontSize: "12px" }}
                      onClick={() => deleteFromExistingList(index)}
                    >
                      <i className="fas fa-trash text-danger"></i>
                    </Link>
                  </td>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SubCategoryManagement;
