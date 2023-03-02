import React, { useState, useEffect } from "react";
import { WebsiteHeader } from "./../Layout/Header";
import { NewsLetter } from "./../Layout/NewsLetter";
import { Footer } from "./../Layout/Footer";
import { Collapse } from "reactstrap";
import { Link, useParams, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  getProductsByCategoryId,
  getProductsBySubCategoryId,
} from "./../../../../Actions/ProductsAction";
import Loading from "./../../../../Utils/Loading";
import NoData from "../../../../assets/images/no-product.png";
import Endpoint from "./../../../../Utils/Endpoint";
import firetoast from "../../../../Helpers/FireToast";
import AddProductClick from "./../../../../Helpers/AddProductClick";
import ProductImage from "./../../../../Utils/ProductImage";
function SearchedProducts() {
  const { mode, id } = useParams();
  const history = useHistory();
  const [collapse, setCollapse] = useState(true);
  const [Mode, SetMode] = useState(mode);
  const [paginate, setPaginate] = useState({
    limit: 8,
    offset: 0,
    sort: "DESC",
    search: "",
    status: 0,
    searchType: 0,
  });
  const [totalRecords, setTotalRecords] = useState(1);
  const [CategoryAndSubCategory, setCategoryAndSubCategory] = useState([]);
  const [Products, setProducts] = useState([]);
  const state = useSelector((state) => state);
  const {
    categoriesAndSubcategories,
    productsBySubCategoryId,
    productsByCategoryId,
    currentIPv4,
  } = state;
  const [IsLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const [SubCategoryName, setSubCategoryName] = useState("");
  const [CategoryName, setCategoryName] = useState("");
  useEffect(() => {
    setCategoryAndSubCategory(
      categoriesAndSubcategories.categoriesAndSubCategories
    );

    if (Mode === "subcategory") {
      SetMode("subcategory");
      dispatch(
        getProductsBySubCategoryId(
          id,
          paginate.limit,
          paginate.offset,
          paginate.sort,
          1,
          paginate.searchType,
          paginate.search
        )
      );
      if (productsBySubCategoryId.loading) {
        setProducts([]);
        setIsLoading(true);
        setSubCategoryName("");
        setTotalRecords(1);
      } else if (productsBySubCategoryId.data.Product) {
        setProducts(productsBySubCategoryId.data.Product);
        setIsLoading(false);
        setSubCategoryName(productsBySubCategoryId.data.SubCategory);
        setTotalRecords(productsBySubCategoryId.data.total_records);
      } else {
        // firetoast(productsBySubCategoryId.error, "default-error");
        setProducts([]);
        setIsLoading(false);
        setSubCategoryName("");
      }
    }
    if (Mode === "category") {
      SetMode("category");
      dispatch(
        getProductsByCategoryId(
          id,
          paginate.limit,
          paginate.offset,
          paginate.sort,
          0,
          paginate.searchType,
          paginate.search
        )
      );
      if (productsByCategoryId.loading) {
        setProducts([]);
        setIsLoading(true);
        setCategoryName("");
        setTotalRecords(1);
      } else if (productsByCategoryId.data.Product) {
        setProducts(productsByCategoryId.data.Product);
        setIsLoading(false);
        setCategoryName(productsByCategoryId.data.Category);
        setTotalRecords(productsByCategoryId.data.total_records);
      } else {
        // firetoast(productsByCategoryId.error, "default-error");
        setProducts([]);
        setIsLoading(false);
        setCategoryName("");
        setTotalRecords(1);
      }
    }
  }, [categoriesAndSubcategories, dispatch, , mode, id]);
  useEffect(() => {
    if (Mode === "subcategory") {
      SetMode("subcategory");
      if (productsBySubCategoryId.loading) {
        setProducts([]);
        setIsLoading(true);
        setSubCategoryName("");
      } else if (productsBySubCategoryId.data.Product) {
        setProducts(productsBySubCategoryId.data.Product);
        setIsLoading(false);
        setSubCategoryName(productsBySubCategoryId.data.SubCategory);
      } else {
        // firetoast(productsBySubCategoryId.error, "default-error");
        setProducts([]);
        setIsLoading(false);
        setSubCategoryName("");
      }
    }
    if (Mode === "category") {
      SetMode("category");
      if (productsByCategoryId.loading) {
        setProducts([]);
        setIsLoading(true);
        setCategoryName("");
      } else if (productsByCategoryId.data.Product) {
        setProducts(productsByCategoryId.data.Product);
        setIsLoading(false);
        setCategoryName(productsByCategoryId.data.Category);
      } else {
        // firetoast(productsByCategoryId.error, "default-error");
        setProducts([]);
        setIsLoading(false);
        setCategoryName("");
      }
    }
  }, [IsLoading, productsBySubCategoryId, productsByCategoryId, , mode, id]);

  let getPages = () => {
    let count = totalRecords / paginate.limit;
    if (count === 0) {
      return (
        <li className="page-item ">
          <Link
            className="page-link paginate-item active"
            to="#"
            onClick={() => {
              var page = { ...paginate };
              page.offset = 0;
              setPaginate(page);
              if (mode === "subcategory") {
                dispatch(
                  getProductsBySubCategoryId(
                    id,
                    paginate.limit,
                    paginate.offset,
                    paginate.sort,
                    paginate.status,
                    paginate.searchType,
                    paginate.search
                  )
                );
              } else {
                dispatch(
                  getProductsByCategoryId(
                    id,
                    paginate.limit,
                    paginate.offset,
                    paginate.sort,
                    paginate.status,
                    paginate.searchType,
                    paginate.search
                  )
                );
              }
            }}
          >
            1
          </Link>
        </li>
      );
    }
    for (let i = 0; i < count; i++) {
      return (
        <li className="page-item">
          <Link
            className={`page-link paginate-item ${
              paginate.offset === i ? "active" : ""
            }`}
            to="#"
            onClick={() => {
              var page = { ...paginate };
              page.offset = i;
              setPaginate(page);
              if (mode === "subcategory") {
                dispatch(
                  getProductsBySubCategoryId(
                    id,
                    paginate.limit,
                    paginate.offset,
                    paginate.sort,
                    paginate.status,
                    paginate.searchType,
                    paginate.search
                  )
                );
              } else {
                dispatch(
                  getProductsByCategoryId(
                    id,
                    paginate.limit,
                    paginate.offset,
                    paginate.sort,
                    paginate.status,
                    paginate.searchType,
                    paginate.search
                  )
                );
              }
            }}
          >
            {i + 1}
          </Link>
        </li>
      );
    }
  };
  var paginateData = (goTo) => {
    console.log("called");
    var offset = paginate.offset + 1;
    var numOfPages = Math.ceil(totalRecords / paginate.limit);
    console.log(offset, numOfPages);
    if (goTo === "next") {
      if (offset < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        setPaginate(paginate);
        if (mode === "subcategory") {
          dispatch(
            getProductsBySubCategoryId(
              id,
              paginate.limit,
              paginate.offset,
              paginate.sort,
              paginate.status,
              paginate.searchType,
              paginate.search
            )
          );
        } else {
          dispatch(
            getProductsByCategoryId(
              id,
              paginate.limit,
              paginate.offset,
              paginate.sort,
              paginate.status,
              paginate.searchType,
              paginate.search
            )
          );
        }
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        if (mode === "subcategory") {
          dispatch(
            getProductsBySubCategoryId(
              id,
              paginate.limit,
              paginate.offset,
              paginate.sort,
              paginate.status,
              paginate.searchType,
              paginate.search
            )
          );
        } else {
          dispatch(
            getProductsByCategoryId(
              id,
              paginate.limit,
              paginate.offset,
              paginate.sort,
              paginate.status,
              paginate.searchType,
              paginate.search
            )
          );
        }
      }
    }
  };
  var handleFilters = (e) => {
    var { value } = e.target;
    var page = paginate;
    if (value === "Newest" || value === "Older") {
      page.searchType = 0;
      if (value === "Newest") {
        page.sort = "DESC";
      } else {
        page.sort = "ASC";
      }
      setPaginate(page);
      if (mode === "subcategory") {
        dispatch(
          getProductsBySubCategoryId(
            id,
            paginate.limit,
            paginate.offset,
            paginate.sort,
            paginate.status,
            paginate.searchType,
            paginate.search
          )
        );
      } else {
        dispatch(
          getProductsByCategoryId(
            id,
            paginate.limit,
            paginate.offset,
            paginate.sort,
            paginate.status,
            paginate.searchType,
            paginate.search
          )
        );
      }
    } else if (value === "MostPopular") {
      page.searchType = 1;
      setPaginate(page);
      if (mode === "subcategory") {
        dispatch(
          getProductsBySubCategoryId(
            id,
            paginate.limit,
            paginate.offset,
            paginate.sort,
            paginate.status,
            paginate.searchType,
            paginate.search
          )
        );
      } else {
        dispatch(
          getProductsByCategoryId(
            id,
            paginate.limit,
            paginate.offset,
            paginate.sort,
            paginate.status,
            paginate.searchType,
            paginate.search
          )
        );
      }
    } else if (value === "TopRated") {
      page.searchType = 2;
      setPaginate(page);
      if (mode === "subcategory") {
        dispatch(
          getProductsBySubCategoryId(
            id,
            paginate.limit,
            paginate.offset,
            paginate.sort,
            paginate.status,
            paginate.searchType,
            paginate.search
          )
        );
      } else {
        dispatch(
          getProductsByCategoryId(
            id,
            paginate.limit,
            paginate.offset,
            paginate.sort,
            paginate.status,
            paginate.searchType,
            paginate.search
          )
        );
      }
    }
  };
  return (
    <>
      <WebsiteHeader />
      <div className="container">
        <>
          <div className="pt-2 pb-0">
            {/*  <Breadcrumb listTag="div">
                <BreadcrumbItem
                  href="/"
                  tag="a"
                  className="td-none"
                  style={{ color: "#B1B1B1" }}
                >
                  Home
                </BreadcrumbItem>
                <BreadcrumbItem
                  href="#"
                  tag="a"
                  className="td-none"
                  style={{ color: "#787878" }}
                >
                  Category
                </BreadcrumbItem>
                <BreadcrumbItem
                  href="#"
                  tag="a"
                  className="td-none"
                  style={{ color: "#787878" }}
                >
                  Product
                </BreadcrumbItem>
              </Breadcrumb> */}
          </div>

          <div className="row mt-5">
            <div className="col-3 mt-4">
              <div className="d-flex justify-content-between">
                <h5>Shop by Categories</h5>
                <Link
                  to="#"
                  className="td-none "
                  onClick={() => setCollapse(!collapse)}
                >
                  <i className="fas fa-minus text-dark"></i>
                </Link>
              </div>
              <Collapse isOpen={!collapse}>
                {CategoryAndSubCategory.map((Category, index) => (
                  <div className="mt-2">
                    <Link
                      to={`/search-products/category/${Category.CategoryDetails.CategoryID}`}
                      key={index}
                      className="td-none text-secondary"
                      style={{ fontSize: "14px" }}
                      // onClick={() => {
                      //   dispatch(
                      //     getProductsByCategoryId(
                      //       Category.CategoryDetails.CategoryID,
                      //       paginate.limit,
                      //       paginate.offset,
                      //       paginate.sort
                      //     )
                      //   );
                      // }}
                    >
                      {Category.CategoryDetails.Category}
                    </Link>
                  </div>
                ))}
              </Collapse>
            </div>
            <div className="col-xl-9 col-md-9 col-sm-12 mt-3 m-auto">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="ftw-400 pb-3">
                  {Mode === "subcategory" && SubCategoryName}
                  {Mode === "category" && CategoryName}
                </h4>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div className="w-50">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter product name"
                      aria-label="Recipient's username"
                      onChange={(e) => {
                        var page = paginate;
                        page.search = e.target.value;
                        setPaginate(page);
                      }}
                    />
                    <div
                      className="input-group-append"
                      onClick={() => {
                        if (mode === "subcategory") {
                          dispatch(
                            getProductsBySubCategoryId(
                              id,
                              paginate.limit,
                              paginate.offset,
                              paginate.sort,
                              paginate.status,
                              paginate.searchType,
                              paginate.search
                            )
                          );
                        } else {
                          dispatch(
                            getProductsByCategoryId(
                              id,
                              paginate.limit,
                              paginate.offset,
                              paginate.sort,
                              paginate.status,
                              paginate.searchType,
                              paginate.search
                            )
                          );
                        }
                      }}
                    >
                      <span
                        className="input-group-text"
                        id="basic-addon2"
                        style={{
                          borderRadius: "50%",
                          padding: "10px",
                          background: "#6f9642",
                          color: "white",
                          marginLeft: "10px",
                          cursor: "pointer",
                        }}
                      >
                        <i className="fas fa-search"></i>
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <select
                    className="form-control"
                    onChange={(e) => handleFilters(e)}
                  >
                    <option value={"Newest"}>Newest</option>
                    <option value={"Older"}>Older</option>
                    <option value={"MostPopular"}>Most Popular</option>
                    <option value={"TopRated"}>Top Rated</option>
                  </select>
                </div>
              </div>
              {IsLoading ? (
                <Loading text="Getting Products" />
              ) : Products.length > 0 ? (
                <>
                  <div
                    className="row"
                    // style={{ height: "100vh", marginTop: "10px" }}
                  >
                    {Products.map((item, index) => (
                      <div
                        className="col-xl-3 col-lg-3 col-md-4 col-sm-6"
                        key={index}
                      >
                        <ProductImage item={item} type="general" />
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination justify-content-center">
                        <li className="page-item">
                          <Link
                            className="page-link paginate-prev"
                            to="#"
                            tabindex="-1"
                            onClick={() => paginateData("previous")}
                          >
                            <i className="fas fa-chevron-left"></i>
                          </Link>
                        </li>
                        {getPages()}
                        <li className="page-item ">
                          <Link
                            className="page-link paginate-next"
                            to="#"
                            onClick={() => paginateData("next")}
                          >
                            <i className="fas fa-chevron-right"></i>
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </>
              ) : (
                <div className="text-center mt-5">
                  <img src={NoData} className="img-fluid" />
                  <h4 className="text-default mt-3">No Products Found</h4>
                </div>
              )}
            </div>
          </div>
        </>
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}

export default SearchedProducts;
