import React, { useState, useEffect } from "react";
import { WebsiteHeader } from "./../Layout/Header";
import { NewsLetter } from "./../Layout/NewsLetter";
import { Footer } from "./../Layout/Footer";
import { Collapse } from "reactstrap";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getProductsByGlobalSearch } from "./../../../../Actions/ProductsAction";
import Loading from "./../../../../Utils/Loading";
import NoData from "../../../../assets/images/no-product.png";
import Endpoint from "./../../../../Utils/Endpoint";
import AddProductClick from "./../../../../Helpers/AddProductClick";
import firetoast from "./../../../../Helpers/FireToast";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import RatingStars from "./../../../../Helpers/RatingStars";
import ProductImage from "./../../../../Utils/ProductImage";

function ViewMoreTrendingProducts() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const keyword = location.search.substring(location.search.indexOf("=") + 1);
  const state = useSelector((state) => state);
  const { categoryId } = useParams();
  const [collapse, setCollapse] = useState(true);
  const [totalRecords, setTotalRecords] = useState(1);
  const [CategoryAndSubCategory, setCategoryAndSubCategory] = useState([]);

  const [paginate, setPaginate] = useState({
    limit: 8,
    offset: 0,
    sort: "DESC",
    searchType: 1,
    search: "",
  });
  const [Products, setProducts] = useState([]);
  const { currentIPv4, categoriesAndSubcategories } = state;
  const [IsLoading, setIsLoading] = useState(true);
  const [pageLimit, setPageLimit] = useState(0);

  useEffect(() => {
    setCategoryAndSubCategory(
      categoriesAndSubcategories.categoriesAndSubCategories
    );
    getData();
  }, []);
  let getPages = () => {
    let count = Math.floor(totalRecords / paginate.limit);
    console.log(count);
    if (count === 0) {
      return (
        <li className="page-item">
          <Link
            className="page-link paginate-item active"
            to="#"
            onClick={() => {
              var page = { ...paginate };
              page.offset = 0;
              setPaginate(page);
              getData();
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
              getData();
            }}
          >
            {i + 1}
          </Link>
        </li>
      );
    }
  };
  var getData = async () => {
    try {
      var form = new URLSearchParams();
      form.append("limit", paginate.limit);
      form.append("offset", paginate.offset);
      form.append("Country", currentIPv4.IP.country_name);
      form.append("search", paginate.search);
      form.append("sort", paginate.sort);
      const response = await BanglaBazarApi.post(
        `${Endpoint}/api/landing-page/trendingForyouProducts`,
        form
      );
      if (response.data.status) {
        setProducts(response.data.trendingForYouProducts);
        setIsLoading(false);
        setPageLimit(Math.ceil(response.data.total_records / paginate.limit));
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      setIsLoading(false);
      firetoast(
        "Something went wrong while fetching products",
        "default-error"
      );
    }
  };
  var paginateData = (goTo) => {
    // console.log("called");
    // var offset = paginate.offset + 1;
    // var numOfPages = Math.ceil(totalRecords / offset);
    // console.log(offset, numOfPages);
    if (goTo === "next") {
      // if (offset < numOfPages) {
      // console.log(offset, numOfPages);
      paginate.offset = paginate.offset + 1;
      setPaginate(paginate);
      getData();
      // }
    } else if (goTo === "previous") {
      // if (paginate.offset > 0) {
      paginate.offset = paginate.offset - 1;
      // //co(nsole.log(paginate)
      setPaginate(paginate);
      getData();
      // }
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
      getData();
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
              <Collapse isOpen={collapse}>
                {CategoryAndSubCategory.map((Category, index) => (
                  <div className="mt-3">
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
              <h4 className="ftw-400 pb-3">Trending Products</h4>
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
                      onClick={() => getData()}
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
                  <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                      <li className="page-item">
                        <Link
                          className="page-link paginate-prev"
                          to="#"
                          tabindex="-1"
                          onClick={() => {
                            if (paginate.offset > 0) {
                              paginateData("previous");
                            }
                          }}
                        >
                          <i className="fas fa-chevron-left"></i>
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link
                          className={`page-link paginate-item active`}
                          to="#"
                        >
                          {paginate.offset + 1}
                        </Link>
                      </li>
                      <li className="page-item">
                        <Link
                          className="page-link paginate-next"
                          to="#"
                          onClick={() => {
                            console.log(pageLimit - (paginate.offset + 1));
                            if (pageLimit - (paginate.offset + 1) >= 1) {
                              paginateData("next");
                            }
                          }}
                        >
                          <i className="fas fa-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                  </nav>
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

export default ViewMoreTrendingProducts;
