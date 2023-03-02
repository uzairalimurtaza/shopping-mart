import { Footer } from "./Layout/Footer";
import { WebsiteHeader } from "./Layout/Header";
import { NewsLetter } from "./Layout/NewsLetter";
import { Link, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import firetoast from "../../../Helpers/FireToast";
import Loading from "../../../Utils/Loading";
import Clean from "../../../assets/images/clean.svg";
import RatingStars from "../../../Helpers/RatingStars";
import RemoveItemFromWishList from "./../../Api/RemoveItemFromWishList";
import Endpoint from "../../../Utils/Endpoint";
import { CurrentUser } from "../../../Helpers/Auth";
function Wishlist() {
  const [Products, setProducts] = useState([]);
  const state = useSelector((state) => state.userWishList);
  const history = useHistory();
  useEffect(() => {
    if (!CurrentUser) {
      history.push("/");
    }
    if (!state.loading) {
      if (state.error) {
        firetoast("Something went wrong!", "default-error");
      } else {
        setProducts(state.data.userWishList);
      }
    }
  }, [state]);

  var removeFromWishlist = async (id, index) => {
    if (RemoveItemFromWishList(id)) {
      var array = [...Products];
      array.splice(index, 1);
      console.log(array);
      setProducts(array);
    } else {
      firetoast("Something went wrong", "default-error");
    }
  };
  return (
    <>
      <WebsiteHeader />

      <div className="container">
        <>
          {/* <div className="pt-2 pb-0">
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
            href="#"
            tag="a"
            className="td-none"
            style={{ color: "#787878" }}
          >
            Shopping Cart
          </BreadcrumbItem>
        </Breadcrumb>
      </div> */}
        </>
        <div className="mt-4">
          <h4 className="text-default">My Wishlist</h4>
          <div className="row">
            {state.loading ? (
              <Loading text="Getting Data..." />
            ) : (
              <div className="col-10">
                {" "}
                <div className="mt-5 table-responsive">
                  {Products.length > 0 ? (
                    <div className="row m-0">
                      {Products.map((item, index) => (
                        <div
                          className="col-4 d-flex justify-content-between align-items-center p-2"
                          style={{ border: "1px solid rgb(120 120 120 / 17%)" }}
                        >
                          <div className="d-flex">
                            <div>
                              <img
                                src={`${Endpoint}/${item.Small}`}
                                className="img-fluid"
                                style={{ height: "75px" }}
                              />
                            </div>
                            <div>
                              <div className="mt-2">
                                <div>
                                  <Link
                                    to={`/product-details/${item.ProductID}`}
                                    className="td-none text-default"
                                  >
                                    {item.Title}
                                  </Link>
                                </div>
                                <p></p>
                                <div>
                                  {" "}
                                  {RatingStars(
                                    item.AVG_RATING ? item.AVG_RATING : 0
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Link
                              className="text-danger p-1 "
                              onClick={() =>
                                removeFromWishlist(item.ProductID, index)
                              }
                              to="#"
                            >
                              <i className="fas fa-minus-circle"></i>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="text-center mt-5">
                        <img
                          src={Clean}
                          className="img-fluid"
                          style={{ height: "200px" }}
                        />
                        <div
                          className="text-default mt-3"
                          style={{ fontSize: "24px" }}
                        >
                          Nothing in your whishlist
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <NewsLetter />
      <Footer />
    </>
  );
}
export default Wishlist;
