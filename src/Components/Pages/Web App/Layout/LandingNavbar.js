import {
  Col,
  Container,
  Row,
  List,
  ListInlineItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
} from "reactstrap";
import logo from "../../../../assets/images/logo.png";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import firetoast from "../../../../Helpers/FireToast";
import { CurrentUser } from "../../../../Helpers/Auth";
import MyCart from "./MyCart";

function LandingNavbar() {
  const history = useHistory();
  const [SelectedCategory, setSelectedCategory] = useState({
    Category: "All",
    CategoryID: "All",
  });
  const [SearchInput, setSearchInput] = useState("");
  const state = useSelector((state) => state);
  const { categoriesAndSubcategories } = state;

  const [CategoryAndSubCategory, setCategoryAndSubCategory] = useState([]);
  useEffect(() => {
    if (categoriesAndSubcategories.error) {
      firetoast(categoriesAndSubcategories.error, "default-error");
      setCategoryAndSubCategory([]);
    } else {
      setCategoryAndSubCategory(
        categoriesAndSubcategories.categoriesAndSubCategories
      );
    }
  }, [categoriesAndSubcategories]);
  return (
    <div className="l-nav container">
      <Row style={{ marginTop: "25px" }} className="m-0">
        <Col
          xl={2}
          lg={2}
          md={12}
          style={{ marginTop: "17px" }}
          className="d-none d-sm-none d-xs-none d-lg-block d-xl-block"
        >
          <img
            src={logo}
            className="img-fluid logo"
            onClick={() => history.push("/")}
            style={{ cursor: "pointer" }}
          />
        </Col>
        <div
          className="col-12 d-xs-block  
          d-sm-block d-lg-none d-md-none mt-2"
          style={{
            border: "1px solid #b1b1b1 ",
            borderRadius: "5px",
          }}
        >
          <UncontrolledDropdown>
            <DropdownToggle
              className="bg-white text-secondary btn-block btn-ln-search-cat"
              style={{ width: "100%" }}
            >
              {SelectedCategory.Category === "All"
                ? "Categories"
                : SelectedCategory.Category}
              <i
                className="fas fa-chevron-down price-chevron"
                style={{ marginLeft: "10px" }}
              ></i>
            </DropdownToggle>
            <DropdownMenu style={{ width: "auto" }}>
              <DropdownItem
                onClick={() =>
                  setSelectedCategory({
                    Category: "All",
                    CategoryID: "All",
                  })
                }
              >
                All
              </DropdownItem>
              {CategoryAndSubCategory.map((Category, index) => (
                <DropdownItem
                  key={index}
                  onClick={() => setSelectedCategory(Category.CategoryDetails)}
                >
                  {Category.CategoryDetails.Category}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
        <Col xl={8} lg={7} md={8} style={{ paddingTop: "17px" }}>
          <div className="row search-nav">
            <div
              className="col-xl-12 col-lg-12 col-md-12 col-sm-12"
              style={{ paddingRight: "0px" }}
            >
              <InputGroup>
                <InputGroupAddon
                  addonType="append"
                  className="d-none d-lg-block d-md-block search-addon"
                >
                  <UncontrolledDropdown>
                    <DropdownToggle
                      className="bg-white text-secondary btn-block btn-ln-search-cat"
                      style={{ width: "100%" }}
                    >
                      {SelectedCategory === "All"
                        ? "Categories"
                        : SelectedCategory.Category}
                      <i
                        className="fas fa-chevron-down price-chevron"
                        style={{ marginLeft: "10px" }}
                      ></i>
                    </DropdownToggle>
                    <DropdownMenu style={{ width: "auto" }}>
                      <DropdownItem
                        onClick={() =>
                          setSelectedCategory({
                            Category: "All",
                            CategoryID: "All",
                          })
                        }
                      >
                        All
                      </DropdownItem>
                      {CategoryAndSubCategory.map((Category, index) => (
                        <DropdownItem
                          key={index}
                          onClick={() =>
                            setSelectedCategory(Category.CategoryDetails)
                          }
                        >
                          {Category.CategoryDetails.Category}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </InputGroupAddon>
                <span
                  className="lt-divider d-none d-lg-block d-md-block"
                  style={{ marginTop: "5px", borderLeft: "3px solid" }}
                ></span>
                <Input
                  className="nav-search"
                  placeholder="Search ..."
                  onChange={(e) => setSearchInput(e.target.value)}
                />
                <InputGroupAddon addonType="append" className="search-addon">
                  <button
                    className="bt-default-nav-search"
                    onClick={() => {
                      if (CheckEmpty(SearchInput)) {
                        history.push(
                          `/search/global/products/${SelectedCategory.CategoryID}?keyword=`
                        );
                      } else {
                        history.push(
                          `/search/global/products/${SelectedCategory.CategoryID}?keyword=${SearchInput}`
                        );
                      }
                    }}
                  >
                    <i className="fas fa-search"></i>
                  </button>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>
        </Col>
        <Col xl={2} lg={3} md={4}>
          <List type="inline" className="lt-un">
            <ListInlineItem
              style={{
                marginLeft: "5px",
                marginRight: "5px",
                cursor: "pointer",
              }}
              onClick={() => {
                if (CurrentUser) {
                  history.push("/my-wishlist");
                } else {
                  firetoast(
                    "Login first to view your wishlist",
                    "info",
                    5000,
                    "top-center"
                  );
                }
              }}
            >
              <div className="ln-text text-center ">
                <div>
                  {" "}
                  <i className="far fa-heart text-secondary"></i>
                </div>
                <div style={{ fontSize: "12px" }}>Wishlist</div>
              </div>
            </ListInlineItem>
            <span className="lt-divider"></span>
            <ListInlineItem>
              <MyCart />
            </ListInlineItem>
          </List>
        </Col>
      </Row>
    </div>
  );
}
export default LandingNavbar;
