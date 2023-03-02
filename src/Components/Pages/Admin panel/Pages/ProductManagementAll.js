import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import NoStore from "../../../../assets/images/no-store.svg";
import Loading from "./../../../../Utils/Loading";
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import CsvDownload from "react-json-to-csv";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import Endpoint from "./../../../../Utils/Endpoint";
import firetoast from "./../../../../Helpers/FireToast";
import { CurrentUser, getRoles } from "./../../../../Helpers/Auth";

function ProductManagementAll() {
  const history = useHistory();
  const [sort, setSort] = useState("DESC");
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 5,
  });
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [products, setProducts] = useState([]);
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

        getProducts();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getProducts();
      }
    }
  };
  var getProducts = async () => {
    setIsLoading(true);
    var response = "";
    var data = { ...paginate };
    data["search"] = search;
    data["sort"] = sort;
    try {
      response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/get-productDetailsPaginated`,
        data
      );
      setProducts(response.data.Products);
      setTotalRecords(response.data.total_records);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      console.log(e);
      firetoast("Something went wrong!", "error", 3000, "top-right");
    }
  };
  var getProductByName = async (name) => {
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
        `${Endpoint}/api/product/get-productDetailsByName`,
        form
      );
      setProducts(response.data.Products);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getProductByCountry = async (name) => {
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
        `${Endpoint}/api/product/get-productDetailsByCountry`,
        form
      );
      setProducts(response.data.Products);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  var getProductByCity = async (name) => {
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
        `${Endpoint}/api/product/get-productDetailsByCity`,
        form
      );
      setProducts(response.data.Products);
      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong", "error", 3000, "top-right");
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="mt-5">
      <div className="d-flex justify-content-between">
        <h3 className="ftw-400">Product Management</h3>
        <div>
          {getRoles().includes("Vendor") && (
            <button
              className="btn-default"
              onClick={() => history.push("/panel/product-management")}
            >
              <i className="fas fa-shopping-bag"></i> My Products
            </button>
          )}
          <button
            className="btn-default"
            style={{ marginLeft: "5px" }}
            onClick={() => history.push("/panel/vendor/create-product")}
          >
            <i className="fas fa-plus"></i> Add Product
          </button>
        </div>
      </div>
      <div className="card mt-2">
        <div className="card-body">
          <div className="d-flex justify-content-between mt-4">
            <div>
              <h6>
                Total Products :{" "}
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
                      getProducts();
                    }}
                  >
                    Ascending
                  </DropdownItem>

                  <DropdownItem
                    onClick={async () => {
                      await setSort("DESC");
                      getProducts();
                    }}
                  >
                    Descending
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <CsvDownload
                data={products}
                filename="products.csv"
                className="btn btn-default-outline"
              >
                Export <i className="fas fa-arrow-alt-to-bottom"></i>
              </CsvDownload>
            </div>
          </div>
          <div>
            <div className="d-flex align-items-center mb-3">
              <h6
                className="ftw-400 text-default"
                style={{ marginRight: "10px" }}
              >
                Search
              </h6>
              <div className="col-3">
                <button
                  className="btn btn-success"
                  onClick={() => {
                    document.getElementById("StoreSearch").value = "";
                    document.getElementById("StoreEmail").value = "";
                    document.getElementById("StorePhone").value = "";
                    getProducts();
                  }}
                >
                  Clear{" "}
                </button>
              </div>
            </div>
            <div className="row m-0">
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
                        placeholder="By name"
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
                            await getProductByName(elmntVal);
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
                        placeholder="By country"
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
                            await getProductByCountry(elmntVal);
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
                        placeholder="By city"
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

                            await getProductByCity(elmntVal);
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
            ) : products.length > 0 ? (
              <table className="table table-borderless" id="myTable">
                <thead>
                  <tr>
                    <th style={{ width: "15%" }}>Title</th>
                    <th>Country</th>
                    <th>City</th>
                    <th>Currency</th>
                    <th>Cost Price</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Width</th>
                    <th>Active</th>
                    <th>Action</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => (
                    <tr key={index}>
                      <td className="pt-18">{product.Title}</td>
                      <td className="pt-18">{product.ProductCountry}</td>
                      <td className="pt-18">{product.ProductCity}</td>
                      <td className="pt-18">{product.Currency}</td>
                      <td className="pt-18">{product.CostPrice}</td>
                      <td className="pt-18">{product.Price}</td>
                      <td className="pt-18">
                        <div
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            width: "200px",
                          }}
                        >
                          {product.Description}
                        </div>
                      </td>
                      <td className="pt-18">{product.Height}</td>
                      <td className="pt-18">{product.Weight}</td>
                      <td className="pt-18">{product.Width}</td>

                      <td className="pt-18">
                        {product.Active === "Y" ? (
                          <i className="fas fa-check text-default"></i>
                        ) : (
                          <i className="far fa-times text-danger"></i>
                        )}
                      </td>
                      {/* <td className="pt-18">
                      {product.EmailVerified === "Y" ? (
                        <i className="fas fa-check text-default"></i>
                      ) : (
                        <i className="far fa-times text-danger"></i>
                      )}
                    </td>
                    <td className="pt-18">
                      {product.Active === "Y" && (
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
                      {product.Active === "N" && (
                        <span
                          className="badge text-danger"
                          style={{ fontSize: "13px" }}
                        >
                          {" "}
                          Inactive
                        </span>
                      )}
                    </td> */}
                      <td className="pt-18">
                        {" "}
                        <div
                          onClick={() =>
                            history.push(
                              `/panel/vendor/edit-product/${product.ProductID}/${product.VendorID}`
                            )
                          }
                        >
                          <span
                            className="badge text-default bg-light"
                            style={{ fontSize: "13px", cursor: "pointer" }}
                          >
                            {" "}
                            <i className="far fa-edit text-dark"></i>
                          </span>
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
                  <h2 className="ftw-400 mt-3">No Products Data Found </h2>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductManagementAll;
