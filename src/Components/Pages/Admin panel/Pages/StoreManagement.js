import Loading from "./../../../../Utils/Loading";
import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import NoStore from "../../../../assets/images/no-store.svg";
import { useHistory } from "react-router-dom";
import { CurrentUser, getRoles } from "./../../../../Helpers/Auth";
import firetoast from "./../../../../Helpers/FireToast";
import Endpoint from "./../../../../Utils/Endpoint";
import CsvDownload from "react-json-to-csv";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
function StoreManagement() {
  const history = useHistory();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("DESC");
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [stores, setStores] = useState([]);
  const [showMyStoreButton, setMyStoreButton] = useState(false);
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

        getStores();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getStores();
      }
    }
  };
  useEffect(() => {
    if (CurrentUser.Admin === "Y" || CurrentUser.SuperAdmin === "Y") {
      if (CurrentUser.Vendor === "Y") {
        setMyStoreButton(true);
        getStores();
      } else {
        getStores();
      }
    } else {
      history.push(`/panel/viewBusiness/${CurrentUser.UserID}`);
    }
  }, []);
  var getStores = async () => {
    setIsLoading(true);
    var data = { ...paginate };
    data["search"] = search;
    data["sort"] = sort;
    try {
      const response = await axios.post(
        `${Endpoint}/api/store-management/allstore-details`,
        data
      );
      setStores(response.data.Stores);
      setTotalRecords(response.data.total_records);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      firetoast("Something went wrong!", "error", 3000, "top-right");
    }
  };
  var getStoreByName = async (name) => {
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
        `${Endpoint}/api/store-management/storeDetails-nameFilter`,
        form
      );
      setStores(response.data.Stores);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getStoreByPhone = async (name) => {
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
        `${Endpoint}/api/store-management/storeDetails-phoneFilter`,
        form
      );
      setStores(response.data.Stores);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getStoreByEmail = async (name) => {
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
        `${Endpoint}/api/store-management/storeDetails-emailFilter`,
        form
      );
      setStores(response.data.Stores);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Store Management</h3>
        {getRoles().includes("Admin") && (
          <Button
            className="btn-default"
            onClick={() =>
              history.push(`/panel/viewBusiness/${CurrentUser.UserID}`)
            }
          >
            <i className="fas fa-store"></i> My Store
          </Button>
        )}
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="d-flex justify-content-between mt-4">
            <div>
              <h6>
                Total Stores :{" "}
                <span className="text-default">{totalRecords}</span>
              </h6>
            </div>
            <div className="d-flex justify-content-between">
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

              <UncontrolledDropdown>
                <DropdownToggle
                  style={{
                    backgroundColor: "white",
                    border: "white",
                    color: "black",
                  }}
                >
                  {" "}
                  <i className="fas fa-sort-amount-down-alt text-dark"></i>{" "}
                  Filter
                </DropdownToggle>
                <DropdownMenu>
                  <DropdownItem
                    onClick={async () => {
                      await setSort("ASC");
                      getStores();
                    }}
                  >
                    Ascending
                  </DropdownItem>

                  <DropdownItem
                    onClick={async () => {
                      await setSort("DESC");
                      getStores();
                    }}
                  >
                    Descending
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <CsvDownload
                data={stores}
                filename="stores.csv"
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
                  document.getElementById("StoreSearch").value = "";
                  document.getElementById("StoreEmail").value = "";
                  document.getElementById("StorePhone").value = "";
                  getStores();
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
                        id="StoreSearch"
                        placeholder="Search by Name"
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById("StoreSearch").value;
                            document.getElementById("StorePhone").value = "";
                            document.getElementById("StoreEmail").value = "";
                            await getStoreByName(elmntVal);
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
                        id="StorePhone"
                        placeholder="Search by Phone"
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById("StorePhone").value;
                            document.getElementById("StoreSearch").value = "";

                            document.getElementById("StoreEmail").value = "";
                            await getStoreByPhone(elmntVal);
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
                        id="StoreEmail"
                        placeholder="Search by Email"
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-success"
                          style={{ padding: "9px 12px" }}
                          onClick={async () => {
                            var elmntVal =
                              document.getElementById("StoreEmail").value;
                            document.getElementById("StoreSearch").value = "";
                            document.getElementById("StorePhone").value = "";

                            await getStoreByEmail(elmntVal);
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
            ) : stores.length > 0 ? (
              <table className="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Name</th>

                    <th>Phone</th>
                    <th>Email</th>
                    <th>Address # 1</th>
                    <th>Address # 2</th>
                    <th>City</th>
                    <th>Phone Verfication</th>
                    <th>Email Verfication</th>
                    <th>Status</th>
                    <th>Action</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((store, index) => (
                    <tr key={index}>
                      <td className="pt-18">{store.StoreName}</td>
                      <td className="pt-18">{store.StorePhone}</td>
                      <td className="pt-18">{store.StoreEmail}</td>
                      <td className="pt-18">{store.Address1}</td>
                      <td className="pt-18">{store.Address2}</td>
                      <td className="pt-18">{store.City}</td>
                      <td className="pt-18">
                        {store.PhoneVerified === "Y" ? (
                          <i className="fas fa-check text-default"></i>
                        ) : (
                          <i className="far fa-times text-danger"></i>
                        )}
                      </td>
                      <td className="pt-18">
                        {store.EmailVerified === "Y" ? (
                          <i className="fas fa-check text-default"></i>
                        ) : (
                          <i className="far fa-times text-danger"></i>
                        )}
                      </td>
                      <td className="pt-18">
                        {store.Active === "Y" && (
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
                        {console.log(store.StoreName, " ---------", store.Active)}
                        {(store.Active === "N" || store.Active == "" || store.Active == "NULL") && (
                          <span
                            className="badge text-danger"
                            style={{ fontSize: "13px" }}
                          >
                            {" "}
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="pt-18">
                        {" "}
                        <>
                          <span
                            className="badge text-default bg-light"
                            style={{ fontSize: "13px", cursor: "pointer" }}
                            onClick={() =>
                              history.push(
                                `/panel/update-single-store/${store.VendorStoreID}/${store.VendorID}/${store.StoreEmail}`
                              )
                            }
                          >
                            {" "}
                            <i className="far fa-edit text-dark"></i>
                          </span>
                        </>
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
    </div>
  );
}
export default StoreManagement;
