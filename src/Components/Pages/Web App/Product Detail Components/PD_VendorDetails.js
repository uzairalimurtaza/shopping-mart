import Endpoint from "./../../../../Utils/Endpoint";
import { useHistory } from "react-router-dom";
import RatingStars from "./../../../../Helpers/RatingStars";
function Product_Details_VendorDetails(props) {
  const history = useHistory();
  return (
    props.BusinessDetails && (
      <div className="mt-3 store-about">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex">
              <div>
                <img
                  className="img-fluid"
                  style={{
                    borderRadius: "50%",
                    width: "130px",
                    height: "130px",
                  }}
                  src={`${Endpoint}/${props.BusinessDetails.CompanyLogo}`}
                />
              </div>
              <div className="mt-2">
                <ul className="list-style-none">
                  <h4 className="ftw-400">
                    {props.BusinessDetails.CompanyName}
                  </h4>
                  <li className="mt-2">
                    <i className="fas fa-map-marker-alt text-default"></i>
                    <span
                      className="text-secondary"
                      style={{ marginLeft: "10px" }}
                    >
                      {props.BusinessDetails.Address1 ||
                        props.BusinessDetails.Address2}
                    </span>
                  </li>
                  <li className="mt-2">
                    <i className="fas fa-phone-alt  text-default"></i>{" "}
                    <span
                      className="text-secondary"
                      style={{ marginLeft: "10px" }}
                    >
                      {" "}
                      {props.BusinessDetails.BusinessPhone}
                    </span>
                  </li>
                  <li className="mt-2">
                    <i className="fas fa-envelope text-default"></i>
                    <span
                      className="text-secondary"
                      style={{ marginLeft: "10px" }}
                    >
                      {" "}
                      {props.BusinessDetails.BusinessEmail}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="d-flex justify-content-between align-center">
              <div>
                <h4 className="avg-rating ftw-400">
                  {" "}
                  {props.AverageRatingAndReviews &&
                  parseFloat(
                    props.AverageRatingAndReviews.VendorRating
                  ).toFixed(1) === "NaN"
                    ? "0.0"
                    : parseFloat(
                        props.AverageRatingAndReviews.VendorRating
                      ).toFixed(1)}{" "}
                </h4>
              </div>
              <div>
                <div style={{ marginLeft: "20px" }}>
                  <div>
                    <span className="dotd-rate">
                      {RatingStars(
                        props.AverageRatingAndReviews &&
                          parseFloat(
                            props.AverageRatingAndReviews.VendorRating
                          ).toFixed(1)
                      )}
                    </span>
                  </div>
                  <div className="text-dark">
                    {props.AverageRatingAndReviews &&
                      props.AverageRatingAndReviews.Total_Reviews}{" "}
                    Reviews
                  </div>
                </div>
              </div>
              <div>
                <button
                  className="btn btn-light"
                  onClick={() => history.push(props.BusinessDetails.PageURL)}
                >
                  Go To Store
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          dangerouslySetInnerHTML={{ __html: props.BusinessDetails.About }}
        ></div>
      </div>
    )
  );
}
export default Product_Details_VendorDetails;
