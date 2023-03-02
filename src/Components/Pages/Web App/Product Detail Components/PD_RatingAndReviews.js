import { Row, Col } from "reactstrap";
import RatingStars from "./../../../../Helpers/RatingStars";
import Endpoint from "./../../../../Utils/Endpoint";
import moment from "moment";
import { useState } from "react";
import ReactStars from "react-rating-stars-component";
import firetoast from "./../../../../Helpers/FireToast";
import CheckEmpty from "./../../../../Utils/CheckEmpty";
import BanglaBazarApi from "./../../../Api/BanglaBazarApi";
import { CurrentUser } from "./../../../../Helpers/Auth";
import { useParams } from "react-router-dom";

function ProductDetailRatingAndReviews(props) {
  var { productID } = useParams();
  const [Rating, setRating] = useState(0);
  const [Review, setReview] = useState("");

  function ratingPercentage(val) {
    if (val === 0) {
      return 0;
    }
    const { rating_1, rating_2, rating_3, rating_4, rating_5 } =
      props.RatingCounts && props.RatingCounts;

    return val / (rating_1 + rating_2 + rating_3 + rating_4 + rating_5);
  }
  let CreateReview = async () => {
    if (Rating === 0) {
      return firetoast("Please add rating ", "default-error");
    }
    try {
      var form = new URLSearchParams();
      form.append("UserID", CurrentUser.UserID);
      form.append("ProductID", productID);
      form.append("Review", Review);
      form.append("Rating", Rating);
      form.append("PurchaseVerified", "Y");
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/product/addProductRating`,
        form
      );
      if (response.data.status) {
        setRating(0);
        setReview("");
        props.getProductDetails();
        return firetoast(
          "Review Added Successfully",
          "success",
          3000,
          "top-right"
        );
      } else {
        var { message, error } = response.data;
        return firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong while adding review", "default-error");
    }
  };
  return (
    props.RatingCounts && (
      <Row>
        <Col sm="12">
          <div className="mt-3 store-policies">
            <Row className="mt-4">
              <Col sm="6">
                <h4 className="ftw-400">Customer Reviews</h4>
                <div>
                  {" "}
                  <span className="dotd-rate">
                    {RatingStars(
                      props.AverageRatingAndReviews &&
                        parseInt(
                          props.AverageRatingAndReviews.ProductAverageRating
                        )
                    )}
                    <span>
                      Based on{" "}
                      {props.AverageRatingAndReviews &&
                        props.AverageRatingAndReviews.Total_Reviews}{" "}
                      Reviews
                    </span>
                  </span>
                </div>
                <div className="mt-3">
                  <div className="d-flex mt-4">
                    <div style={{ marginRight: "5px" }}>
                      {" "}
                      5 <i className="fas fa-star rated-yellow"></i>
                    </div>{" "}
                    <div className="progress" style={{ width: "75%" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{
                          width: `${
                            ratingPercentage(
                              props.RatingCounts && props.RatingCounts.rating_5
                            ) * 100
                          }%`,
                        }}
                        aria-valuenow="63"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>{" "}
                    <div style={{ marginLeft: "5px" }}>
                      {props.RatingCounts && props.RatingCounts.rating_5
                        ? ratingPercentage(
                            props.RatingCounts && props.RatingCounts.rating_5
                          ) * 100
                        : "0"}
                      %
                    </div>
                  </div>
                  <div className="d-flex mt-3">
                    <div style={{ marginRight: "5px" }}>
                      {" "}
                      4 <i className="fas fa-star rated-yellow"></i>
                    </div>{" "}
                    <div className="progress" style={{ width: "75%" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{
                          width: `${
                            ratingPercentage(
                              props.RatingCounts && props.RatingCounts.rating_4
                            ) * 100
                          }%`,
                        }}
                        aria-valuenow="10"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>{" "}
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      {props.RatingCounts && props.RatingCounts.rating_4
                        ? ratingPercentage(
                            props.RatingCounts && props.RatingCounts.rating_4
                          ) * 100
                        : 0}
                      %
                    </div>
                  </div>
                  <div className="d-flex mt-3">
                    <div style={{ marginRight: "5px" }}>
                      {" "}
                      3 <i className="fas fa-star rated-yellow"></i>
                    </div>{" "}
                    <div className="progress" style={{ width: "75%" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{
                          width: `${
                            ratingPercentage(
                              props.RatingCounts && props.RatingCounts.rating_3
                            ) * 100
                          }%`,
                        }}
                        aria-valuenow="6"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>{" "}
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      {props.RatingCounts && props.RatingCounts.rating_3
                        ? ratingPercentage(
                            props.RatingCounts && props.RatingCounts.rating_3
                          ) * 100
                        : 0}
                      %
                    </div>
                  </div>
                  <div className="d-flex mt-3">
                    <div style={{ marginRight: "5px" }}>
                      {" "}
                      2 <i className="fas fa-star rated-yellow"></i>
                    </div>{" "}
                    <div className="progress" style={{ width: "75%" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{
                          width: `${
                            ratingPercentage(
                              props.RatingCounts && props.RatingCounts.rating_2
                            ) * 100
                          }%`,
                        }}
                        aria-valuenow="12"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>{" "}
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      {props.RatingCounts && props.RatingCounts.rating_2
                        ? ratingPercentage(
                            props.RatingCounts && props.RatingCounts.rating_2
                          ) * 100
                        : 0}
                      %
                    </div>
                  </div>
                  <div className="d-flex mt-3">
                    <div style={{ marginRight: "5px" }}>
                      {" "}
                      1 <i className="fas fa-star rated-yellow"></i>
                    </div>{" "}
                    <div className="progress" style={{ width: "75%" }}>
                      <div
                        className="progress-bar bg-warning"
                        role="progressbar"
                        style={{
                          width: `${
                            ratingPercentage(
                              props.RatingCounts && props.RatingCounts.rating_1
                            ) * 100
                          }%`,
                        }}
                        aria-valuenow="9"
                        aria-valuemin="0"
                        aria-valuemax="100"
                      ></div>
                    </div>{" "}
                    <div style={{ marginLeft: "5px" }}>
                      {" "}
                      {props.RatingCounts && props.RatingCounts.rating_1
                        ? ratingPercentage(
                            props.RatingCounts && props.RatingCounts.rating_1
                          ) * 100
                        : 0}
                      %,
                    </div>
                  </div>
                </div>
              </Col>
              <Col sm="6">
                <h4 className="ftw-400">Review this product</h4>
                <p>Ultrices eros in cursus turpis massa tincidunt cursus.</p>
                <div>
                  <ReactStars
                    count={5}
                    onChange={setRating}
                    size={30}
                    isHalf={false}
                    emptyIcon={<i className="fas fa-star unrated"></i>}
                    fullIcon={<i className="fas fa-star rated-yellow"></i>}
                    activeColor="#fbbf24"
                    classNames="user_rating_star"
                  />
                </div>
                <div className="mt-3">
                  <textarea
                    className="form-control"
                    rows={5}
                    value={Review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </div>
                <div style={{ float: "right" }} className="mt-4">
                  <button
                    className="btn btn-success"
                    onClick={() => CreateReview()}
                  >
                    Submit Review
                  </button>
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col sm="12">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4 className="ftw-400">Top Reviews</h4>
                  </div>
                  {/* <div className="row" style={{ alignItems: "center" }}>
                    <div className="col-4"> Sort by : </div>
                    <div className="col-8">
                      {" "}
                      <select className="form-control">
                        <option>Top Reviews</option>
                      </select>
                    </div>
                  </div> */}
                </div>
                {props.UserReviewsAndRating &&
                  props.UserReviewsAndRating.map((item, index) => (
                    <div className="mt-3" key={index}>
                      <div className="d-flex">
                        <div className="reviewer-img">
                          <img src={`${Endpoint}/${item.ProfilePic}`} />
                        </div>
                        <div style={{ marginLeft: "20px" }}>
                          <h6 className="ftw-400 mb-1">{item.UserName}</h6>
                          <p className="mb-1">
                            {moment(item.LastUpdate).format("DD/MM/YYYY")}
                          </p>
                          <div>
                            <span className="dotd-rate">
                              {RatingStars(item.Rating)}
                            </span>
                          </div>
                          <div className="mt-3">
                            <p>
                              <strong> {item.Review}</strong>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    )
  );
}
export default ProductDetailRatingAndReviews;
