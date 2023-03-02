import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Endpoint from "./Endpoint";
import AddProductClick from "./../Helpers/AddProductClick";
import RatingStars from "./../Helpers/RatingStars";
import BanglaBazarApi from "./../Components/Api/BanglaBazarApi";
import firetoast from "./../Helpers/FireToast";
function UserBrowsingProducts({ item, type, RemoveFromBrowsing, index }) {
  const history = useHistory();
  const state = useSelector((state) => state);
  const { currentIPv4 } = state;
  var addToWishList = async () => {
    try {
      var response = await BanglaBazarApi.post(
        `${Endpoint}/api/wish-list/addUserWishList`,
        {
          ProductID: item.productID,
          //   ProductVariantCombinationID:
          //     CurrentlyActive.ProductVariantCombinationID,
        }
      );
      if (response.data.status) {
        firetoast("Added to Wishlist", "success", 3000, "top-right");
      } else {
        var { message, error } = response.data;
        firetoast(message || error, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong!", "default-error");
    }
  };
  return (
    <div className="card deal-carousel-item">
      <div className="deal-image">
        <div className="profile-image-block">
          <img
            className="card-img-top m-auto"
            src={`${Endpoint}/${item.Medium}`}
            style={{ height: "150px" }}
            alt="Card image cap"
            onClick={() => {
              AddProductClick(item, currentIPv4);
              history.push(`/product-details/${item.ProductID}`);
            }}
          />

          <div className="profile-img-overlay">
            <div
              className="text text-default p-1"
              style={{ cursor: "pointer", background: "white" }}
              onClick={() => RemoveFromBrowsing(index, item)}
            >
              <i className="fas fa-trash"></i> Remove
            </div>
          </div>
        </div>

        {/* <div className="image-text">
          <div>
            <button className="rounded-circle image-text-button">
              {" "}
              <i className="fas fa-shopping-cart"></i>
            </button>
          </div>
        </div> */}
      </div>
      <div className="card-body deal-carousel-item-body">
        <h5 className="card-title ftw-400">
          {" "}
          <Link
            to="#"
            onClick={() => {
              AddProductClick(item, currentIPv4);
              history.push(`/product-details/${item.ProductID}`);
            }}
            className="text-default td-none"
          >
            {item.Title}
          </Link>
        </h5>
        {type !== "recent" && (
          <>
            <p className="card-text mb-0">
              <span className="dotd-rate">
                {RatingStars(
                  item.AVG_RATING
                    ? parseInt(item.AVG_RATING)
                    : item.AVG_Rating
                    ? parseInt(item.AVG_Rating)
                    : 0
                )}
              </span>
              <div>
                {" "}
                <span>
                  ( {item.REVIEW_COUNT ? item.REVIEW_COUNT : 0} Reviews)
                </span>
              </div>
            </p>
            <div>
              <span className="dotd-rate">
                <span className="text-dark">
                  {item.Currency}{" "}
                  <span style={{ marginLeft: "5px" }}>
                    {parseFloat(item.Price).toFixed(2)}
                  </span>
                </span>{" "}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default UserBrowsingProducts;
