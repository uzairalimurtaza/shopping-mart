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
import RatingStars from "./../../../../Helpers/RatingStars";
import ProductImage from "./../../../../Utils/ProductImage";

function GlobalSearchedProducts() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const keyword = location.search.substring(location.search.indexOf("=") + 1);
  const state = useSelector((state) => state);
  const { categoryId } = useParams();
  const [collapse, setCollapse] = useState(false);
  const [totalRecords, setTotalRecords] = useState(1);

  const [paginate, setPaginate] = useState({
    limit: 8,
    offset: 0,
    sort: "DESC",
    searchType: 1,
  });
  const [CategoryAndSubCategory, setCategoryAndSubCategory] = useState([]);
  const [Products, setProducts] = useState([]);
  const { categoriesAndSubcategories, productsByGlobalSearch, currentIPv4 } =
    state;
  const [IsLoading, setIsLoading] = useState(true);
  const [pageLimit, setPageLimit] = useState(0);
  useEffect(() => {
    setCategoryAndSubCategory(
      categoriesAndSubcategories.categoriesAndSubCategories
    );
    dispatch(
      getProductsByGlobalSearch(
        categoryId === "All" ? "" : categoryId,
        keyword,
        paginate.limit,
        paginate.offset,
        paginate.searchType,
        keyword
      )
    );
    if (productsByGlobalSearch.loading) {
      setProducts([]);
      setIsLoading(true);
      setTotalRecords(1);
    } else if (productsByGlobalSearch.data.Product) {
      setProducts(productsByGlobalSearch.data.Product);
      setIsLoading(false);
      setTotalRecords(productsByGlobalSearch.data.total_records);
      setPageLimit(
        Math.ceil(productsByGlobalSearch.data.total_records / paginate.limit)
      );
    } else {
      setProducts([]);
      setTotalRecords(1);
      setIsLoading(false);
    }
  }, [categoriesAndSubcategories, dispatch, categoryId, keyword]);

  useEffect(() => {
    if (productsByGlobalSearch.loading) {
      setProducts([]);
      setIsLoading(true);
      setTotalRecords(1);
    } else if (productsByGlobalSearch.data.Product) {
      setProducts(productsByGlobalSearch.data.Product);
      setIsLoading(false);
      setTotalRecords(productsByGlobalSearch.data.total_records);
      setPageLimit(
        Math.ceil(productsByGlobalSearch.data.total_records / paginate.limit)
      );
    } else {
      setProducts([]);
      setIsLoading(false);
      setTotalRecords(1);
    }
  }, [
    categoriesAndSubcategories,
    productsByGlobalSearch,
    dispatch,
    categoryId,
    keyword,
  ]);
  let getPages = () => {
    let count = Math.ceil(totalRecords / paginate.limit);
    console.log(count);
    if (count === 0) {
      return [
        <li className="page-item">
          <Link
            className="page-link paginate-item active"
            to="#"
            onClick={() => {
              var page = { ...paginate };
              page.offset = 0;
              setPaginate(page);
              dispatch(
                getProductsByGlobalSearch(
                  categoryId === "All" ? "" : categoryId,
                  keyword,
                  paginate.limit,
                  paginate.offset,
                  paginate.searchType,
                  keyword
                )
              );
            }}
          >
            1
          </Link>
        </li>,
      ];
    }
    var temp = [];
    for (let i = 0; i < count; i++) {
      temp.push(
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
              dispatch(
                getProductsByGlobalSearch(
                  categoryId === "All" ? "" : categoryId,
                  keyword,
                  paginate.limit,
                  paginate.offset,
                  paginate.searchType,
                  keyword
                )
              );
            }}
          >
            {i + 1}
          </Link>
        </li>
      );
    }
    return temp;
  };
  var paginateData = (goTo) => {
    console.log("called");
    var offset = paginate.offset + 1;
    var numOfPages = Math.ceil(totalRecords / offset);
    console.log(offset, numOfPages);
    if (goTo === "next") {
      if (offset < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        setPaginate(paginate);
        dispatch(
          getProductsByGlobalSearch(
            categoryId === "All" ? "" : categoryId,
            keyword,
            paginate.limit,
            paginate.offset,
            paginate.searchType,
            keyword
          )
        );
      }
    } else if (goTo === "previous") {
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        dispatch(
          getProductsByGlobalSearch(
            categoryId === "All" ? "" : categoryId,
            keyword,
            paginate.limit,
            paginate.offset,
            paginate.searchType,
            keyword
          )
        );
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
      dispatch(
        getProductsByGlobalSearch(
          categoryId === "All" ? "" : categoryId,
          keyword,
          paginate.limit,
          paginate.offset,
          paginate.searchType,
          keyword
        )
      );
    } else if (value === "MostPopular") {
      page.searchType = 1;
      setPaginate(page);
      dispatch(
        getProductsByGlobalSearch(
          categoryId === "All" ? "" : categoryId,
          keyword,
          paginate.limit,
          paginate.offset,
          paginate.searchType,
          keyword
        )
      );
    } else if (value === "TopRated") {
      page.searchType = 2;
      setPaginate(page);
      dispatch(
        getProductsByGlobalSearch(
          categoryId === "All" ? "" : categoryId,
          keyword,
          paginate.limit,
          paginate.offset,
          paginate.searchType,
          keyword
        )
      );
    }
  };
  return (
    <>
      <WebsiteHeader />
      <div className="container">
        <>
          <div className="row mt-5">
            <div className="col-3 mt-4">
              <div className="d-flex justify-content-between">
                <h5>Shop by Categories</h5>
                {collapse ? (
                  <Link
                    to="#"
                    className="td-none "
                    onClick={() => setCollapse(!collapse)}
                  >
                    <i className="fas fa-minus text-dark"></i>
                  </Link>
                ) : (
                  <Link
                    to="#"
                    className="td-none "
                    onClick={() => setCollapse(!collapse)}
                  >
                    <i className="fas fa-plus text-dark"></i>
                  </Link>
                )}
              </div>
              <Collapse isOpen={collapse}>
                {CategoryAndSubCategory.map((Category, index) => (
                  <div className="mt-3">
                    <Link
                      to={`/search-products/category/${Category.CategoryDetails.CategoryID}`}
                      key={index}
                      className="td-none text-secondary"
                      style={{ fontSize: "14px" }}
                    >
                      {Category.CategoryDetails.Category}
                    </Link>
                  </div>
                ))}
              </Collapse>
            </div>
            <div className="col-xl-9 col-md-9 col-sm-12 mt-3 m-auto">
              <h4 className="ftw-400 pb-3">Search Result</h4>
              <div className="d-flex justify-content-between align-items-center">
                <div className="w-50"></div>
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
                  <div className="row">
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
                      {/* {getPages().map((item, index) => item)} */}
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

export default GlobalSearchedProducts;
