import Loading from "./../../../../../Utils/Loading";
import { useState, useEffect } from "react";
import { Button } from "reactstrap";
import NoStore from "../../../../../assets/images/no-store.svg";
import { useHistory } from "react-router-dom";
import { CurrentUser } from "./../../../../../Helpers/Auth";
import firetoast from "./../../../../../Helpers/FireToast";
import Endpoint from "./../../../../../Utils/Endpoint";
import CsvDownload from "react-json-to-csv";

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
function VendorManagement() {
  const history = useHistory();
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [vendors, setVendors] = useState([]);
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

        // getStores();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        // getStores();
      }
    }
  };
  useEffect(() => {
    if (CurrentUser.Admin === "Y" || CurrentUser.SuperAdmin === "Y") {
      if (CurrentUser.Vendor === "Y") {
        setMyStoreButton(true);
        getVendors();
      } else {
        getVendors();
      }
    } else {
      history.push(`/panel/viewBusiness/${CurrentUser.UserID}`);
    }
  }, []);
  var getVendors = async () => {
    setIsLoading(true);
    var data = { ...paginate };
    // data["search"] = search;
    // data["sort"] = sort;
    try {
      const response = await axios.post(
        `${Endpoint}/api/store-management/buisnessDetails-Paginated`,
        data
      );
      setVendors(response.data.VendorBuisness);
      setTotalRecords(response.data.total_records);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      firetoast("Something went wrong!", "error", 3000, "top-right");
    }
  };
  var getVendorByName = async (name) => {
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
        `${Endpoint}/api/store-management/buisnessDetails-nameFilter`,
        form
      );
      setVendors(response.data.VendorBuisness);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getVendorByPhone = async (name) => {
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
        `${Endpoint}/api/store-management/buisnessDetails-phoneFilter`,
        form
      );
      setVendors(response.data.VendorBuisness);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getVendorByEmail = async (name) => {
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
        `${Endpoint}/api/store-management/buisnessDetails-phoneFilter`,
        form
      );
      setVendors(response.data.VendorBuisness);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Vendor Management</h3>
        {showMyStoreButton && (
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
          <>
            <div className="d-flex justify-content-between mt-4">
              <div>
                <h6>
                  Total Vendors :{" "}
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
                  {/* <DropdownMenu>
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
                    </DropdownMenu> */}
                </UncontrolledDropdown>
                <CsvDownload
                  data={vendors}
                  filename="vendors.csv"
                  className="btn btn-default-outline"
                >
                  Export <i className="fas fa-arrow-alt-to-bottom"></i>
                </CsvDownload>
              </div>
            </div>
            <div className="d-flex align-items-center">
              <h6 className="ftw-400 text-default">Search</h6>
              <button
                className="btn btn-success"
                style={{ marginLeft: "10px" }}
                onClick={() => {
                  document.getElementById("SearchPhone").value = "";
                  document.getElementById("SearchEmail").value = "";
                  document.getElementById("SearchName").value = "";
                  getVendors();
                }}
              >
                Clear{" "}
              </button>
            </div>
            <div className="row m-0 mt-2">
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
                        placeholder="Search by Name"
                        id="SearchName"
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

                            await getVendorByName(elmntVal);
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
                        placeholder="Search by Phone"
                        id="SearchPhone"
                      // onChange={async (e) => {
                      //   await getVendorByPhone(e.target.value);
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

                            await getVendorByPhone(elmntVal);
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
                        placeholder="Search by Email"
                        id="SearchEmail"
                      // onChange={async (e) => {
                      //   await getVendorByEmail(e.target.value);
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

                            await getVendorByEmail(elmntVal);
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

            <div className="mt-3 table-responsive">
              {isLoading ? (
                <div>
                  <Loading />
                </div>
              ) : vendors.length > 0 ? (
                <table className="table table-borderless" id="myTable">
                  <thead>
                    <tr>
                      <th style={{ width: "15%" }}></th>
                      <th style={{ width: "15%" }}>Name</th>

                      <th>Phone</th>
                      <th>Email</th>
                      <th>Address # 1</th>
                      <th>Address # 2</th>
                      <th>City</th>

                      <th>Store Pickup</th>
                      <th>Reviewed Admin</th>
                      <th>Approved SuperAdmin</th>
                      <th>Action</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendors.map((vendor, index) => (
                      <tr key={index}>
                        <td className="text-center">
                          <img
                            className="img-fluid"
                            src={`${Endpoint}/${vendor.CompanyLogo}`}
                            style={{ height: "70px" }}
                          />
                        </td>
                        <td className="pt-18">{vendor.CompanyName}</td>
                        <td className="pt-18">{vendor.BusinessPhone}</td>
                        <td className="pt-18">{vendor.BusinessEmail}</td>
                        <td className="pt-18">{vendor.Address1}</td>
                        <td className="pt-18">{vendor.Address2}</td>
                        <td className="pt-18">{vendor.City}</td>
                        {/* <td className="pt-18">
                          {vendor.PhoneVerified === "Y" ? (
                            <i className="fas fa-check text-default"></i>
                          ) : (
                            <i className="far fa-times text-danger"></i>
                          )}
                        </td>
                        <td className="pt-18">
                          {vendor.EmailVerified === "Y" ? (
                            <i className="fas fa-check text-default"></i>
                          ) : (
                            <i className="far fa-times text-danger"></i>
                          )}
                        </td> */}
                        <td className="pt-18">
                          {vendor.AllowStorePickup === "Y" && (
                            <>
                              {" "}
                              <i className="fas fa-check text-default"></i>
                            </>
                          )}
                          {vendor.Active === "N" && (
                            <i className="far fa-times text-danger"></i>
                          )}
                        </td>
                        <td className="pt-18">
                          {vendor.ReviewedByAdmin === "Y" && (
                            <>
                              {" "}
                              <i className="fas fa-check text-default"></i>
                            </>
                          )}
                          {(vendor.ReviewedByAdmin === "N" ||
                            vendor.ReviewedByAdmin === "") && (
                              <i className="far fa-times text-danger"></i>
                            )}
                        </td>
                        <td className="pt-18">
                          {vendor.ReviewedBySuperAdmin === "Y" && (
                            <>
                              {" "}
                              <i className="fas fa-check text-default"></i>
                            </>
                          )}
                          {(vendor.ReviewedBySuperAdmin === "N" ||
                            vendor.ReviewedBySuperAdmin === "") && (
                              <i className="far fa-times text-danger"></i>
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
                                  `/panel/viewBusiness/${vendor.VendorID}`
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
          </>
        </div>
      </div>
    </div>
  );
}
export default VendorManagement;
