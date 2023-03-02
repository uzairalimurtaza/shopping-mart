import NoData from "../../../../assets/images/no-product.png";
import Loading from "./../../../../Utils/Loading";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AddProductClick from "./../../../../Helpers/AddProductClick";
import { useSelector, useDispatch } from "react-redux";
import { WebsiteHeader } from "./Header";
import { Footer } from "./Footer";
import { NewsLetter } from "./NewsLetter";
import Endpoint from "./../../../../Utils/Endpoint";
import { CurrentUser } from "./../../../../Helpers/Auth";
import { viewMoreRecentlyViewed } from "./../../../../Actions/ProductsAction";
import RatingStars from "./../../../../Helpers/RatingStars";
import firetoast from "./../../../../Helpers/FireToast";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import ProductImage from "./../../../../Utils/ProductImage";
function MoreRecentViewed() {
  const history = useHistory();
  const [IsLoading, setIsLoading] = useState(true);
  const [Products, setProducts] = useState([]);
  const [totalRecords, setTotalRecords] = useState(1);
  const [paginate, setPaginate] = useState({
    limit: 10,
    offset: 0,
    sort: "DESC",
    search: "",
    status: 0,
    searchType: 0,
  });
  const state = useSelector((state) => state);
  const { currentIPv4 } = state;
  useEffect(() => {
    if (CurrentUser) {
      getData();
    } else {
      let localBrowsing = localStorage.getItem("uBH");
      if (localBrowsing && JSON.parse(localBrowsing).length > 0) {
        setProducts(JSON.parse(localBrowsing));
      } else {
        setProducts([]);
      }
      setIsLoading(false);
    }
  }, []);
  let getData = async () => {
    try {
      var form = new URLSearchParams();
      form.append("limit", paginate.limit);
      form.append("offset", paginate.offset);
      form.append("UserID", CurrentUser.UserID);
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/landing-page/recenltyViewedProducts`,
        form
      );
      if (response.data.status) {
        setProducts(response.data.recentlyViewedProducts);
        setIsLoading(false);
      }
    } catch (e) {
      setIsLoading(false);
      firetoast("Something went wrong while fetching data", "default-error");
    }
  };

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
  var paginateData = (goTo) => {
    console.log("called");
    var offset = paginate.offset + 1;
    var numOfPages = Math.ceil(totalRecords / offset);
    console.log(offset, numOfPages);
    if (goTo === "next") {
      if (offset < numOfPages) {
        console.log(offset, numOfPages);
        paginate.offset = paginate.offset + 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getData();
      }
    } else if (goTo === "previous") {
      //console.log("previous");
      if (paginate.offset > 0) {
        paginate.offset = paginate.offset - 1;
        // //console.log(paginate)
        setPaginate(paginate);
        getData();
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
            <div className="col-xl-10 col-md-9 col-sm-12 mt-3 m-auto">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="ftw-400 pb-3">Recently Viewed</h4>
              </div>

              {IsLoading ? (
                <Loading text="Getting Products" />
              ) : Products.length > 0 ? (
                <>
                  <div
                    className="row"
                    style={{ height: "100vh", marginTop: "10px" }}
                  >
                    {Products.map((item, index) => (
                      <div
                        className="col-xl-3 col-lg-3 col-md-4 col-sm-6"
                        key={index}
                      >
                        <ProductImage item={item} type="recent" />
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
export default MoreRecentViewed;
