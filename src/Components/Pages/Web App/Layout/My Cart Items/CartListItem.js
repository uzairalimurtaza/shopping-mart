import { useHistory } from "react-router-dom";
import Endpoint from "./../../../../../Utils/Endpoint";
import { CurrentUser } from "./../../../../../Helpers/Auth";
function CartListItem({
  product,
  variants,
  removeCartItem,
  index,
  removeUnAuthCartItem,
}) {
  const history = useHistory();
  let getSingleTotal = (status) => {
    let array = variants;
    let basePrice = parseFloat(product.Price || product.Price);
    let variantValues = [];
    var variationsSum = 0;
    for (let i = 0; i < array.length; i++) {
      variationsSum += parseFloat(
        array[i].ProductCombinationPrice || array[i].TotalPrice
      );
      variantValues.push(array[i].OptionValue);
    }
    const totalSingle = basePrice + variationsSum;

    if (status === 0) {
      return totalSingle;
    } else if (status === 1) {
      return parseFloat(product.Total_Quantity) * totalSingle;
    } else {
      return variantValues.join(",");
    }
  };
  return (
    product && (
      <div className="cart-list-item">

        <div
          className="remove-cart-item"
          onClick={() => {
            if (CurrentUser) {
              removeCartItem(product.ProductID, index);
            } else {
              removeUnAuthCartItem(index);
            }
          }}
        >
          <small>
            {" "}
            <i className="fas fa-times text-secondary"></i>
          </small>
        </div>
        <div className="row">
          <div className="col-4 p-0">
            <img
              src={`${Endpoint}/${variants && variants[0].Medium}`}
              className="w-100 h-100"
            />
          </div>
          <div className="col-8 cart-item-detail">
            <h6>{product.Title}</h6>
            <p>
              <small>{variants && getSingleTotal(2)}</small>
            </p>
            <div className="text-danger">{`${product.Currency} ${variants && getSingleTotal(0).toFixed(2)
              }`}</div>
            <div>
              <p>
                <small>
                  Total :{" "}
                  {`${product.Currency} ${variants && getSingleTotal(1).toFixed(2)
                    }`}
                </small>
              </p>
            </div>
          </div>
        </div>
        {CurrentUser && (
          <div className="row mt-2">
            <div className="col-6">
              {/* <button
                className="btn btn-default-outline w-100 btn-block"
                onClick={() => history.push("/my-cart")}
              >
                View Details
              </button> */}
            </div>
            <div className="col-6">
              <button
                className="btn btn-success w-100 btn-block"
                onClick={() =>
                  history.push(
                    `/my-cart/delivery-details?product=${index}&GlobalShipping=${product.ShippingGlobal}&ShippingAvailable=${product.ShippingAvailable}&City=${product.City}
                    `
                  )
                }
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}
export default CartListItem;
