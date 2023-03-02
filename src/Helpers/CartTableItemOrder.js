import { Link } from "react-router-dom";
import Endpoint from "./../../../../../Utils/Endpoint";
import RatingStars from "./../../../../../Helpers/RatingStars";
import { useState } from "react";
import {
  AddCartItems,
  GetCartItems,
} from "./../../../../../Actions/CartAction";
import { useDispatch } from "react-redux";
import BanglaBazarApi from "./../../../../Api/BanglaBazarApi";
import firetoast from "./../../../../../Helpers/FireToast";
function CartTableItemOrder({
  product,
  variants,
  removeCartItem,
  index,
  allVariants,
  selectedItemIds,
  setSelectedItemsIds,
}) {
  const [counter, setCounter] = useState(parseInt(product.Total_Quantity));
  const dispatch = useDispatch();
  let getSingleTotal = (status) => {
    let array = variants;
    let basePrice = parseFloat(product.Price);
    let variantValues = [];
    var variationsSum = 0;
    for (let i = 0; i < array.length; i++) {
      variationsSum += parseFloat(array[i].ProductCombinationPrice);
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
  let setInventoryMinCount = () => {
    let array = allVariants;
    let indexes = Object.keys(allVariants);

    let inventories = [];
    for (let i = 0; i < indexes.length; i++) {
      inventories.push(array[indexes[i]].AvailableInventory);
    }
    let count = Math.min(...inventories);
    return count;
  };
  var updateCounter = async (val) => {
    let MinCount = setInventoryMinCount();
    console.log(MinCount);
    if (MinCount) {
      if (MinCount > 0) {
        if (val === "-") {
          if (counter > 1) {
            await setCounter(counter - 1);
            await updateCount("-1");
          }
        } else {
          if (counter < MinCount) {
            await setCounter(counter + 1);
            await updateCount("+1");
          }
        }
      }
    }
  };
  var updateCount = async (counter) => {
    let dataObject = {};

    let ProductObj = {
      ProductID: product.ProductID,
      Quantity: counter,
    };

    console.log(ProductObj);
    let ProductDetail = [];
    let indexes = Object.keys(allVariants);
    let SelectedObj = allVariants;
    let ProductVariantCombinationDetail = [];
    for (let i = 0; i < indexes.length; i++) {
      ProductVariantCombinationDetail.push({
        ProductVariantCombinationID:
          SelectedObj[indexes[i]].ProductVariantCombinationID,
      });
    }
    ProductObj.ProductVariantCombinationDetail =
      ProductVariantCombinationDetail;
    ProductDetail.push(ProductObj);
    dataObject.ProductDetail = ProductDetail;
    try {
      const response = await BanglaBazarApi.put(
        `${Endpoint}/api/wish-list/updateCart`,
        dataObject
      );
      if (response.data.status) {
        dispatch(GetCartItems());
      } else {
        var { error, message } = response.data;
        firetoast(error || message, "default-error");
      }
    } catch (e) {
      firetoast("Something went wrong while updating count", "default-error");
    }
  };
  return (
    <tr>
      <td>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input default-check-color"
            type="checkbox"
            id="inlineCheckbox3"
            onChange={(e) => {
              if (e.target.checked) {
                var array = [...selectedItemIds];
                if (!array.includes(product.ProductID)) {
                  array.push(product.ProductID);
                  setSelectedItemsIds(array);
                }
              } else {
                var array = [...selectedItemIds];
                if (array.includes(product.ProductID)) {
                  var currentIndex = array.indexOf(product.ProductID);
                  array.splice(currentIndex, 1);
                  setSelectedItemsIds(array);
                }
              }
            }}
          />
        </div>
      </td>
      <td style={{ width: "15%", position: "relative" }}>
        {" "}
        <img
          src={`${Endpoint}/${product.Medium}`}
          className="img-fluid w-100 h-100"
        />
        <div
          className="cartItem-remove"
          onClick={() => removeCartItem(product.ProductID, index)}
        >
          <Link to="#" className="badge td-none">
            <i className="fas fa-times"></i>
          </Link>
        </div>
      </td>
      <td>
        <div className="mt-2">
          <div>{product.Title}</div>

          <div>
            Vendor :{" "}
            <small className="text-secondary">{product.CompanyName}</small>
          </div>
          <div>
            <span className="dotd-rate">
              {RatingStars(
                product.AVG_Rating ? parseInt(product.AVG_Rating) : 0
              )}
              ({product.REVIEW_COUNT})
            </span>
          </div>
          {product.AllowStorePickup === "Y" && (
            <div>
              <small>
                <span className="text-orange">
                  Store pick up available for {product.City}
                </span>
              </small>
            </div>
          )}
        </div>
      </td>
      <td>{`${product.Currency} ${getSingleTotal(0)}`}</td>
      <td>
        {" "}
        <div className="d-flex product-quantity">
          <div>
            <button
              className="counter-btn minus-btn"
              onClick={() => updateCounter("-")}
            >
              -
            </button>
          </div>
          <div className="product-quantity">{counter}</div>
          <div>
            <button
              className="counter-btn plus-btn"
              onClick={() => updateCounter("+")}
            >
              +
            </button>
          </div>
        </div>
      </td>
      <td>{`${product.Currency} ${getSingleTotal(1)}`}</td>
    </tr>
  );
}
export default CartTableItemOrder;
