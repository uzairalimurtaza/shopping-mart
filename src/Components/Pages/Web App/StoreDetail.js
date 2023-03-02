import { WebsiteHeader } from "./Layout/Header";
import StoreBg from "../../../assets/images/store-profile-bg.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
  TabContent,
  TabPane,
  Collapse,
  List,
} from "reactstrap";
import { Link } from "react-router-dom";
import { NewsLetter } from "./Layout/NewsLetter";
import { Footer } from "./Layout/Footer";
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import Endpoint from "./../../../Utils/Endpoint";
import axios from "axios";
import firetoast from "./../../../Helpers/FireToast";
import Loading from "../../../Utils/Loading";
import BanglaBazarApi from "./../../Api/BanglaBazarApi";
import StoreProductList from "./Store Detail Components/StoreProductsList";
import { STORE_DETAIL_CONTEXT } from "./../../Contexts/StoreDetailContext";
import CategoryCollapse from "./Store Detail Components/CategoryCollapse";
import { useSelector } from "react-redux";
import RatingStars from "./../../../Helpers/RatingStars";
import ContactVendorCollapse from "./Store Detail Components/ContactVendorCollapse.js";
import SDTopRatedProducts from "./Store Detail Components/SDTopRatedProducts";
function StoreDetail() {
  useContext(STORE_DETAIL_CONTEXT);
  const state = useSelector((state) => state);
  const { categoriesAndSubcategories } = state;
  const [CategoryAndSubCategory, setCategoryAndSubCategory] = useState([]);
  const [tab, setTab] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [Business, setBusiness] = useState(null);
  const [Store, setStore] = useState(null);
  const [Products, setProducts] = useState([]);
  const [ProductReviewCount, setProductReviewCount] = useState(0);
  const [paginate, setPaginate] = useState({
    offset: 0,
    limit: 8,
    sort: "DESC",
    search: "",
  });
  const [totalRecords, setTotalRecords] = useState(0);
  var { name } = useParams();
  name = name.split("_").join(" ");
  useEffect(async () => {
    await getVendorBusiness();

    setCategoryAndSubCategory(
      categoriesAndSubcategories.categoriesAndSubCategories
    );
  }, [categoriesAndSubcategories]);
  var getVendorStore = async () => {
    setIsLoading(true);
    try {
      var response = await axios.get(
        Endpoint + `/api/store-management/store-detail/${name}`
      );
      if (response.data.status) {
        setStore(response.data.Store);
        await getVendorBusiness(response.data.Store.VendorID);

        setIsLoading(false);
      } else {
        setStore(null);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      firetoast("Something went wrong!", "error", 4000, "top-right");
    }
  };
  var getVendorBusiness = async () => {
    setIsLoading(true);
    var form = new URLSearchParams();
    form.append("limit", paginate.limit);
    form.append("offset", paginate.offset);
    form.append("sort", paginate.sort);
    form.append("search", paginate.search);
    try {
      var response = await BanglaBazarApi.post(
        Endpoint + `/api/store-management/buisness-detail/${name}`,
        form
      );
      if (response.data.status) {
        setBusiness(response.data.business);
        setProducts(response.data.Products);
        setTotalRecords(response.data.total_Products);
        setProductReviewCount(response.data.ProductReviewCount);
        setIsLoading(false);
      } else {
        setBusiness(null);
        setIsLoading(false);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      firetoast("Something went wrong!", "error", 4000, "top-right");
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

        getVendorBusiness();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getVendorBusiness();
      }
    }
  };
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
              getVendorBusiness();
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
              getVendorBusiness();
            }}
          >
            {i + 1}
          </Link>
        </li>
      );
    }
  };
  return (
    <STORE_DETAIL_CONTEXT.Provider value={{ Products }}>
      <WebsiteHeader />

      <div className="container">
        {isLoading ? (
          <Loading text="Loading ...." />
        ) : (
          <>
            <div className="pt-2 pb-0">
              <Breadcrumb listTag="div">
                <BreadcrumbItem
                  href="/"
                  tag="a"
                  className="td-none"
                  style={{ color: "#B1B1B1" }}
                >
                  Home
                </BreadcrumbItem>
                <BreadcrumbItem
                  href="/store-detail"
                  tag="a"
                  className="td-none"
                  style={{ color: "#787878" }}
                >
                  Vendor
                </BreadcrumbItem>
              </Breadcrumb>
            </div>
            <div>
              <div className="store-bg" style={{ position: "relative" }}>
                <img
                  src={`${Endpoint}/${
                    Business.BannerImage && Business.BannerImage
                  }`}
                  className="img-fluid"
                  style={{ height: "300px", width: "100vw" }}
                />
                <div
                  className="text-center"
                  style={{ position: "absolute", top: "39%", width: "100%" }}
                >
                  <img
                    src={`${Endpoint}/${Business.CompanyLogo}`}
                    className="img-fluid store-company-logo"
                    style={{
                      height: "135px",
                      width: "135px",
                      borderRadius: "100px",
                    }}
                  />
                </div>
                <div
                  className="row bg-dark w-100 m-0"
                  style={{ padding: "10px 0px" }}
                >
                  <div
                    className="col-lg-7 col-xl-7 col-md-6"
                    style={{ position: "relative" }}
                  >
                    <div className="row ">
                      <div className="col-lg-6 col-md-8 col-sm-12 m-auto">
                        <div className="mt-1">
                          <h4 className="ftw-400 text-orange">
                            {Business.CompanyName}
                          </h4>
                          <div className=" mb-2 store-text">
                            <span style={{ marginRight: "10px" }}>
                              <i className="fas fa-map-marker-alt text-orange"></i>
                            </span>{" "}
                            {Business.Address1}
                          </div>
                          <div className=" mb-2 store-text">
                            <span style={{ marginRight: "10px" }}>
                              <i className="fas fa-phone-square-alt text-orange "></i>
                            </span>{" "}
                            {Business.BusinessPhone}
                          </div>
                          <div className=" mb-2 store-text">
                            <span style={{ marginRight: "10px" }}>
                              <i className="fas fa-envelope text-orange"></i>
                            </span>{" "}
                            {Business.BusinessEmail}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5 col-xl-5 col-md-6 col-sm-12">
                    <div className="d-flex">
                      <div
                        className="d-flex"
                        style={{ alignItems: "center", paddingTop: "10px" }}
                      >
                        <div className="avg-rating">
                          {ProductReviewCount.StoreAverageRating
                            ? parseFloat(
                                ProductReviewCount.StoreAverageRating
                              ).toFixed(2)
                            : 0.0}
                        </div>
                        <div style={{ marginLeft: "20px" }}>
                          <div>
                            <span className="dotd-rate">
                              {RatingStars(
                                parseFloat(
                                  ProductReviewCount.StoreAverageRating
                                ).toFixed(2)
                              )}
                            </span>
                          </div>
                          <div className="text-white">
                            {ProductReviewCount.TotalVendorReview} Reviews
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row mt-5">
              <div className="col-lg-3 col-xl-3 col-md-4 col-sm-12 mt-3">
                <div
                  className="d-flex justify-content-between"
                  onClick={() => setIsOpen(!isOpen)}
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #C7C7C7",
                  }}
                >
                  <h6 className="ftw-400">All Categories</h6>
                  <div>
                    {!isOpen && <i className="fas fa-plus  text-secondary"></i>}
                    {isOpen && <i className="fas fa-minus  text-secondary"></i>}
                  </div>
                </div>
                <Collapse isOpen={isOpen}>
                  <List type="unstyled" className="mt-1">
                    {CategoryAndSubCategory.map((item, index) => (
                      <li key={index}>
                        <CategoryCollapse data={item} />
                      </li>
                    ))}
                  </List>
                </Collapse>

                <ContactVendorCollapse Business={Business} />
                {/* <div
                  className="d-flex justify-content-between mt-3"
                  //   onClick={() => setIsOpen(!isOpen)}
                  style={{
                    cursor: "pointer",
                    borderBottom: "1px solid #C7C7C7",
                  }}
                >
                  <h6 className="ftw-400">Vendor On Sale Products</h6>
                  <div>{<i className="fas fa-plus  text-secondary"></i>}</div>
                </div> */}
                <SDTopRatedProducts />
              </div>
              <div className="col-lg-9 col-xl-9 col-md-8 col-sm-12 mt-3">
                <div>
                  <Nav tabs>
                    <NavItem className="store-tabItem">
                      <NavLink
                        className={tab === 1 ? "active" : ""}
                        onClick={() => setTab(1)}
                      >
                        Products
                      </NavLink>
                    </NavItem>
                    <NavItem className="store-tabItem">
                      <NavLink
                        className={tab === 2 ? "active" : ""}
                        onClick={() => setTab(2)}
                      >
                        About
                      </NavLink>
                    </NavItem>
                    <NavItem className="store-tabItem">
                      <NavLink
                        className={tab === 3 ? "active" : ""}
                        onClick={() => setTab(3)}
                      >
                        Policies
                      </NavLink>
                    </NavItem>
                    {/* <NavItem className="store-tabItem">
                      <NavLink
                        className={tab === 4 ? "active" : ""}
                        onClick={() => setTab(4)}
                      >
                        Reviews
                      </NavLink>
                    </NavItem> */}
                  </Nav>
                  <TabContent activeTab={tab} className="mt-4">
                    <TabPane tabId={1}>
                      {Products.length > 0 && (
                        <div className="row">
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="form-group row align-items-baseline">
                              <label for="staticEmail" className="col">
                                Search :
                              </label>
                              <div className="col-xl-9 col-md-10 col-sm-12 ">
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search.."
                                    value={paginate.search}
                                    onChange={(e) => {
                                      var page = { ...paginate };
                                      page.search = e.target.value;
                                      setPaginate(page);
                                    }}
                                  />
                                  <div
                                    className="input-group-append"
                                    style={{ marginLeft: "5px" }}
                                  >
                                    <span
                                      className="input-group-text"
                                      id="basic-addon2"
                                      style={{
                                        cursor: "pointer",
                                        backgroundColor: "#6f9642",
                                        color: "#fff",
                                        padding: "10px",
                                        borderRadius: "50%",
                                      }}
                                      onClick={() => getVendorBusiness()}
                                    >
                                      <i className="fas fa-search"></i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="row">
                              <div className="form-group row col-xl-8 col-md-12 col-sm-12 ml-auto align-items-baseline">
                                <label for="staticEmail" className="col">
                                  Sort by :
                                </label>
                                <div className="col-xl-8 col-md-10 col-sm-12">
                                  <select
                                    className="form-control"
                                    onChange={(e) => {
                                      var page = { ...paginate };
                                      page.sort = e.target.value;
                                      setPaginate(page);
                                      getVendorBusiness();
                                    }}
                                  >
                                    <option
                                      value={"DESC"}
                                      selected={paginate.sort === "DESC"}
                                    >
                                      Newest
                                    </option>
                                    <option
                                      value={"ASC"}
                                      selected={paginate.sort === "ASC"}
                                    >
                                      Older
                                    </option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      <StoreProductList />
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
                          <li className="page-item">
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
                    </TabPane>
                    <TabPane tabId={2}>
                      <div className="mt-3 store-about">
                        <div
                          dangerouslySetInnerHTML={{ __html: Business.About }}
                        ></div>
                      </div>
                    </TabPane>
                    <TabPane tabId={3}>
                      <Row>
                        <Col sm="12">
                          <div className="mt-3 store-policies">
                            <div
                              dangerouslySetInnerHTML={{
                                __html: Business.Policies,
                              }}
                            ></div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId={4}>
                      <Row className="mt-4">
                        <Col sm="6">
                          <h4 className="ftw-400">Customer Reviews</h4>
                          <div>
                            {" "}
                            <span className="dotd-rate">
                              <i className="fas fa-star rated-yellow"></i>
                              <i className="fas fa-star rated-yellow"></i>
                              <i className="fas fa-star rated-yellow"></i>
                              <i className="fas fa-star rated-yellow"></i>
                              <i className="fas fa-star unrated"></i>{" "}
                              <span>Based on 1500 Reviews</span>
                            </span>
                          </div>
                          <div className="mt-3">
                            <div className="d-flex mt-4">
                              <div style={{ marginRight: "5px" }}>
                                {" "}
                                5 <i className="fas fa-star rated-yellow"></i>
                              </div>{" "}
                              <div
                                className="progress"
                                style={{ width: "75%" }}
                              >
                                <div
                                  className="progress-bar bg-warning"
                                  role="progressbar"
                                  style={{ width: "63%" }}
                                  aria-valuenow="63"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>{" "}
                              <div style={{ marginLeft: "5px" }}> 63%</div>
                            </div>
                            <div className="d-flex mt-3">
                              <div style={{ marginRight: "5px" }}>
                                {" "}
                                4 <i className="fas fa-star rated-yellow"></i>
                              </div>{" "}
                              <div
                                className="progress"
                                style={{ width: "75%" }}
                              >
                                <div
                                  className="progress-bar bg-warning"
                                  role="progressbar"
                                  style={{ width: "10%" }}
                                  aria-valuenow="10"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>{" "}
                              <div style={{ marginLeft: "5px" }}> 10%</div>
                            </div>
                            <div className="d-flex mt-3">
                              <div style={{ marginRight: "5px" }}>
                                {" "}
                                3 <i className="fas fa-star rated-yellow"></i>
                              </div>{" "}
                              <div
                                className="progress"
                                style={{ width: "75%" }}
                              >
                                <div
                                  className="progress-bar bg-warning"
                                  role="progressbar"
                                  style={{ width: "6%" }}
                                  aria-valuenow="6"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>{" "}
                              <div style={{ marginLeft: "5px" }}> 6%</div>
                            </div>
                            <div className="d-flex mt-3">
                              <div style={{ marginRight: "5px" }}>
                                {" "}
                                2 <i className="fas fa-star rated-yellow"></i>
                              </div>{" "}
                              <div
                                className="progress"
                                style={{ width: "75%" }}
                              >
                                <div
                                  className="progress-bar bg-warning"
                                  role="progressbar"
                                  style={{ width: "12%" }}
                                  aria-valuenow="12"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>{" "}
                              <div style={{ marginLeft: "5px" }}> 12%</div>
                            </div>
                            <div className="d-flex mt-3">
                              <div style={{ marginRight: "5px" }}>
                                {" "}
                                1 <i className="fas fa-star rated-yellow"></i>
                              </div>{" "}
                              <div
                                className="progress"
                                style={{ width: "75%" }}
                              >
                                <div
                                  className="progress-bar bg-warning"
                                  role="progressbar"
                                  style={{ width: "9%" }}
                                  aria-valuenow="9"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                ></div>
                              </div>{" "}
                              <div style={{ marginLeft: "5px" }}> 9%</div>
                            </div>
                          </div>
                        </Col>
                        <Col sm="6">
                          <div className="d-flex justify-content-between">
                            <div>
                              <h4 className="ftw-400">Top Reviews</h4>
                            </div>
                            <div
                              className="row"
                              style={{ alignItems: "center" }}
                            >
                              <div className="col-4"> Sort by : </div>
                              <div className="col-8">
                                {" "}
                                <select className="form-control">
                                  <option>Top Reviews</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <div>
                              <div className="d-flex">
                                <div className="reviewer-img">
                                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=387&q=80" />
                                </div>
                                <div style={{ marginLeft: "20px" }}>
                                  <h6 className="ftw-400 mb-1">Emily Selman</h6>
                                  <p className="mb-1">July 16, 2021</p>
                                  <div>
                                    <span className="dotd-rate">
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star unrated"></i>{" "}
                                    </span>
                                  </div>
                                  <div className="mt-3">
                                    <p>
                                      <strong>
                                        {" "}
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua.
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="d-flex">
                                <div className="reviewer-img">
                                  <img src="https://images.unsplash.com/photo-1543984613-f55ca6a1ba35?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80" />
                                </div>
                                <div style={{ marginLeft: "20px" }}>
                                  <h6 className="ftw-400 mb-1">John Smith </h6>
                                  <p className="mb-1">July 16, 2021</p>
                                  <div>
                                    <span className="dotd-rate">
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star unrated"></i>{" "}
                                    </span>
                                  </div>
                                  <div className="mt-3">
                                    <p>
                                      <strong>
                                        {" "}
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua.
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="d-flex">
                                <div className="reviewer-img">
                                  <img src="https://images.unsplash.com/photo-1522556189639-b150ed9c4330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" />
                                </div>
                                <div style={{ marginLeft: "20px" }}>
                                  <h6 className="ftw-400 mb-1">
                                    Johnson Smith{" "}
                                  </h6>
                                  <p className="mb-1">July 16, 2021</p>
                                  <div>
                                    <span className="dotd-rate">
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star unrated"></i>{" "}
                                    </span>
                                  </div>
                                  <div className="mt-3">
                                    <p>
                                      <strong>
                                        {" "}
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua.
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="d-flex">
                                <div className="reviewer-img">
                                  <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80" />
                                </div>
                                <div style={{ marginLeft: "20px" }}>
                                  <h6 className="ftw-400 mb-1">Enna John </h6>
                                  <p className="mb-1">July 16, 2021</p>
                                  <div>
                                    <span className="dotd-rate">
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star rated-yellow"></i>
                                      <i className="fas fa-star unrated"></i>{" "}
                                    </span>
                                  </div>
                                  <div className="mt-3">
                                    <p>
                                      <strong>
                                        {" "}
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua.
                                      </strong>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </TabPane>
                  </TabContent>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <NewsLetter />
      <Footer />
    </STORE_DETAIL_CONTEXT.Provider>
  );
}
export default StoreDetail;
